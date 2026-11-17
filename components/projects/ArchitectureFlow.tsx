'use client'

// 作品頁的簡單架構圖：幾個方塊由左到右排，方塊之間的箭頭寫著「怎麼過去」。
// 桌面版橫排、手機直排；core 那一步是這個作品本身，用強調色。資料在作品 JSON 的 architecture。
import type { CSSProperties } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import type { ArchitectureStep } from '@/data/projects'

/** 方塊之間的距離就是箭頭的長度：橫排要放得下箭頭上的字，直排短一點。 */
const FLOW_GAP = { x: '6rem', y: '3.25rem' }

function Arrow({ label }: { label?: string }) {
  return (
    <span
      className="absolute left-7 top-full flex h-[var(--flow-gap-y)] items-center gap-3 md:left-full md:top-1/2 md:h-auto md:w-[var(--flow-gap-x)] md:-translate-y-1/2 md:flex-col md:gap-1"
      aria-hidden={label ? undefined : true}
    >
      {/* 直排：往下的箭頭在左、字在右；橫排：字在上、往右的箭頭在下。 */}
      <span className="flex h-full flex-col items-center md:order-2 md:h-auto md:w-full md:flex-row">
        <span className="w-px flex-1 bg-ink/30 md:h-px md:w-auto" />
        <span className="h-0 w-0 border-x-[4px] border-t-[6px] border-x-transparent border-t-ink/45 md:border-y-[4px] md:border-l-[6px] md:border-r-0 md:border-y-transparent md:border-l-ink/45 md:border-t-transparent" />
      </span>
      {label && <span className="font-mono text-[11px] leading-tight text-muted md:order-1 md:px-1 md:text-center">{label}</span>}
    </span>
  )
}

export default function ArchitectureFlow({ steps }: { steps: ArchitectureStep[] }) {
  const { t } = useLanguage()
  const style = { '--steps': steps.length, '--flow-gap-x': FLOW_GAP.x, '--flow-gap-y': FLOW_GAP.y } as CSSProperties
  return (
    <ol
      className="grid gap-y-[var(--flow-gap-y)] md:gap-x-[var(--flow-gap-x)] md:[grid-template-columns:repeat(var(--steps),minmax(0,1fr))]"
      style={style}
    >
      {steps.map((step, index) => (
        <li key={`${index}-${step.title}`} className="relative flex">
          <div
            className={`flex w-full flex-col gap-2 rounded-xl border p-4 ${
              step.core ? 'border-accent-fill bg-accent-soft/60' : 'border-line bg-surface'
            }`}
          >
            {step.core && <span className="font-mono text-[11px] uppercase tracking-wider text-accent">{t('project.architectureCore')}</span>}
            <span className={`font-display text-base font-bold leading-snug ${step.core ? 'text-accent' : ''}`}>{step.title}</span>
            {step.items.length > 0 && (
              <ul className="flex flex-wrap gap-1.5">
                {step.items.map((item) => (
                  <li key={item} className="rounded-md border border-line bg-paper px-1.5 py-0.5 font-mono text-[11px] leading-5 text-muted">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {index < steps.length - 1 && <Arrow label={step.next} />}
        </li>
      ))}
    </ol>
  )
}
