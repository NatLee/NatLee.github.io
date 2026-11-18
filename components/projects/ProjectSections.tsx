'use client'

// 作品頁「交錯敘事」版面的各種段落：每一段依內容挑排法，往下捲才有起伏（2026-11-18 使用者選的方向 A）。
// 每個元件在窄螢幕都是一欄；寬螢幕（lg）才並排。內容缺一塊時自己退回單欄，不留半邊空白。
// 怎麼組起來見 ProjectPage.tsx。
import type { ReactNode } from 'react'
import Icon from '@/components/Icon'

export interface ShotInfo {
  src: string
  caption: string
  alt: string
}

/** 段落標題。 */
export function Heading({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="font-display text-2xl font-bold">
      {children}
    </h2>
  )
}

/** 小標籤（大寫等寬字），放在卡片和引言上方。 */
export function Label({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>
}

/** 一張截圖加說明；點了開原圖。直式截圖限制高度、置中，不會把頁面撐得太長。 */
export function Shot({ src, caption, alt }: ShotInfo) {
  return (
    <figure className="reveal grid gap-2">
      <a href={src} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-ink/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={caption || alt}
          loading="lazy"
          className="mx-auto block h-auto max-h-[36rem] w-auto max-w-full transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </a>
      {caption && <figcaption className="text-sm leading-relaxed text-muted">{caption}</figcaption>}
    </figure>
  )
}

/** 一般條列（柿橘色圓點）。 */
export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li key={item} className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-3">
          <span className="mt-[0.7em] h-1.5 w-1.5 rounded-full bg-accent-fill" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/** 標題加內容的一段。 */
export function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-4">
      <Heading>{title}</Heading>
      {children}
    </section>
  )
}

/** 開場：左邊大字的概要，右邊一張「為什麼做」小卡；沒有「為什麼做」時概要自己一欄。 */
export function Intro({ overviewTitle, overview, whyTitle, why }: { overviewTitle: string; overview: string; whyTitle: string; why?: string }) {
  return (
    <div className={`grid gap-8 ${why ? 'lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-start lg:gap-12' : ''}`}>
      <section className="grid max-w-prose gap-4">
        <Heading>{overviewTitle}</Heading>
        <p className="text-lg leading-relaxed md:text-xl md:leading-relaxed">{overview}</p>
      </section>
      {why && (
        <aside className="grid gap-3 rounded-2xl bg-accent-soft/70 p-6 text-[1.0625rem] leading-relaxed">
          <Label>{whyTitle}</Label>
          <p>{why}</p>
        </aside>
      )}
    </div>
  )
}

/** 引言：「能帶來什麼」用大字，上下兩條細線，寬螢幕時標籤在左。 */
export function PullQuote({ label, text }: { label: string; text: string }) {
  return (
    <section className="reveal grid gap-3 border-y border-line py-8 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-10">
      <Label>{label}</Label>
      <p className="max-w-[48rem] font-display text-xl leading-snug md:text-2xl md:leading-snug">{text}</p>
    </section>
  )
}

/** 功能：打勾的清單。columns 是寬螢幕時的欄數。 */
export function Checklist({ title, items, columns = 1 }: { title: string; items: string[]; columns?: 1 | 2 }) {
  return (
    <section className="grid gap-4">
      <Heading>{title}</Heading>
      <ul className={`grid gap-x-8 gap-y-3 ${columns === 2 ? 'md:grid-cols-2' : ''}`}>
        {items.map((item) => (
          <li key={item} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-2">
            <Icon name="check" size={18} className="mt-[0.2em] text-clip" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** 「問題 → 我做了什麼」：寬螢幕並排、中間一個箭頭（stacked 時上下排，用在流程圖旁邊）；只有其中一邊時就是一般的一段。 */
export function ProblemApproach({
  problemTitle,
  problems,
  approachTitle,
  approaches,
  stacked = false,
}: {
  problemTitle: string
  problems: string[]
  approachTitle: string
  approaches: string[]
  stacked?: boolean
}) {
  if (!problems.length && !approaches.length) return null
  const card = (title: string, items: string[]) => (
    <section className="grid content-start gap-4 rounded-2xl border border-line bg-surface p-6">
      <Heading>{title}</Heading>
      <Bullets items={items} />
    </section>
  )
  if (!problems.length || !approaches.length) {
    return problems.length ? card(problemTitle, problems) : card(approachTitle, approaches)
  }
  return (
    <div className={`reveal grid items-stretch gap-4 ${stacked ? '' : 'lg:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)]'}`}>
      {card(problemTitle, problems)}
      <div className={`grid place-items-center text-accent-fill ${stacked ? '' : 'lg:h-full'}`} aria-hidden="true">
        <Icon name="arrow" size={24} className={stacked ? 'rotate-90' : 'rotate-90 lg:rotate-0'} />
      </div>
      {card(approachTitle, approaches)}
    </div>
  )
}

/** 一列「截圖＋文字」：寬螢幕並排，flip 時截圖在右。沒有截圖就只有文字（寬螢幕佔兩欄寬，不留空白）。 */
export function Row({ shot, children, flip = false }: { shot?: ShotInfo; children: ReactNode; flip?: boolean }) {
  if (!shot) return <div className="max-w-prose">{children}</div>
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
      <div className={flip ? 'lg:order-2' : ''}>
        <Shot {...shot} />
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

/** 學到什麼：一張一張的筆記卡，寬螢幕時並排（最多三張一列）。 */
export function LessonCards({ title, items }: { title: string; items: string[] }) {
  const columns = items.length >= 3 ? 'md:grid-cols-3' : items.length === 2 ? 'md:grid-cols-2' : ''
  return (
    <section className="grid gap-6">
      <Heading>{title}</Heading>
      <ul className={`grid gap-4 ${columns}`}>
        {items.map((item) => (
          <li key={item} className="reveal rounded-b-2xl border-t-[3px] border-clip bg-surface p-5 text-[1.0625rem] leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

/** 其餘截圖：瀑布流，寬螢幕三欄、平板兩欄，直的橫的都排得緊。 */
export function Gallery({ title, shots }: { title: string; shots: ShotInfo[] }) {
  if (!shots.length) return null
  return (
    <section className="grid gap-6" aria-labelledby="gallery-title">
      <Heading id="gallery-title">{title}</Heading>
      <ul className={`gap-6 sm:columns-2 ${shots.length >= 3 ? 'lg:columns-3' : ''}`}>
        {shots.map((shot) => (
          <li key={shot.src} className="mb-6 break-inside-avoid">
            <Shot {...shot} />
          </li>
        ))}
      </ul>
    </section>
  )
}
