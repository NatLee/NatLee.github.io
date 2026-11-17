'use client'

// 作品頁的流程圖：步驟由上到下排成一欄；判斷是六角形，條件成立時從右邊的通道走到另一步
// （往上是重來，往下是略過）。線是量完位置後用 SVG 畫的（量測在 useMeasuredBoxes）。
// 資料在作品 JSON 的 flow（格式見 lib/content/contract.ts 的 FlowStep）。
import { useId, type CSSProperties } from 'react'
import type { FlowStep } from '@/data/projects'
import { useMeasuredBoxes } from './useMeasuredBoxes'

/** 步驟之間的距離（要放得下箭頭旁的字）。 */
const STEP_GAP = '2.75rem'
/** 分支通道（px）：第一條離步驟欄右緣多遠（要放得下條件文字）、之後每條再往右多少。 */
const LANE = { first: 76, step: 16 }
/** 箭頭停在方塊外的距離、分支轉角的圓角（px）。 */
const ARROW_GAP = 3
const CORNER = 10
/** 判斷的六角形：左右兩端內縮多少（px）。 */
const DECISION_INSET = 14

interface Geometry {
  main: string[]
  branches: string[]
  nextLabels: { text: string; x: number; y: number }[]
  branchLabels: { text: string; x: number; y: number; maxWidth: number }[]
}

function StepBox({ step }: { step: FlowStep }) {
  const text = (
    <>
      <span className="block text-sm font-semibold leading-snug">{step.label}</span>
      {step.detail && <span className="mt-0.5 block font-mono text-[11px] leading-snug text-muted">{step.detail}</span>}
    </>
  )
  if (step.kind === 'decision') {
    // 外層是框線色、內層是底色，兩層用同一個六角形裁切，看起來就是有框的六角形。
    const shape = { clipPath: `polygon(${DECISION_INSET}px 0, calc(100% - ${DECISION_INSET}px) 0, 100% 50%, calc(100% - ${DECISION_INSET}px) 100%, ${DECISION_INSET}px 100%, 0 50%)` }
    return (
      <div data-box={`step:${step.id}`} className="w-full bg-clip/70 p-[1.5px]" style={shape}>
        <div className="bg-clip-soft px-7 py-2.5 text-center" style={shape}>
          {text}
        </div>
      </div>
    )
  }
  const terminal = step.kind === 'start' || step.kind === 'end'
  return (
    <div
      data-box={`step:${step.id}`}
      className={`w-full border px-4 py-2.5 text-center ${terminal ? 'rounded-full border-ink/25 bg-paper' : 'rounded-xl border-line bg-surface'}`}
    >
      {text}
    </div>
  )
}

export default function FlowChart({ steps }: { steps: FlowStep[] }) {
  const uid = useId().replace(/:/g, '')
  const branching = steps.filter((step) => step.branch)
  const laneWidth = branching.length ? LANE.first + (branching.length - 1) * LANE.step + 12 : 0
  const labelOf = new Map(steps.map((step) => [step.id, step.label]))

  const [root, geometry] = useMeasuredBoxes<Geometry>((boxes) => {
    const box = (id: string) => boxes.get(`step:${id}`)
    const result: Geometry = { main: [], branches: [], nextLabels: [], branchLabels: [] }
    // 主線：每一步往下一步。
    steps.slice(0, -1).forEach((step, index) => {
      const a = box(step.id)
      const b = box(steps[index + 1].id)
      if (!a || !b) return
      result.main.push(`M${a.cx},${a.bottom} L${b.cx},${b.top - ARROW_GAP}`)
      if (step.next) result.nextLabels.push({ text: step.next, x: a.cx + 10, y: (a.bottom + b.top) / 2 })
    })
    // 分支：從判斷的右端出去，沿著自己的通道上下走，再從右邊進到目標那一步。
    const columnRight = Math.max(...steps.map((step) => box(step.id)?.right ?? 0))
    branching.forEach((step, lane) => {
      const s = box(step.id)
      const t = box(step.branch!.to)
      if (!s || !t) return
      const x = columnRight + LANE.first + lane * LANE.step
      const dir = t.cy > s.cy ? 1 : -1
      const end = t.right + ARROW_GAP
      result.branches.push(
        `M${s.right},${s.cy} H${x - CORNER} Q${x},${s.cy} ${x},${s.cy + dir * CORNER} V${t.cy - dir * CORNER} Q${x},${t.cy} ${x - CORNER},${t.cy} H${end}`
      )
      result.branchLabels.push({ text: step.branch!.when, x: s.right + 6, y: s.cy - 4, maxWidth: x - s.right - 12 })
    })
    return result
  }, [steps])

  return (
    <div ref={root} className="relative max-w-full" style={{ paddingRight: laneWidth }}>
      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <marker id={`${uid}-m`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 z" className="fill-ink/40" />
          </marker>
          <marker id={`${uid}-b`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 z" className="fill-clip" />
          </marker>
        </defs>
        {geometry?.main.map((d, index) => (
          <path key={`m${index}`} d={d} fill="none" strokeWidth={1.5} className="stroke-ink/30" markerEnd={`url(#${uid}-m)`} />
        ))}
        {geometry?.branches.map((d, index) => (
          <path key={`b${index}`} d={d} fill="none" strokeWidth={1.5} strokeDasharray="5 4" className="stroke-clip/70" markerEnd={`url(#${uid}-b)`} />
        ))}
      </svg>

      <ol className="relative grid w-full max-w-[22rem] gap-y-[var(--step-gap)]" style={{ '--step-gap': STEP_GAP } as CSSProperties}>
        {steps.map((step) => (
          <li key={step.id} className="flex">
            <StepBox step={step} />
            {step.next && <span className="sr-only">→ {step.next}</span>}
            {step.branch && (
              <span className="sr-only">
                {step.branch.when} → {labelOf.get(step.branch.to)}
              </span>
            )}
          </li>
        ))}
      </ol>

      {geometry?.nextLabels.map((label, index) => (
        <span key={`n${index}`} aria-hidden="true" className="pointer-events-none absolute -translate-y-1/2 font-mono text-[11px] leading-tight text-muted" style={{ left: label.x, top: label.y }}>
          {label.text}
        </span>
      ))}
      {geometry?.branchLabels.map((label, index) => (
        <span
          key={`b${index}`}
          aria-hidden="true"
          className="pointer-events-none absolute -translate-y-full font-mono text-[11px] leading-tight text-clip"
          style={{ left: label.x, top: label.y, maxWidth: label.maxWidth }}
        >
          {label.text}
        </span>
      ))}
    </div>
  )
}
