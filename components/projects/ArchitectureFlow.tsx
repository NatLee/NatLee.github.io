'use client'

// 作品頁的簡單架構圖：一層一層排開，每層 1–3 個節點，相鄰兩層用曲線連起來。
// 寬度夠每一層都有 MIN_NODE 寬時由左到右，不夠就由上到下（依實際寬度和層數決定，不看螢幕斷點）。
// 節點用 CSS 排版，線是量完節點位置後用 SVG 畫的；箭頭上的字挑不會蓋到線和節點的位置。
// 資料在作品 JSON 的 architecture（格式見 lib/content/contract.ts 的 ArchitectureStep）。
// 互動：指到（手機上點一下）某個節點，跟它相連的線變成流動的虛線，沒相連的節點和線變淡。
import { useId, useState, type CSSProperties, type PointerEvent } from 'react'
import Icon from '@/components/Icon'
import { useLanguage } from '@/contexts/LanguageContext'
import type { ArchitectureKind, ArchitectureStep } from '@/data/projects'
import { measureText, useMeasuredBoxes, type Box } from './useMeasuredBoxes'

/** 版面（px）：橫排時每一層至少多寬、兩層之間多寬（要放得下箭頭上的字）；直排時兩層之間多高。 */
const MIN_NODE = 150
const GAP_X = 104
const GAP_Y = 56

/** 箭頭停在節點外的距離（px）；作品本身那一格外面的光暈寬度。 */
const ARROW_GAP = 3
const CORE_HALO = 4

/** 直排時箭頭文字最寬多少（px），太寬就找不到不碰線的位置。 */
const LABEL_MAX_VERTICAL = 160

/** 箭頭文字的樣式：畫在圖上和量大小都用這一組。 */
const LABEL_CLASS = 'rounded-md bg-paper px-1.5 py-0.5 font-mono text-[11px] leading-tight text-muted [overflow-wrap:anywhere]'

/** 節點種類對應的圖示（components/Icon.tsx 的名稱）。 */
const KIND_ICON: Record<ArchitectureKind, string> = {
  user: 'user',
  screen: 'screen',
  app: 'app',
  server: 'server',
  data: 'data',
  external: 'cloud',
  device: 'device',
  model: 'model',
  file: 'file',
}

interface FlowNode {
  key: string
  id: string
  title: string
  items: string[]
  kind?: ArchitectureKind
  core: boolean
  to?: string[]
}

interface FlowLayer {
  /** 有好幾個節點時，這一層的標題。 */
  caption?: string
  /** 整層就是作品本身（多個節點用一個框圈起來）。 */
  core: boolean
  next?: string
  nodes: FlowNode[]
}

/** 把資料整理成「每層一串節點」：只有一個節點的層也當成一個節點。 */
function toLayers(steps: ArchitectureStep[]): FlowLayer[] {
  return steps.map((step, index) => {
    if (step.nodes?.length) {
      return {
        caption: step.title,
        core: Boolean(step.core),
        next: step.next,
        nodes: step.nodes.map((node, i) => ({ ...node, key: `${index}:${i}`, core: Boolean(node.core) })),
      }
    }
    const node = { key: `${index}:0`, id: step.id ?? `${index}`, title: step.title, items: step.items, kind: step.kind, core: Boolean(step.core), to: step.to }
    return { core: false, next: step.next, nodes: [node] }
  })
}

interface Rect {
  left: number
  top: number
  width: number
  height: number
}

interface Geometry {
  /** from、to 是兩端節點的 key，指到節點時用來找相連的線。 */
  edges: { d: string; core: boolean; points: [number, number][]; from: string; to: string }[]
  labels: (Rect & { text: string })[]
}

/** 三次貝茲曲線上取樣幾個點，用來判斷文字會不會蓋到線。 */
function sample(p0: [number, number], p1: [number, number], p2: [number, number], p3: [number, number], count = 24): [number, number][] {
  return Array.from({ length: count + 1 }, (_, i) => {
    const t = i / count
    const u = 1 - t
    return [
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ]
  })
}

const overlaps = (a: Rect, b: Box) => a.left < b.right && a.left + a.width > b.left && a.top < b.bottom && a.top + a.height > b.top

/** 滑鼠：移進來亮、移出去恢復。觸控和筆：點一下亮，再點一下恢復。 */
type PointHandlers = Record<'onPointerEnter' | 'onPointerLeave' | 'onPointerUp', (event: PointerEvent) => void>

function NodeCard({ node, coreLabel, dim, point }: { node: FlowNode; coreLabel: string; dim: boolean; point: PointHandlers }) {
  return (
    <div
      data-box={`node:${node.key}`}
      {...point}
      style={node.core ? { boxShadow: `0 0 0 ${CORE_HALO}px rgb(var(--accent-soft))` } : undefined}
      className={`relative flex h-full min-w-0 flex-col gap-2 rounded-xl border p-3 transition-opacity duration-200 ${dim ? 'opacity-30' : ''} ${
        node.core ? 'border-accent-fill bg-accent-soft' : 'border-line bg-surface'
      }`}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border ${
            node.core ? 'border-accent-fill bg-accent-fill text-paper' : 'border-line bg-paper text-muted'
          }`}
        >
          <Icon name={KIND_ICON[node.kind ?? 'app']} size={15} />
        </span>
        <span className="min-w-0 pt-0.5">
          {node.core && <span className="block font-mono text-[10px] uppercase tracking-wider text-accent">{coreLabel}</span>}
          <span className="block font-display text-[0.95rem] font-bold leading-snug [overflow-wrap:anywhere]">{node.title}</span>
        </span>
      </div>
      {node.items.length > 0 && (
        <ul className="grid gap-1 font-mono text-[11px] leading-snug text-muted">
          {node.items.map((item) => (
            <li key={item} className="grid grid-cols-[0.5rem_minmax(0,1fr)] gap-1">
              <span className={`mt-[0.45em] h-1 w-1 rounded-full ${node.core ? 'bg-accent-fill' : 'bg-muted/60'}`} aria-hidden="true" />
              <span className="[overflow-wrap:anywhere]">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function ArchitectureFlow({ steps }: { steps: ArchitectureStep[] }) {
  const { t } = useLanguage()
  const uid = useId().replace(/:/g, '')
  const layers = toLayers(steps)
  // 一開始（伺服器輸出時）用直排，量到寬度夠再換成橫排。
  const [horizontal, setHorizontal] = useState(false)
  // 指到的節點（key）。
  const [focus, setFocus] = useState<string | null>(null)
  const pointAt = (key: string): PointHandlers => ({
    onPointerEnter: (event) => event.pointerType === 'mouse' && setFocus(key),
    onPointerLeave: (event) => event.pointerType === 'mouse' && setFocus((was) => (was === key ? null : was)),
    onPointerUp: (event) => event.pointerType !== 'mouse' && setFocus((was) => (was === key ? null : key)),
  })

  const [root, geometry] = useMeasuredBoxes<Geometry | null>((boxes, base, container) => {
    const fits = base.width >= layers.length * MIN_NODE + (layers.length - 1) * GAP_X
    if (fits !== horizontal) {
      setHorizontal(fits)
      return null // 換方向之後會重排、重量，這一輪先不畫。
    }
    const nodeBox = (key: string) => boxes.get(`node:${key}`)
    const layerBox = layers.map((_, i) => boxes.get(`layer:${i}`)!)
    const edges: Geometry['edges'] = []
    layers.slice(0, -1).forEach((layer, index) => {
      const nextLayer = layers[index + 1]
      for (const source of layer.nodes) {
        const targets = source.to ? nextLayer.nodes.filter((n) => source.to!.includes(n.id)) : nextLayer.nodes
        for (const target of targets) {
          const s = nodeBox(source.key)
          const e = nodeBox(target.key)
          if (!s || !e) continue
          const core = source.core || target.core || layer.core || nextLayer.core
          // 箭頭停在節點外一點；作品本身那一格有一圈光暈，要停得更遠才看得到箭頭。
          const stop = target.core ? CORE_HALO + ARROW_GAP : ARROW_GAP
          const p: [number, number][] = horizontal
            ? [[s.right, s.cy], [(s.right + e.left - stop) / 2, s.cy], [(s.right + e.left - stop) / 2, e.cy], [e.left - stop, e.cy]]
            : [[s.cx, s.bottom], [s.cx, (s.bottom + e.top - stop) / 2], [e.cx, (s.bottom + e.top - stop) / 2], [e.cx, e.top - stop]]
          edges.push({ d: `M${p[0]} C${p[1]} ${p[2]} ${p[3]}`, core, points: sample(p[0], p[1], p[2], p[3]), from: source.key, to: target.key })
        }
      }
    })

    // 箭頭上的字：在兩層之間的空隙裡試幾個位置，挑蓋到最少線、不碰節點、不超出圖的那個。
    const obstacles = [...boxes.entries()].filter(([key]) => key.startsWith('node:')).map(([, box]) => box)
    const points = edges.flatMap((edge) => edge.points)
    const score = (r: Rect) => {
      const inside = points.filter(([x, y]) => x > r.left - 2 && x < r.left + r.width + 2 && y > r.top - 2 && y < r.top + r.height + 2).length
      const hitsNode = obstacles.some((box) => overlaps(r, box)) ? 1000 : 0
      const outside = r.left < 0 || r.left + r.width > base.width || r.top < 0 || r.top + r.height > base.height ? 1000 : 0
      return inside + hitsNode + outside
    }
    const labels: Geometry['labels'] = []
    layers.slice(0, -1).forEach((layer, index) => {
      if (!layer.next) return
      const a = layerBox[index]
      const b = layerBox[index + 1]
      const trunk = trunkOf(index)
      const maxWidth = horizontal ? b.left - a.right - 8 : Math.min(base.width / 2, LABEL_MAX_VERTICAL)
      const { width, height } = measureText(container, layer.next, LABEL_CLASS, maxWidth)
      // 候選位置：空隙的中間和靠兩側的地方 × 幾個高度（或左右位置）。線匯集的那一側通常有空位。
      let xs: number[]
      let ys: number[]
      if (horizontal) {
        const mid = trunk ? trunk.cy : (Math.min(a.top, b.top) + Math.max(a.bottom, b.bottom)) / 2
        xs = [(a.right + b.left) / 2 - width / 2, a.right + 4, b.left - 4 - width]
        ys = [mid, mid - height - 6, mid + height + 6, Math.min(a.top, b.top) + 4 + height / 2, Math.max(a.bottom, b.bottom) - 4 - height / 2].map((cy) => cy - height / 2)
      } else {
        const center = trunk ? trunk.cx : base.width / 2
        xs = [0, base.width - width, center + 10, center - 10 - width]
        ys = [(a.bottom + b.top) / 2, a.bottom + 4 + height / 2, b.top - 4 - height / 2].map((cy) => cy - height / 2)
      }
      const candidates: Rect[] = ys.flatMap((top) => xs.map((left) => ({ left, top, width, height })))
      const best = candidates.reduce((winner, candidate) => (score(candidate) < score(winner) ? candidate : winner))
      labels.push({ ...best, text: layer.next })
    })
    return { edges, labels }

    /** 線都匯集到的那個節點：下一層或這一層只有一個節點時就是它。 */
    function trunkOf(index: number) {
      const here = layers[index]
      const there = layers[index + 1]
      return there.nodes.length === 1 ? nodeBox(there.nodes[0].key) : here.nodes.length === 1 ? nodeBox(here.nodes[0].key) : undefined
    }
  }, [steps, horizontal])

  const coreLabel = t('project.architectureCore')
  // 指到某個節點時：亮著的是它、和它有線相連的節點，以及那些線。
  const touching = (edge: Geometry['edges'][number]) => edge.from === focus || edge.to === focus
  const near = focus && geometry ? new Set([focus, ...geometry.edges.filter(touching).flatMap((edge) => [edge.from, edge.to])]) : null
  const listStyle: CSSProperties = horizontal
    ? { gridTemplateColumns: `repeat(${layers.length}, minmax(0, 1fr))`, columnGap: GAP_X, alignItems: 'center' }
    : { rowGap: GAP_Y }

  return (
    <div ref={root} className="relative">
      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <marker id={`${uid}-a`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 z" className="fill-ink/40" />
          </marker>
          <marker id={`${uid}-c`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 z" className="fill-accent-fill" />
          </marker>
        </defs>
        {geometry?.edges.map((edge, index) => (
          <path
            key={index}
            d={edge.d}
            fill="none"
            strokeWidth={1.5}
            className={`transition-opacity duration-200 ${edge.core ? 'stroke-accent-fill/70' : 'stroke-ink/30'} ${near ? (touching(edge) ? 'diagram-march' : 'opacity-20') : ''}`}
            markerEnd={`url(#${uid}-${edge.core ? 'c' : 'a'})`}
          />
        ))}
      </svg>

      <ol className="relative grid" style={listStyle}>
        {layers.map((layer, index) => {
          const nodes = (
            <div className="grid gap-3" style={{ gridTemplateColumns: horizontal ? 'minmax(0, 1fr)' : `repeat(${layer.nodes.length}, minmax(0, 1fr))` }}>
              {layer.nodes.map((node) => (
                <NodeCard key={node.key} node={node} coreLabel={coreLabel} dim={near !== null && !near.has(node.key)} point={pointAt(node.key)} />
              ))}
            </div>
          )
          return (
            <li key={index} data-box={`layer:${index}`} className="min-w-0">
              {layer.caption ? (
                <div className={`rounded-2xl border border-dashed p-2.5 ${layer.core ? 'border-accent-fill/70 bg-accent-soft/40' : 'border-ink/20'}`}>
                  <p className={`mb-2 flex flex-wrap items-baseline gap-x-2 px-1 font-mono text-[11px] uppercase tracking-wider [overflow-wrap:anywhere] ${layer.core ? 'text-accent' : 'text-muted'}`}>
                    {layer.core && <span className="font-semibold">{coreLabel}</span>}
                    <span>{layer.caption}</span>
                  </p>
                  {nodes}
                </div>
              ) : (
                nodes
              )}
              {layer.next && <span className="sr-only">→ {layer.next}</span>}
            </li>
          )
        })}
      </ol>

      {geometry?.labels.map((label, index) => (
        <span
          key={index}
          data-diagram-label=""
          aria-hidden="true"
          className={`pointer-events-none absolute ${LABEL_CLASS} ${horizontal ? 'text-center' : 'text-left'}`}
          style={{ left: label.left, top: label.top, width: label.width }}
        >
          {label.text}
        </span>
      ))}
    </div>
  )
}
