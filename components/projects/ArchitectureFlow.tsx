'use client'

// 作品頁的簡單架構圖：一層一層由左到右（手機由上到下），每層 1–3 個節點，相鄰兩層用曲線連起來。
// 節點用 CSS 排版，線是量完節點位置後用 SVG 畫的，所以版面怎麼換行都接得上。
// 資料在作品 JSON 的 architecture（格式見 lib/content/contract.ts 的 ArchitectureStep）。
import { useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import Icon from '@/components/Icon'
import { useLanguage } from '@/contexts/LanguageContext'
import type { ArchitectureKind, ArchitectureStep } from '@/data/projects'

/** 兩層之間的距離：橫排要放得下箭頭上的字，直排短一點。 */
const FLOW_GAP = { x: '6.5rem', y: '3.5rem' }

/** 箭頭停在節點外的距離（px）；作品本身那一格外面的光暈寬度（和 NodeCard 的 shadow 一致）。 */
const ARROW_GAP = 3
const CORE_HALO = 4

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

interface Geometry {
  edges: { d: string; core: boolean }[]
  labels: { text: string; x: number; y: number; maxWidth: number; vertical: boolean }[]
}

function NodeCard({ node, coreLabel }: { node: FlowNode; coreLabel: string }) {
  return (
    <div
      data-node={node.key}
      style={node.core ? { boxShadow: `0 0 0 ${CORE_HALO}px rgb(var(--accent-soft))` } : undefined}
      className={`relative flex h-full flex-col gap-2 rounded-xl border p-3 ${
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
          <span className="block font-display text-[0.95rem] font-bold leading-snug">{node.title}</span>
        </span>
      </div>
      {node.items.length > 0 && (
        <ul className="grid gap-1 font-mono text-[11px] leading-snug text-muted">
          {node.items.map((item) => (
            <li key={item} className="grid grid-cols-[0.5rem_minmax(0,1fr)] gap-1">
              <span className={`mt-[0.45em] h-1 w-1 rounded-full ${node.core ? 'bg-accent-fill' : 'bg-muted/60'}`} aria-hidden="true" />
              <span className="break-words">{item}</span>
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
  const root = useRef<HTMLDivElement>(null)
  const [geometry, setGeometry] = useState<Geometry | null>(null)
  const layers = toLayers(steps)

  // 量節點位置畫線。版面寬度、字型載入都會改變位置，所以用 ResizeObserver 重量。
  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const measure = () => {
      const base = el.getBoundingClientRect()
      const box = (target: Element) => {
        const r = target.getBoundingClientRect()
        return { left: r.left - base.left, right: r.right - base.left, top: r.top - base.top, bottom: r.bottom - base.top, cx: r.left - base.left + r.width / 2, cy: r.top - base.top + r.height / 2 }
      }
      const nodeBox = new Map([...el.querySelectorAll('[data-node]')].map((n) => [n.getAttribute('data-node')!, box(n)]))
      const layerBox = [...el.querySelectorAll('[data-layer]')].map(box)
      // 下一層在這一層的下方（而不是右方），就是直排。
      const vertical = layerBox.length > 1 && layerBox[1].top >= layerBox[0].bottom - 1
      const edges: Geometry['edges'] = []
      const labels: Geometry['labels'] = []
      layers.slice(0, -1).forEach((layer, index) => {
        const nextLayer = layers[index + 1]
        for (const source of layer.nodes) {
          const targets = source.to ? nextLayer.nodes.filter((n) => source.to!.includes(n.id)) : nextLayer.nodes
          for (const target of targets) {
            const s = nodeBox.get(source.key)
            const e = nodeBox.get(target.key)
            if (!s || !e) continue
            const core = source.core || target.core || layer.core || nextLayer.core
            // 箭頭停在節點外一點；作品本身那一格有一圈光暈，要停得更遠才看得到箭頭。
            const stop = target.core ? CORE_HALO + ARROW_GAP : ARROW_GAP
            if (vertical) {
              const [x1, y1, x2, y2] = [s.cx, s.bottom, e.cx, e.top - stop]
              const dy = (y2 - y1) / 2
              edges.push({ d: `M${x1},${y1} C${x1},${y1 + dy} ${x2},${y2 - dy} ${x2},${y2}`, core })
            } else {
              const [x1, y1, x2, y2] = [s.right, s.cy, e.left - stop, e.cy]
              const dx = (x2 - x1) / 2
              edges.push({ d: `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`, core })
            }
          }
        }
        if (!layer.next) return
        // 箭頭上的字放在兩層中間。橫排時，有一邊只有一個節點就對齊那個節點（線都匯集在那裡）；
        // 直排時放在空隙的最左邊，線多半從中間分岔，靠左才不會蓋到線。
        const a = layerBox[index]
        const b = layerBox[index + 1]
        const trunk = nextLayer.nodes.length === 1 ? nodeBox.get(nextLayer.nodes[0].key) : layer.nodes.length === 1 ? nodeBox.get(layer.nodes[0].key) : undefined
        if (vertical) {
          labels.push({ text: layer.next, x: 0, y: (a.bottom + b.top) / 2, maxWidth: base.width / 3, vertical })
        } else {
          labels.push({ text: layer.next, x: (a.right + b.left) / 2, y: trunk ? trunk.cy : (a.top + a.bottom) / 2, maxWidth: b.left - a.right - 8, vertical })
        }
      })
      setGeometry({ edges, labels })
    }
    measure()
    // 外框大小不變、裡面的節點換行變高時，位置也會變，所以每一層、每個節點都要看。
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    el.querySelectorAll('[data-layer], [data-node]').forEach((target) => observer.observe(target))
    document.fonts?.ready.then(measure).catch(() => {})
    return () => observer.disconnect()
    // layers 由 steps 算出來，steps 不變就不必重量。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps])

  const style = { '--layers': layers.length, '--flow-gap-x': FLOW_GAP.x, '--flow-gap-y': FLOW_GAP.y } as CSSProperties
  const coreLabel = t('project.architectureCore')

  return (
    <div ref={root} className="relative" style={style}>
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
            className={edge.core ? 'stroke-accent-fill/70' : 'stroke-ink/30'}
            markerEnd={`url(#${uid}-${edge.core ? 'c' : 'a'})`}
          />
        ))}
      </svg>

      <ol className="relative grid gap-y-[var(--flow-gap-y)] md:items-center md:gap-x-[var(--flow-gap-x)] md:[grid-template-columns:repeat(var(--layers),minmax(0,1fr))]">
        {layers.map((layer, index) => {
          const nodes = (
            <div className="grid gap-3 [grid-template-columns:repeat(var(--count),minmax(0,1fr))] md:grid-cols-1" style={{ '--count': layer.nodes.length } as CSSProperties}>
              {layer.nodes.map((node) => (
                <NodeCard key={node.key} node={node} coreLabel={coreLabel} />
              ))}
            </div>
          )
          return (
            <li key={index} data-layer={index}>
              {layer.caption ? (
                <div
                  className={`rounded-2xl border border-dashed p-2.5 ${layer.core ? 'border-accent-fill/70 bg-accent-soft/40' : 'border-ink/20'}`}
                >
                  <p className={`mb-2 flex flex-wrap items-baseline gap-x-2 px-1 font-mono text-[11px] uppercase tracking-wider ${layer.core ? 'text-accent' : 'text-muted'}`}>
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
          aria-hidden="true"
          className={`pointer-events-none absolute rounded-md bg-paper px-1.5 py-0.5 font-mono text-[11px] leading-tight text-muted ${
            label.vertical ? '-translate-y-1/2 text-left' : '-translate-x-1/2 -translate-y-1/2 text-center'
          }`}
          style={{ left: label.x, top: label.y, maxWidth: label.maxWidth }}
        >
          {label.text}
        </span>
      ))}
    </div>
  )
}
