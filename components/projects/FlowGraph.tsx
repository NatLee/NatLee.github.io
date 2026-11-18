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
/** 圖比框寬時最多縮到多少倍放進框裡：0.85 時步驟標題 14px 還有 12px，說明 11px 還有 9.4px。再小就讀不清楚，改成左右捲。 */
const MIN_FIT = 0.85
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

interface Pt {
  x: number
  y: number
}
/** 一段三次貝茲曲線：起點、兩個控制點、終點。 */
type Cubic = [Pt, Pt, Pt, Pt]

/**
 * 把 dagre 給的折線點變成平滑曲線（B-spline，和 d3 的 curveBasis 同一種），拆成一段段三次貝茲曲線。
 * 畫線（pathOf）和找空位用的取樣（sampleCurve）都從這裡來，判斷「會不會碰到線」量的就是畫出來的那條。
 */
function curveOf(points: Pt[]): Cubic[] {
  const mix = (a: Pt, b: Pt, wa: number, wb: number, total: number) => ({ x: (wa * a.x + wb * b.x) / total, y: (wa * a.y + wb * b.y) / total })
  const line = (a: Pt, b: Pt): Cubic => [a, mix(a, b, 2, 1, 3), mix(a, b, 1, 2, 3), b]
  if (points.length < 3) return points.slice(1).map((p, i) => line(points[i], p))
  const first = mix(points[0], points[1], 5, 1, 6)
  const out: Cubic[] = [line(points[0], first)]
  let at = first
  for (let i = 1; i < points.length - 1; i++) {
    const [p0, p1, p2] = [points[i - 1], points[i], points[i + 1]]
    const end = { x: (p0.x + 4 * p1.x + p2.x) / 6, y: (p0.y + 4 * p1.y + p2.y) / 6 }
    out.push([at, mix(p0, p1, 2, 1, 3), mix(p0, p1, 1, 2, 3), end])
    at = end
  }
  const [a, b] = [points[points.length - 2], points[points.length - 1]]
  out.push([at, mix(a, b, 2, 1, 3), mix(a, b, 1, 2, 3), b])
  return out
}

const pathOf = (curve: Cubic[]) =>
  curve.length ? `M${curve[0][0].x},${curve[0][0].y}${curve.map(([, c1, c2, end]) => ` C${c1.x},${c1.y} ${c2.x},${c2.y} ${end.x},${end.y}`).join('')}` : ''

/** 沿著曲線大約每 step px 取一個點。 */
function sampleCurve(curve: Cubic[], step = 4): Pt[] {
  const out: Pt[] = []
  for (const [p0, c1, c2, p3] of curve) {
    const rough = Math.hypot(c1.x - p0.x, c1.y - p0.y) + Math.hypot(c2.x - c1.x, c2.y - c1.y) + Math.hypot(p3.x - c2.x, p3.y - c2.y)
    const n = Math.max(1, Math.ceil(rough / step))
    for (let k = 0; k < n; k++) {
      const t = k / n
      const u = 1 - t
      out.push({
        x: u * u * u * p0.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p3.x,
        y: u * u * u * p0.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p3.y,
      })
    }
  }
  const last = curve[curve.length - 1]?.[3]
  if (last) out.push(last)
  return out
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
  // 圖只比框寬一點時，整張縮小放進框裡（最多縮到 MIN_FIT）；再寬就照原尺寸，在框裡左右捲。
  const fit = layout && boxWidth > 0 && layout.width > boxWidth && layout.width * MIN_FIT <= boxWidth ? boxWidth / layout.width : 1
  const overflowing = layout !== null && boxWidth > 0 && layout.width * fit > boxWidth + 1

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

  // 量大小 → dagre 排版 → 存座標。
  // 排版函式每次 render 都換成最新的（最新的步驟、間距和節點寬度），存在 layoutNow；什麼時候排：
  // - 步驟內容或窄寬模式變了；
  // - 量大小用的副本尺寸變了（字型載入、換語言、換節點寬度上限），由 ResizeObserver 通知。
  // 這樣排出來的圖一定跟副本當下的尺寸一致，不會拿到舊的設定或舊的尺寸。
  const layoutNow = useRef<() => void>(() => {})
  const stepsKey = JSON.stringify(steps)
  useLayoutEffect(() => {
    layoutNow.current = () => {
      const host = measureRoot.current
      if (!host) return
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
        return { edge, points: e.points as Pt[], label: edge.label && size ? { text: edge.label, x: e.x, y: e.y, w: size.width, h: size.height } : undefined }
      })
      const curves = routes.map((route) => curveOf(route.points))
      const samples = curves.map((curve) => sampleCurve(curve))
      const rectOf = (p: Placed): Rect => ({ left: p.x - p.w / 2, top: p.y - p.h / 2, right: p.x + p.w / 2, bottom: p.y + p.h / 2 })
      const pointsIn = (points: Pt[], r: Rect) => points.filter((p) => p.x > r.left && p.x < r.right && p.y > r.top && p.y < r.bottom).length
      const nodeRects = Object.values(nodes).map(rectOf)

      // 線上的文字：先用 dagre 給的位置；那裡會碰到別的線、步驟或已經放好的文字時，沿著自己的線（中間 60% 那段）找空位，
      // 同樣乾淨時選離原位置最近的。
      const labelRects: Rect[] = []
      routes.forEach((route, i) => {
        const label = route.label
        if (!label) return
        const others = samples.flatMap((points, j) => (j === i ? [] : points))
        const own = samples[i]
        const score = (p: Pt) => {
          const r = rectOf({ x: p.x, y: p.y, w: label.w + 4, h: label.h + 4 })
          const blocked = nodeRects.some((o) => overlaps(r, o)) || labelRects.some((o) => overlaps(r, o))
          return pointsIn(others, r) + (blocked ? 1000 : 0) + Math.hypot(p.x - label.x, p.y - label.y) / 1000
        }
        const candidates = [{ x: label.x, y: label.y }, ...own.slice(Math.floor(own.length * 0.2), Math.ceil(own.length * 0.8))]
        const best = candidates.reduce((winner, candidate) => (score(candidate) < score(winner) ? candidate : winner))
        label.x = best.x
        label.y = best.y
        labelRects.push(rectOf(label))
      })
      const linePoints = samples.flat()
      const obstacles = [...nodeRects, ...labelRects]

      // 分組框包住成員。標題放在框的上緣或下緣，候選位置：
      // - 一行的標題沿著框邊每隔 CAPTION_STEP 滑動；
      // - 框太窄、線又從中間穿過時，縮成線之間空隙的寬度（會換行）；
      // - 都會碰到線時，放到最外側那條線的外面，框往那一側延伸（延伸越多扣越多分，延伸的那塊不能蓋到步驟）。
      // 每個候選打分數：穿過的線越多越差，碰到步驟或線上文字就不考慮；同分時上緣優先、靠左優先。標題在哪一側，框就在那一側多留標題的高度。
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
          // 框要延伸多少才包得住標題；延伸出來的那塊（整個框的高度）不能蓋到別的步驟。
          const frame = { left: Math.min(left, x - CAPTION_INSET), right: Math.max(right, x + size.width + CAPTION_INSET) }
          const extend = left - frame.left + (frame.right - right)
          const strips = [
            { left: frame.left, right: left, top: innerTop - band, bottom: innerBottom + band },
            { left: right, right: frame.right, top: innerTop - band, bottom: innerBottom + band },
          ].filter((s) => s.right > s.left)
          const stripBlocked = strips.some((s) => nodeRects.some((o) => overlaps(s, o)))
          // 換行的標題比較高、比較擠，同樣沒有線穿過時，一行的優先；延伸框每 40px 算一個點。
          const wrapped = size.height > oneLine.height ? 0.5 : 0
          const blocked = obstacles.some((o) => overlaps(r, o)) || stripBlocked
          return { atTop, x, y, band, size, frame, score: pointsIn(linePoints, r) + wrapped + extend / 40 + (blocked ? 1000 : 0) }
        }
        const candidates = [true, false].flatMap((atTop) => {
          const first = left + CAPTION_INSET
          const last = right - CAPTION_INSET - oneLine.width
          const xs = [...Array.from({ length: Math.max(1, Math.floor((last - first) / CAPTION_STEP) + 1) }, (_, i) => first + i * CAPTION_STEP), last]
          const slides = xs.map((x) => tryAt(atTop, x, oneLine))
          const bandTop = atTop ? innerTop - oneLine.height - 2 * CAPTION_GAP : innerBottom
          const cuts = linePoints
            .filter((p) => p.y >= bandTop && p.y <= bandTop + oneLine.height + 2 * CAPTION_GAP && p.x > left && p.x < right)
            .map((p) => p.x)
            .sort((a, b) => a - b)
          const walls = [left + CAPTION_INSET - CAPTION_GAP, ...cuts, right - CAPTION_INSET + CAPTION_GAP]
          const gaps = walls.slice(1).map((x, i) => ({ from: walls[i] + CAPTION_GAP, to: x - CAPTION_GAP })).filter((gap) => gap.to - gap.from >= CAPTION_MIN)
          const fits = gaps.map((gap) => tryAt(atTop, gap.from, measureText(host, name, CAPTION_CLASS, gap.to - gap.from)))
          const outside = cuts.length ? [tryAt(atTop, cuts[0] - 2 * CAPTION_GAP - oneLine.width, oneLine), tryAt(atTop, cuts[cuts.length - 1] + 2 * CAPTION_GAP, oneLine)] : []
          return [...slides, ...fits, ...outside]
        })
        const best = candidates.reduce((winner, candidate) => (candidate.score < winner.score ? candidate : winner))
        const top = best.atTop ? innerTop - best.band : innerTop
        const bottom = best.atTop ? innerBottom : innerBottom + best.band
        return { label: name, x: best.frame.left, y: top, w: best.frame.right - best.frame.left, h: bottom - top, caption: { x: best.x, y: best.y, w: best.size.width } }
      })

      // 分組框可能超出 dagre 留的邊界（標題換行、框往旁邊延伸時），整張圖往右下移、放大，讓框和標題都在圖裡面。
      const graph = g.graph()
      const shiftX = Math.max(0, ...groups.map((group) => 2 - group.x))
      const shiftY = Math.max(0, ...groups.map((group) => 2 - group.y))
      const width = Math.max(graph.width ?? 0, ...groups.map((group) => group.x + group.w + 2)) + shiftX
      const height = Math.max(graph.height ?? 0, ...groups.map((group) => group.y + group.h + 2)) + shiftY
      const move = (p: Pt) => ({ x: p.x + shiftX, y: p.y + shiftY })
      for (const node of Object.values(nodes)) Object.assign(node, move(node))
      for (const group of groups) {
        Object.assign(group, move(group))
        Object.assign(group.caption, move(group.caption))
      }
      const laidEdges: Layout['edges'] = routes.map(({ edge, label }, i) => ({
        d: pathOf(curves[i].map((cubic) => cubic.map(move) as Cubic)),
        decision: decisions.has(edge.from),
        back: edge.back,
        label: label ? { ...label, ...move(label) } : undefined,
      }))
      setLayout({ width: Math.ceil(width), height: Math.ceil(height), nodes, edges: laidEdges, groups })
    }
  })
  // 步驟內容（不是陣列物件本身，每次 render 都是新的）或窄寬模式變了就重排。
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => layoutNow.current(), [stepsKey, narrow])
  // 副本尺寸變了就重排；字型載入完也再排一次。
  useLayoutEffect(() => {
    const host = measureRoot.current
    if (!host) return
    const observer = new ResizeObserver(() => layoutNow.current())
    host.querySelectorAll('[data-measure]').forEach((el) => observer.observe(el))
    document.fonts?.ready.then(() => layoutNow.current()).catch(() => {})
    return () => observer.disconnect()
  }, [stepsKey])

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

  // 圖比框寬、要左右捲時，讓第一步置中（流程從那裡開始），不要停在最左邊。
  // 每次重排都重新置中，直到使用者自己捲過；程式自己設的捲動不算（programmatic 記下這一次是程式捲的）。
  const userScrolled = useRef(false)
  const programmatic = useRef(false)
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const onScroll = () => {
      if (programmatic.current) programmatic.current = false
      else userScrolled.current = true
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])
  useLayoutEffect(() => {
    const el = wrap.current
    if (!layout || !el || userScrolled.current || el.scrollWidth <= el.clientWidth + 1) return
    const first = layout.nodes[(steps.find((step) => step.kind === 'start') ?? steps[0]).id]
    if (!first) return
    const target = Math.round(Math.max(0, Math.min(el.scrollWidth - el.clientWidth, first.x * fit - el.clientWidth / 2)))
    if (Math.abs(el.scrollLeft - target) < 1) return
    programmatic.current = true
    el.scrollLeft = target
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, fit, boxWidth])

  // 跑一遍時，目前這一步要在看得到的地方：圖比框寬時左右捲，圖在側欄或收合的卡片裡時上下捲（外面哪一層需要就捲哪一層）。
  useEffect(() => {
    if (!walk || !playing) return
    const box = wrap.current?.querySelector(`[data-box="step:${walk.path[walk.at]}"]`)
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    box?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: smooth ? 'smooth' : 'auto' })
  }, [walk, playing])

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
          <div className="relative mx-auto" style={{ width: layout.width * fit, height: layout.height * fit }}>
            <div
              aria-hidden="true"
              className="absolute left-0 top-0 origin-top-left"
              style={{ width: layout.width, height: layout.height, transform: fit < 1 ? `scale(${fit})` : undefined }}
            >
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
