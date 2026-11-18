'use client'

// 作品頁的流程圖，畫法像 Mermaid 的 flowchart：步驟可以分岔、匯合、往回走，還能用分組框（子圖）圈起來。
// 位置由 dagre 排（由上到下），節點和線用網站自己的樣式畫。
// 先量每個步驟和線上文字的大小，交給 dagre 排好，再照排好的座標放上去；容器寬度跨過 NARROW_BELOW 時重排一次。
// 資料在作品 JSON 的 flow（格式見 lib/content/contract.ts 的 FlowStep；連線規則見 data/projects.ts 的 flowEdges）。
// 互動：指到（手機上點一下）某一步，它和相連的步驟、線亮起來，其他變淡；「跑一遍」讓一個小點沿線走過一條路（walkFlow 挑路）。
import dagre from '@dagrejs/dagre'
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { flowEdges, walkFlow, type FlowStep, type FlowWalk } from '@/data/projects'
import { measureText } from './useMeasuredBoxes'

/**
 * 排版間距（px）：同一層節點之間、上下層之間（要放得下分組框的標題）、平行的線之間。
 * 容器窄於 NARROW_BELOW（手機）時節點和間距都縮小，圖比較不會超出畫面；還是太寬就在框裡左右滑。
 */
const SPACING = {
  wide: { node: 28, rank: 60, edge: 16, nodeMax: 208 },
  narrow: { node: 14, rank: 48, edge: 10, nodeMax: 132 },
}
const NARROW_BELOW = 560
/** 分組框：框和裡面節點的距離；圖的上下邊界替一行標題預留的高度（px，標題換行時整張圖會再往下移）。 */
const GROUP_PAD = 12
const GROUP_CAPTION = 18
/** 判斷的六角形：左右兩端內縮多少（px）。 */
const DECISION_INSET = 14
/** 「跑一遍」的節奏（ms）：每一步停多久、小點沿線走多久；要求減少動態時不走動畫，每一步停 reduced 這麼久。 */
const WALK_TIMING = { pause: 650, travel: 550, reduced: 1000 }

const LABEL_CLASS = 'rounded bg-paper px-1 font-mono text-[11px] leading-tight [overflow-wrap:anywhere]'
/** 分組框標題：有底色，穿過的線會被蓋在下面，字還是讀得到。 */
const CAPTION_CLASS = 'rounded bg-paper px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-muted'

interface Placed {
  x: number
  y: number
  w: number
  h: number
}

interface Layout {
  width: number
  height: number
  nodes: Record<string, Placed>
  edges: { d: string; decision: boolean; back: boolean; label?: Placed & { text: string } }[]
  /** 分組框（左上角座標和大小），和它標題的左上角與寬度（在框的上緣或下緣，挑線最少的空位）。 */
  groups: (Placed & { label: string; caption: { x: number; y: number; w: number } })[]
}

interface Rect {
  left: number
  top: number
  right: number
  bottom: number
}

const overlaps = (a: Rect, b: Rect) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
/** 分組框標題：離框左右邊多遠、離框上下邊和線多遠、沿著框邊找空位時每次移多少、縮進線之間的空隙時最窄多寬（px）。 */
const CAPTION_INSET = 8
const CAPTION_GAP = 3
const CAPTION_STEP = 8
const CAPTION_MIN = 56

/** 把折線切細，取樣成點，用來判斷標題會不會被線穿過。 */
function densify(points: { x: number; y: number }[], step = 6) {
  const out: { x: number; y: number }[] = []
  for (let i = 0; i < points.length - 1; i++) {
    const [a, b] = [points[i], points[i + 1]]
    const n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / step))
    for (let k = 0; k < n; k++) out.push({ x: a.x + ((b.x - a.x) * k) / n, y: a.y + ((b.y - a.y) * k) / n })
  }
  return out
}

/** 把 dagre 給的折線點畫成平滑曲線（B-spline，和 d3 的 curveBasis 同一種）。 */
function basis(points: { x: number; y: number }[]) {
  if (points.length < 3) return `M${points.map((p) => `${p.x},${p.y}`).join(' L')}`
  let d = `M${points[0].x},${points[0].y} L${(5 * points[0].x + points[1].x) / 6},${(5 * points[0].y + points[1].y) / 6}`
  for (let i = 1; i < points.length - 1; i++) {
    const [p0, p1, p2] = [points[i - 1], points[i], points[i + 1]]
    d += ` C${(2 * p0.x + p1.x) / 3},${(2 * p0.y + p1.y) / 3} ${(p0.x + 2 * p1.x) / 3},${(p0.y + 2 * p1.y) / 3} ${(p0.x + 4 * p1.x + p2.x) / 6},${(p0.y + 4 * p1.y + p2.y) / 6}`
  }
  const [a, b] = [points[points.length - 2], points[points.length - 1]]
  return `${d} C${(2 * a.x + b.x) / 3},${(2 * a.y + b.y) / 3} ${(a.x + 2 * b.x) / 3},${(a.y + 2 * b.y) / 3} ${b.x},${b.y}`
}

function StepBox({ step, width, measure = false }: { step: FlowStep; width?: number; measure?: boolean }) {
  // 量大小用的副本標 data-measure，畫面上的標 data-box（版面檢查只看畫面上的）。
  const mark = measure ? { 'data-measure': step.id } : { 'data-box': `step:${step.id}` }
  const text = (
    <>
        <span className="block text-sm font-semibold leading-snug [overflow-wrap:anywhere]">{step.label}</span>
        {step.detail && <span className="mt-0.5 block font-mono text-[11px] leading-snug text-muted [overflow-wrap:anywhere]">{step.detail}</span>}
    </>
  )
  const size: CSSProperties = width ? { width } : {}
  if (step.kind === 'decision') {
    // 外層是框線色、內層是底色，兩層用同一個六角形裁切，看起來就是有框的六角形。
    const shape = { clipPath: `polygon(${DECISION_INSET}px 0, calc(100% - ${DECISION_INSET}px) 0, 100% 50%, calc(100% - ${DECISION_INSET}px) 100%, ${DECISION_INSET}px 100%, 0 50%)` }
    return (
      <div {...mark} className="bg-clip/70 p-[1.5px]" style={{ ...shape, ...size }}>
        <div className="bg-clip-soft px-7 py-2.5 text-center" style={shape}>
          {text}
        </div>
      </div>
    )
  }
  const terminal = step.kind === 'start' || step.kind === 'end'
  return (
    <div
      {...mark}
      style={size}
      className={`border px-4 py-2.5 text-center ${terminal ? 'rounded-full border-ink/25 bg-paper' : 'rounded-xl border-line bg-surface'}`}
    >
      {text}
    </div>
  )
}

export default function FlowGraph({ steps }: { steps: FlowStep[] }) {
  const uid = useId().replace(/:/g, '')
  const wrap = useRef<HTMLDivElement>(null)
  const measureRoot = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const dot = useRef<SVGGElement>(null)
  const [boxWidth, setBoxWidth] = useState(0)
  const [layout, setLayout] = useState<Layout | null>(null)
  // 指到的步驟；正在「跑一遍」時不理它，免得滑鼠經過就打斷。
  const [focus, setFocus] = useState<string | null>(null)
  // 「跑一遍」走的路和走到第幾步；plays 是按過幾次，決定這次在岔路選哪條。
  const [walk, setWalk] = useState<(FlowWalk & { at: number }) | null>(null)
  const [playing, setPlaying] = useState(false)
  const [plays, setPlays] = useState(0)
  const { t } = useLanguage()
  const edges = flowEdges(steps)
  const labelOf = new Map(steps.map((step) => [step.id, step.label]))
  const narrow = boxWidth > 0 && boxWidth < NARROW_BELOW
  const space = narrow ? SPACING.narrow : SPACING.wide
  const maxWidth = space.nodeMax
  // 圖比框寬（手機上常見）時，在框下面提示可以左右滑。
  const overflowing = layout !== null && boxWidth > 0 && layout.width > boxWidth + 1

  // 哪些步驟和線亮著：指到某一步時是它和相連的；跑一遍時是走過的。都沒有就全部照常。
  const mode = focus && !playing ? 'focus' : walk ? 'walk' : null
  const litEdges = new Set<number>()
  let litSteps: Set<string> | null = null
  let current: string | null = null
  if (mode === 'focus') {
    edges.forEach((edge, index) => (edge.from === focus || edge.to === focus) && litEdges.add(index))
    litSteps = new Set([focus!, ...[...litEdges].flatMap((index) => [edges[index].from, edges[index].to])])
    current = focus
  } else if (mode === 'walk') {
    walk!.via.slice(0, walk!.at).forEach((index) => litEdges.add(index))
    litSteps = new Set(walk!.path.slice(0, walk!.at + 1))
    current = walk!.path[walk!.at]
  }
  const finished = walk !== null && !playing && walk.at >= walk.path.length - 1
  const arrivedBy = walk && walk.at > 0 ? edges[walk.via[walk.at - 1]]?.label : undefined

  const togglePlay = () => {
    if (playing) {
      setPlaying(false)
      setWalk(null)
      return
    }
    setFocus(null)
    setWalk({ ...walkFlow(steps, edges, plays), at: 0 })
    setPlays((count) => count + 1)
    setPlaying(true)
  }
  // 滑鼠：移進來亮、移出去恢復。觸控和筆：點一下亮，再點一下恢復。
  const pointAt = (id: string) => ({
    onPointerEnter: (event: PointerEvent) => event.pointerType === 'mouse' && setFocus(id),
    onPointerLeave: (event: PointerEvent) => event.pointerType === 'mouse' && setFocus((was) => (was === id ? null : was)),
    onPointerUp: (event: PointerEvent) => event.pointerType !== 'mouse' && setFocus((was) => (was === id ? null : id)),
  })

  // 量容器寬度：跨過門檻時換節點寬度、重排；也用來判斷要不要顯示左右滑的提示。
  useLayoutEffect(() => {
    const el = wrap.current
    if (!el) return
    const check = () => setBoxWidth(el.clientWidth)
    check()
    const observer = new ResizeObserver(check)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // 量大小 → dagre 排版 → 存座標。字型載入後再排一次（字寬會變）。
  useLayoutEffect(() => {
    const host = measureRoot.current
    if (!host) return
    const run = () => {
      const sizes = new Map<string, { w: number; h: number }>()
      host.querySelectorAll<HTMLElement>('[data-measure]').forEach((el) => {
        const r = el.getBoundingClientRect()
        sizes.set(el.getAttribute('data-measure')!, { w: Math.ceil(r.width) + 1, h: Math.ceil(r.height) })
      })
      const g = new dagre.graphlib.Graph({ compound: true, multigraph: true })
      g.setGraph({ rankdir: 'TB', nodesep: space.node, ranksep: space.rank, edgesep: space.edge, marginx: GROUP_PAD + 2, marginy: GROUP_PAD + GROUP_CAPTION + 2 })
      g.setDefaultEdgeLabel(() => ({}))
      for (const step of steps) {
        const size = sizes.get(step.id) ?? { w: maxWidth, h: 40 }
        g.setNode(step.id, { width: size.w, height: size.h })
      }
      const groupNames = [...new Set(steps.map((step) => step.group).filter(Boolean))] as string[]
      groupNames.forEach((name, i) => {
        g.setNode(`group:${i}`, {})
        for (const step of steps) if (step.group === name) g.setParent(step.id, `group:${i}`)
      })
      const labelSizes = edges.map((edge) => (edge.label ? measureText(host, edge.label, LABEL_CLASS, 120) : undefined))
      edges.forEach((edge, i) => {
        const size = labelSizes[i]
        g.setEdge(edge.from, edge.to, size ? { width: size.width, height: size.height, labelpos: 'c' } : {}, `e${i}`)
      })
      dagre.layout(g)

      const nodes: Layout['nodes'] = {}
      for (const step of steps) {
        const n = g.node(step.id)
        nodes[step.id] = { x: n.x, y: n.y, w: n.width, h: n.height }
      }
      const decisions = new Set(steps.filter((step) => step.kind === 'decision').map((step) => step.id))
      const routes = edges.map((edge, i) => {
        const e = g.edge({ v: edge.from, w: edge.to, name: `e${i}` })
        const size = labelSizes[i]
        return { edge, points: e.points, label: edge.label && size ? { text: edge.label, x: e.x, y: e.y, w: size.width, h: size.height } : undefined }
      })
      const linePoints = routes.flatMap((route) => densify(route.points))
      const rectOf = (p: Placed): Rect => ({ left: p.x - p.w / 2, top: p.y - p.h / 2, right: p.x + p.w / 2, bottom: p.y + p.h / 2 })
      const obstacles = [...Object.values(nodes), ...routes.flatMap((route) => (route.label ? [route.label] : []))].map(rectOf)

      // 分組框包住成員。標題放在框的上緣或下緣：從左到右每隔 CAPTION_STEP 試一個位置打分數
      // （穿過的線越多越差，碰到步驟或線上文字就不考慮），選最好的；同分時上緣優先、靠左優先。
      // 標題在上緣就在框的上方多留標題的高度，在下緣就留在下方。標題寬度有上限，會換行，高度照實量。
      const groups = groupNames.map((name) => {
        const members = steps.filter((step) => step.group === name).map((step) => nodes[step.id])
        const left = Math.min(...members.map((m) => m.x - m.w / 2)) - GROUP_PAD
        const right = Math.max(...members.map((m) => m.x + m.w / 2)) + GROUP_PAD
        const innerTop = Math.min(...members.map((m) => m.y - m.h / 2)) - GROUP_PAD
        const innerBottom = Math.max(...members.map((m) => m.y + m.h / 2)) + GROUP_PAD
        const oneLine = measureText(host, name, CAPTION_CLASS, right - left - 2 * CAPTION_INSET)
        const tryAt = (atTop: boolean, x: number, size: { width: number; height: number }) => {
          const band = size.height + 2 * CAPTION_GAP
          const y = atTop ? innerTop - band + CAPTION_GAP : innerBottom + CAPTION_GAP
          const r = { left: x - 2, top: y - 2, right: x + size.width + 2, bottom: y + size.height + 2 }
          const crossings = linePoints.filter((p) => p.x > r.left && p.x < r.right && p.y > r.top && p.y < r.bottom).length
          // 換行的標題比較高、比較擠，同樣沒有線穿過時，一行的優先。
          const wrapped = size.height > oneLine.height ? 0.5 : 0
          return { atTop, x, y, band, size, score: crossings + wrapped + (obstacles.some((o) => overlaps(r, o)) ? 1000 : 0) }
        }
        const candidates = [true, false].flatMap((atTop) => {
          // 一行的標題沿著框邊滑動。
          const first = left + CAPTION_INSET
          const last = right - CAPTION_INSET - oneLine.width
          const xs = [...Array.from({ length: Math.max(1, Math.floor((last - first) / CAPTION_STEP) + 1) }, (_, i) => first + i * CAPTION_STEP), last]
          const slides = xs.map((x) => tryAt(atTop, x, oneLine))
          // 框太窄、線又剛好從中間穿過時：找出穿過標題那一條的線之間的空隙，把標題縮成空隙的寬度（會換行）放進去。
          const bandTop = atTop ? innerTop - oneLine.height - 2 * CAPTION_GAP : innerBottom
          const cuts = linePoints
            .filter((p) => p.y >= bandTop && p.y <= bandTop + oneLine.height + 2 * CAPTION_GAP && p.x > left && p.x < right)
            .map((p) => p.x)
            .sort((a, b) => a - b)
          const walls = [left + CAPTION_INSET - CAPTION_GAP, ...cuts, right - CAPTION_INSET + CAPTION_GAP]
          const gaps = walls.slice(1).map((x, i) => ({ from: walls[i] + CAPTION_GAP, to: x - CAPTION_GAP })).filter((gap) => gap.to - gap.from >= CAPTION_MIN)
          const fits = gaps.map((gap) => tryAt(atTop, gap.from, measureText(host, name, CAPTION_CLASS, gap.to - gap.from)))
          return [...slides, ...fits]
        })
        const best = candidates.reduce((winner, candidate) => (candidate.score < winner.score ? candidate : winner))
        const top = best.atTop ? innerTop - best.band : innerTop
        const bottom = best.atTop ? innerBottom : innerBottom + best.band
        return { label: name, x: left, y: top, w: right - left, h: bottom - top, caption: { x: best.x, y: best.y, w: best.size.width } }
      })

      // 分組框可能超出 dagre 留的邊界（標題換行時），整張圖往下移、加高，讓框和標題都在圖裡面。
      const graph = g.graph()
      const shift = Math.max(0, ...groups.map((group) => 2 - group.y))
      const height = Math.max(graph.height ?? 0, ...groups.map((group) => group.y + group.h + 2)) + shift
      for (const node of Object.values(nodes)) node.y += shift
      for (const group of groups) {
        group.y += shift
        group.caption.y += shift
      }
      const laidEdges: Layout['edges'] = routes.map(({ edge, points, label }) => ({
        d: basis(points.map((p: { x: number; y: number }) => ({ x: p.x, y: p.y + shift }))),
        decision: decisions.has(edge.from),
        back: edge.back,
        label: label ? { ...label, y: label.y + shift } : undefined,
      }))
      setLayout({ width: Math.ceil(graph.width ?? 0), height: Math.ceil(height), nodes, edges: laidEdges, groups })
    }
    run()
    document.fonts?.ready.then(run).catch(() => {})
    // steps、narrow 變了才重排；edges、space、maxWidth 都由它們推出來。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps, narrow])

  // 跑一遍：在目前這一步停一下，小點沿著下一條線走到下一步，再換下一步；走到底就停。
  useEffect(() => {
    const marker = dot.current
    if (!walk || !playing || walk.at >= walk.path.length - 1) {
      if (marker) marker.style.opacity = '0'
      if (playing) setPlaying(false)
      return
    }
    const advance = () => setWalk((was) => (was ? { ...was, at: was.at + 1 } : was))
    const line = svg.current?.querySelector<SVGPathElement>(`[data-edge="${walk.via[walk.at]}"]`)
    let frame = 0
    let timer = 0
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !line || !marker) {
      timer = window.setTimeout(advance, WALK_TIMING.reduced)
    } else {
      // 節奏由計時器決定，動畫影格只負責畫小點：分頁在背景、瀏覽器不給影格時，照樣走到下一步（小點不動而已）。
      timer = window.setTimeout(() => {
        const length = line.getTotalLength()
        const began = performance.now()
        const tick = (now: number) => {
          const k = Math.min(1, (now - began) / WALK_TIMING.travel)
          const eased = k < 0.5 ? 2 * k * k : 1 - (2 - 2 * k) ** 2 / 2
          const point = line.getPointAtLength(length * eased)
          marker.setAttribute('transform', `translate(${point.x} ${point.y})`)
          marker.style.opacity = '1'
          if (k < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
        timer = window.setTimeout(advance, WALK_TIMING.travel)
      }, WALK_TIMING.pause)
    }
    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [walk, playing])

  // 圖比框寬時，跑到框外的那一步要捲進來。
  useEffect(() => {
    const el = wrap.current
    if (!walk || !layout || !el || el.scrollWidth <= el.clientWidth + 1) return
    const node = layout.nodes[walk.path[walk.at]]
    if (node.x - node.w / 2 >= el.scrollLeft && node.x + node.w / 2 <= el.scrollLeft + el.clientWidth) return
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ left: node.x - el.clientWidth / 2, behavior: smooth ? 'smooth' : 'auto' })
  }, [walk, layout])

  const hasBranch = layout?.edges.some((edge) => edge.decision) ?? false
  const hasBack = layout?.edges.some((edge) => edge.back) ?? false
  const status = walk
    ? finished
      ? t('project.flowDone', { steps: walk.path.length })
      : `${walk.at + 1} / ${walk.path.length} · ${arrivedBy ? `${arrivedBy} → ` : ''}${labelOf.get(walk.path[walk.at])}`
    : t('project.diagramHint')

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-3">
        <button
          type="button"
          onClick={togglePlay}
          aria-pressed={playing}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1 font-mono text-xs font-semibold text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <span aria-hidden="true">{playing ? '■' : '▶'}</span>
          {playing ? t('project.flowStop') : plays > 0 ? t('project.flowAgain') : t('project.flowPlay')}
        </button>
        <p aria-live="polite" className="min-w-0 flex-1 basis-48 font-mono text-[11px] leading-snug text-muted [overflow-wrap:anywhere]">
          {status}
        </p>
        {(hasBranch || hasBack) && (
          <ul aria-hidden="true" className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-muted">
            {hasBranch && (
              <li className="flex items-center gap-1.5">
                <svg width="22" height="6" className="overflow-visible">
                  <line x1="0" y1="3" x2="22" y2="3" strokeWidth="1.5" className="stroke-clip/70" />
                </svg>
                {t('project.flowLegendBranch')}
              </li>
            )}
            {hasBack && (
              <li className="flex items-center gap-1.5">
                <svg width="22" height="6" className="overflow-visible">
                  <line x1="0" y1="3" x2="22" y2="3" strokeWidth="1.5" strokeDasharray="5 4" className="stroke-ink/35" />
                </svg>
                {t('project.flowLegendBack')}
              </li>
            )}
          </ul>
        )}
      </div>
      <div ref={wrap} className="relative overflow-x-auto">
        {/* 量大小用：照最大寬度放好每個步驟，量完就藏起來。 */}
        <div aria-hidden="true" className="pointer-events-none invisible absolute left-0 top-0 h-0 w-full overflow-hidden">
          <div ref={measureRoot} className="flex flex-wrap items-start gap-2" style={{ width: maxWidth * 4 }}>
            {steps.map((step) => (
              <div key={step.id} className="w-max" style={{ maxWidth }}>
                <StepBox step={step} measure />
              </div>
            ))}
          </div>
        </div>

        {/* 給螢幕閱讀器的文字版：每一步和它往哪裡走。 */}
        <ol className="sr-only">
          {steps.map((step) => (
            <li key={step.id}>
              {step.label}
              {step.detail ? `（${step.detail}）` : ''}
              {edges
                .filter((edge) => edge.from === step.id)
                .map((edge) => ` → ${edge.label ? `${edge.label}: ` : ''}${labelOf.get(edge.to)}`)
                .join('')}
            </li>
          ))}
        </ol>

        {layout && (
          <div aria-hidden="true" className="relative mx-auto" style={{ width: layout.width, height: layout.height }}>
            {layout.groups.map((group) => (
              <div key={group.label} className="absolute rounded-2xl border border-dashed border-ink/20" style={{ left: group.x, top: group.y, width: group.w, height: group.h }} />
            ))}
            {layout.groups.map((group) => (
              <span
                key={group.label}
                data-diagram-label=""
                className={`absolute z-[1] ${CAPTION_CLASS}`}
                style={{ left: group.caption.x, top: group.caption.y, width: group.caption.w }}
              >
                {group.label}
              </span>
            ))}
            <svg ref={svg} className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
              <defs>
                <marker id={`${uid}-m`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0,0 L8,4 L0,8 z" className="fill-ink/45" />
                </marker>
                <marker id={`${uid}-d`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0,0 L8,4 L0,8 z" className="fill-clip" />
                </marker>
                <marker id={`${uid}-w`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0,0 L8,4 L0,8 z" className="fill-accent-fill" />
                </marker>
              </defs>
              {/* data-edge：線和它的文字配對，版面檢查才分得出「文字在自己的線上」（本來就該這樣）和「蓋到別的線」。 */}
              {layout.edges.map((edge, i) => {
                const lit = litEdges.has(i)
                // 跑一遍走過的線換成柿橘色；指到某一步時，相連的線變成流動的虛線；沒亮的線變淡。
                const trail = mode === 'walk' && lit
                const tone = trail ? 'stroke-accent-fill' : edge.decision ? 'stroke-clip/70' : 'stroke-ink/35'
                const state = !mode ? '' : !lit ? 'opacity-20' : mode === 'focus' ? 'diagram-march' : ''
                return (
                  <path
                    key={i}
                    data-edge={i}
                    d={edge.d}
                    fill="none"
                    strokeWidth={trail ? 2 : 1.5}
                    strokeDasharray={edge.back ? '5 4' : undefined}
                    className={`transition-opacity duration-200 ${tone} ${state}`}
                    markerEnd={`url(#${uid}-${trail ? 'w' : edge.decision ? 'd' : 'm'})`}
                  />
                )
              })}
              {/* 跑一遍的小點：位置由動畫直接改 transform，不經過 React。 */}
              <g ref={dot} className="transition-opacity duration-200" style={{ opacity: 0 }}>
                <circle r={9} className="fill-accent-fill/25" />
                <circle r={4.5} className="fill-accent-fill" />
              </g>
            </svg>
            {steps.map((step) => {
              const n = layout.nodes[step.id]
              const dim = litSteps !== null && !litSteps.has(step.id)
              const here = current === step.id
              return (
                <div
                  key={step.id}
                  {...pointAt(step.id)}
                  className={`absolute transition-[opacity,filter] duration-200 ${dim ? 'opacity-30' : ''} ${here ? 'drop-shadow-[0_0_7px_rgb(var(--accent-fill)/0.6)]' : ''}`}
                  style={{ left: n.x - n.w / 2, top: n.y - n.h / 2 }}
                >
                  <StepBox step={step} width={n.w} />
                </div>
              )
            })}
            {layout.edges.map((edge, i) =>
              edge.label ? (
                <span
                  key={i}
                  data-diagram-label=""
                  data-edge={i}
                  className={`pointer-events-none absolute text-center transition-opacity duration-200 ${LABEL_CLASS} ${edge.decision ? 'text-clip' : 'text-muted'} ${mode && !litEdges.has(i) ? 'opacity-30' : ''}`}
                  style={{ left: edge.label.x - edge.label.w / 2, top: edge.label.y - edge.label.h / 2, width: edge.label.w }}
                >
                  {edge.label.text}
                </span>
              ) : null
            )}
          </div>
        )}
      </div>
      {overflowing && (
        <p className="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-muted">
          <span aria-hidden="true">←→</span>
          {t('project.flowScroll')}
        </p>
      )}
    </>
  )
}
