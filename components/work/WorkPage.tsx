'use client'

// 工作專案頁（/work）：職涯時間帶 → 章節目錄 → 每間公司一章（職位、說明、工作專案、衍生的開源 repo）。
// 文字在 content/work.json 與各作品的 JSON；這裡只負責版面。
import Link from 'next/link'
import type { CSSProperties } from 'react'
import Icon from '@/components/Icon'
import { formatPeriod } from '@/components/projects/ProjectPage'
import { StarCount, ThemeLabel } from '@/components/site/ui'
import { useLanguage } from '@/contexts/LanguageContext'
import { buildYear, getCareerSpans, getWorkChapters, yearValue, type WorkChapter, type WorkSpinoff } from '@/data/work'
import { getProjectStars, type ProjectDetail } from '@/data/projects'

/** 把年份換成時間軸上的百分比。 */
function scale(start: number, end: number) {
  return (value: number) => Math.min(100, Math.max(0, ((value - start) / (end - start)) * 100))
}

function displayDate(value: string, present: string) {
  return value === 'Present' ? present : value
}

function CareerRibbon({ chapters }: { chapters: WorkChapter[] }) {
  const { t } = useLanguage()
  const spans = getCareerSpans()
  const axisStart = Math.floor(Math.min(...spans.map((span) => yearValue(span.start))))
  const at = scale(axisStart, buildYear)
  const years = Array.from({ length: Math.floor(buildYear) - axisStart + 1 }, (_, index) => axisStart + index)
  const nameOf = (id?: string) => chapters.find((chapter) => chapter.id === id)?.name

  return (
    <section aria-labelledby="ribbon-title" className="mt-14">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 id="ribbon-title" className="eyebrow">
          {t('work.ribbon')}
        </h2>
        <p className="text-sm text-muted">{t('work.ribbonNote')}</p>
      </div>
      <div className="relative mt-4 h-9" role="list">
        {spans.map((span) => {
          const left = at(yearValue(span.start))
          const width = at(yearValue(span.end)) - left
          const style: CSSProperties = { left: `${left}%`, width: `calc(${width}% - 2px)` }
          const label = `${span.name} · ${span.start} – ${displayDate(span.end, t('common.present'))}`
          const base = 'absolute inset-y-0 flex items-center overflow-hidden rounded-md px-2 font-mono text-[11px] whitespace-nowrap'
          return span.chapterId ? (
            <a
              key={span.name}
              role="listitem"
              href={`#${span.chapterId}`}
              title={label}
              aria-label={label}
              style={style}
              className={`${base} bg-accent-fill font-semibold text-paper transition-[filter] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink`}
            >
              <span className="truncate">{nameOf(span.chapterId)}</span>
            </a>
          ) : (
            <span key={span.name} role="listitem" title={label} aria-label={label} style={style} className={`${base} border border-line bg-surface text-muted`}>
              <span className="truncate">{span.name}</span>
            </span>
          )
        })}
      </div>
      <div className="relative mt-2 h-4 border-t border-line" aria-hidden="true">
        {years.map((year) => (
          <span key={year} className="tabular absolute top-1 -translate-x-1/2 font-mono text-[10px] text-muted first:translate-x-0" style={{ left: `${at(year)}%` }}>
            {year}
          </span>
        ))}
      </div>

      <ol className="mt-10 grid gap-3 md:grid-cols-3">
        {chapters.map((chapter) => (
          <li key={chapter.id} className="flex">
            <a href={`#${chapter.id}`} className="group flex flex-1 flex-col gap-1 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-accent-fill/60">
              <span className="tabular font-mono text-xs text-muted">
                {chapter.start} – {displayDate(chapter.end, t('common.present'))}
              </span>
              <span className="font-display text-xl font-bold">{chapter.name}</span>
              <span className="text-sm text-muted">{chapter.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}

function RolePath({ chapter }: { chapter: WorkChapter }) {
  const { t } = useLanguage()
  return (
    <div>
      <h3 className="eyebrow">{t('work.roles')}</h3>
      <ol className="mt-3 grid gap-3 border-l-2 border-line pl-4">
        {chapter.roles.map((role, index) => (
          <li key={role.id} className="relative">
            <span
              className={`absolute -left-[23px] top-1.5 h-2.5 w-2.5 rounded-full border-2 ${index === chapter.roles.length - 1 && role.end === 'Present' ? 'border-accent-fill bg-accent-fill' : 'border-line bg-paper'}`}
              aria-hidden="true"
            />
            <span className="block text-sm font-semibold">{role.title}</span>
            <span className="tabular block font-mono text-[11px] text-muted">
              {role.start}
              {role.roleType && role.roleType !== 'join' ? ` · ${t(`experience.roleType.${role.roleType}`)}` : ''}
              {role.group && role.company !== role.group ? ` · ${role.company}` : ''}
            </span>
          </li>
        ))}
      </ol>
      <Link href="/experience/" className="link mt-4 inline-flex items-center gap-1.5 text-sm">
        {t('work.rolesLink')} <Icon name="arrow" size={14} />
      </Link>
    </div>
  )
}

function WorkProjectCard({ project }: { project: ProjectDetail }) {
  const { t } = useLanguage()
  const image = project.thumbnail ?? project.images[0]
  const results = project.results.slice(0, 3)
  return (
    <article className="group relative grid overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-ink/30 focus-within:ring-2 focus-within:ring-accent md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <div className="flex items-center border-b border-line bg-paper md:border-b-0 md:border-r">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" loading="lazy" decoding="async" className="block w-full" />
        ) : (
          <span className="p-6 font-display text-2xl font-bold">{project.subtitle}</span>
        )}
      </div>
      <div className="flex flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <ThemeLabel theme={project.theme} />
          <span className="tabular font-mono text-xs text-muted">{formatPeriod(project, t('common.present'))}</span>
        </div>
        <h3 className="font-display text-2xl font-bold leading-snug">
          <Link href={`/projects/${project.id}/`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {project.title}
          </Link>
        </h3>
        <p className="text-muted">{project.description}</p>
        {results.length > 0 && (
          <div className="mt-1">
            <p className="eyebrow">{t('work.results')}</p>
            <ul className="mt-2 grid gap-1.5 text-sm">
              {results.map((item) => (
                <li key={item} className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-2">
                  <span className="mt-[0.6em] h-1.5 w-1.5 rounded-full bg-accent-fill" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-accent">
          {t('work.open')} <Icon name="arrow" size={15} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  )
}

/** 一列時間帶：公司任職期間（底色）和 repo 的存續期間（線）。 */
function TimeStrip({ at, band, line }: { at: (value: number) => number; band: [number, number]; line?: [number, number] }) {
  return (
    <div className="relative h-4" aria-hidden="true">
      <span className="absolute inset-x-0 top-1/2 h-px bg-line" />
      <span
        className="absolute top-1/2 h-3 -translate-y-1/2 rounded-sm border border-accent-fill/50 bg-accent-soft"
        style={{ left: `${at(band[0])}%`, width: `${at(band[1]) - at(band[0])}%` }}
      />
      {line && (
        <>
          <span className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-clip" style={{ left: `${at(line[0])}%`, width: `${Math.max(at(line[1]) - at(line[0]), 1)}%` }} />
          <span className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-clip" style={{ left: `${at(line[0])}%` }} />
        </>
      )}
    </div>
  )
}

// 分支圖的幾何（px）：主幹在左邊，衍生 repo 從主幹彎出去，後繼版本再從它的節點彎出去。
const TRUNK_X = 9
const LANE_X = 33
const CHILD_X = 57
const NODE_Y = 14

function Lineage({ chapter }: { chapter: WorkChapter }) {
  const { t } = useLanguage()
  const rows = chapter.spinoffs
  const starts = rows.map((row) => yearValue(row.project.timeline.start))
  const axisStart = Math.floor(Math.min(yearValue(chapter.start), ...starts))
  const at = scale(axisStart, buildYear)
  const band: [number, number] = [yearValue(chapter.start), yearValue(chapter.end)]
  const lastTrunkRow = rows.map((row) => !row.from).lastIndexOf(true)
  const lineEnd = (project: ProjectDetail) => yearValue(project.timeline.end)

  const line = (style: CSSProperties, tone: 'trunk' | 'lane') => (
    <span className={`absolute w-0 border-l-2 ${tone === 'trunk' ? 'border-dashed border-accent-fill/70' : 'border-clip'}`} style={style} aria-hidden="true" />
  )
  const curve = (fromX: number, toX: number) => (
    <span
      className="absolute rounded-bl-[10px] border-b-2 border-l-2 border-clip"
      style={{ left: fromX - 1, top: NODE_Y - 10, width: toX - fromX, height: 10 }}
      aria-hidden="true"
    />
  )
  const hasChildAfter = (index: number) => rows[index + 1]?.from?.id === rows[index].project.id

  return (
    <section aria-labelledby={`${chapter.id}-spinoffs`} className="rounded-2xl border border-line bg-surface p-5 md:p-7">
      <h3 id={`${chapter.id}-spinoffs`} className="font-display text-xl font-bold">
        {t('work.spinoffsTitle')}
      </h3>
      <p className="mt-2 max-w-prose text-sm text-muted">{t('work.spinoffsIntro')}</p>

      <ol className="mt-6">
        <li className="relative grid gap-3 pb-6 md:grid-cols-[minmax(0,1fr)_14rem] md:items-start" style={{ paddingLeft: LANE_X + 15 }}>
          {rows.length > 0 && line({ left: TRUNK_X - 1, top: NODE_Y, bottom: 0 }, 'trunk')}
          <span className="absolute grid h-6 w-6 place-items-center rounded-full bg-accent-soft text-accent" style={{ left: TRUNK_X - 12, top: NODE_Y - 12 }} aria-hidden="true">
            <Icon name="lock" size={13} />
          </span>
          <div>
            <p className="font-display font-bold">{t('work.trunk', { name: chapter.name })}</p>
            <p className="tabular font-mono text-xs text-muted">
              {chapter.start} – {displayDate(chapter.end, t('common.present'))}
            </p>
          </div>
          <div>
            <TimeStrip at={at} band={band} />
            <div className="tabular mt-1 flex justify-between font-mono text-[10px] text-muted" aria-hidden="true">
              <span>{axisStart}</span>
              <span>{t('work.now')}</span>
            </div>
          </div>
        </li>

        {rows.map((row: WorkSpinoff, index) => {
          const child = Boolean(row.from)
          const nodeX = child ? CHILD_X : LANE_X
          return (
            <li
              key={row.project.id}
              className="relative grid gap-3 pb-6 last:pb-0 md:grid-cols-[minmax(0,1fr)_14rem] md:items-start"
              style={{ paddingLeft: nodeX + 15 }}
            >
              {index < lastTrunkRow && line({ left: TRUNK_X - 1, top: 0, bottom: 0 }, 'trunk')}
              {index === lastTrunkRow && line({ left: TRUNK_X - 1, top: 0, height: NODE_Y - 10 }, 'trunk')}
              {child && line({ left: LANE_X - 1, top: 0, height: NODE_Y - 10 }, 'lane')}
              {hasChildAfter(index) && line({ left: LANE_X - 1, top: NODE_Y, bottom: 0 }, 'lane')}
              {curve(child ? LANE_X : TRUNK_X, nodeX)}
              <span className="absolute h-3 w-3 rounded-full border-2 border-surface bg-clip" style={{ left: nodeX - 6, top: NODE_Y - 6 }} aria-hidden="true" />
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Link href={`/projects/${row.project.id}/`} className="font-display font-bold hover:text-accent">
                    {row.project.title}
                  </Link>
                  <StarCount stars={getProjectStars(row.project)} />
                </p>
                <p className="tabular font-mono text-xs text-muted">
                  {formatPeriod(row.project, t('common.present'))}
                  {row.from ? ` · ${t('work.successor', { name: row.from.title })}` : ''}
                </p>
                <p className="mt-1 text-sm text-muted">{row.note}</p>
              </div>
              <TimeStrip at={at} band={band} line={[yearValue(row.project.timeline.start), lineEnd(row.project)]} />
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function Chapter({ chapter }: { chapter: WorkChapter }) {
  const { t } = useLanguage()
  return (
    <section id={chapter.id} aria-labelledby={`${chapter.id}-title`} className="mt-24 scroll-mt-24 border-t border-line pt-12">
      <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <div className="grid h-fit gap-8 lg:sticky lg:top-24">
          <div>
            <p className="tabular font-mono text-sm text-muted">
              {chapter.start} – {displayDate(chapter.end, t('common.present'))}
            </p>
            <h2 id={`${chapter.id}-title`} className="mt-2 font-display text-4xl font-bold tracking-tight">
              {chapter.name}
            </h2>
            <p className="mt-2 font-display text-lg leading-snug text-plum">{chapter.title}</p>
          </div>
          <RolePath chapter={chapter} />
        </div>

        <div className="grid min-w-0 gap-12">
          <div className="grid max-w-prose gap-4 text-lg leading-relaxed">
            {chapter.summary.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {chapter.projects.length > 0 && (
            <div className="grid gap-4">
              <ul className="grid gap-6">
                {chapter.projects.map((project) => (
                  <li key={project.id}>
                    <WorkProjectCard project={project} />
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted">{t('work.figures')}</p>
            </div>
          )}
          {chapter.spinoffs.length > 0 && <Lineage chapter={chapter} />}
        </div>
      </div>
    </section>
  )
}

export default function WorkPage() {
  const { locale, t } = useLanguage()
  const chapters = getWorkChapters(locale)
  return (
    <div className="shell pt-14 md:pt-20">
      <header>
        <p className="eyebrow">{t('work.eyebrow')}</p>
        <h1 className="mt-3 font-display text-5xl font-bold tracking-tight md:text-6xl">{t('work.title')}</h1>
        <p className="mt-4 max-w-[62ch] text-lg text-muted">{t('work.intro')}</p>
      </header>

      <CareerRibbon chapters={chapters} />

      {chapters.map((chapter) => (
        <Chapter key={chapter.id} chapter={chapter} />
      ))}

      <section className="mt-24 flex flex-col items-start justify-between gap-6 rounded-3xl border border-line bg-surface p-8 md:flex-row md:items-center md:p-10">
        <p className="max-w-prose text-lg">{t('work.closing')}</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/experience/" className="btn-primary">
            {t('nav.experience')}
          </Link>
          <Link href="/projects/" className="btn-ghost">
            {t('nav.projects')}
          </Link>
        </div>
      </section>
    </div>
  )
}
