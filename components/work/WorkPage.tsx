'use client'

// 工作專案頁（/work）：職涯時間帶 → 章節目錄 → 每份工作一章（職位、說明、工作專案、衍生的開源 repo）。
// 文字在 content/work.json 與各作品的 JSON；這裡只負責版面。
import Link from 'next/link'
import type { CSSProperties } from 'react'
import Icon from '@/components/Icon'
import { formatPeriod } from '@/components/projects/ProjectPage'
import { StarCount, ThemeLabel } from '@/components/site/ui'
import { useLanguage } from '@/contexts/LanguageContext'
import { getProjectStars, type ProjectDetail } from '@/data/projects'
import { buildYear, getWorkChapters, yearValue, type SourceKind, type SpinoffGroup, type WorkChapter } from '@/data/work'

/** 把年份換成時間軸上的百分比。 */
function scale(start: number, end: number) {
  return (value: number) => Math.min(100, Math.max(0, ((value - start) / (end - start)) * 100))
}

/** 結束時間只寫年份（"2021"）時算到那年年底，不然一年的作品會畫成零長度。 */
function endValue(value: string | undefined) {
  return value && /^\d{4}$/.test(value) ? Number(value) + 11 / 12 : yearValue(value)
}

function displayDate(value: string, present: string) {
  return value === 'Present' ? present : value
}

/** 每份工作一段，長度照任職時間；只畫有章節的工作，段與段之間不留空白。 */
function CareerRibbon({ chapters }: { chapters: WorkChapter[] }) {
  const { t } = useLanguage()
  const ordered = [...chapters].sort((a, b) => yearValue(a.start) - yearValue(b.start))

  return (
    <section aria-labelledby="ribbon-title" className="mt-14">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 id="ribbon-title" className="eyebrow">
          {t('work.ribbon')}
        </h2>
        <p className="text-sm text-muted">{t('work.ribbonNote')}</p>
      </div>
      <ol className="mt-4 flex gap-0.5">
        {ordered.map((chapter, index) => {
          const years = endValue(chapter.end) - yearValue(chapter.start)
          const period = `${chapter.start} – ${displayDate(chapter.end, t('common.present'))}`
          return (
            <li key={chapter.id} className="min-w-0" style={{ flex: `${years} 1 0%` }}>
              <a
                href={`#${chapter.id}`}
                title={`${chapter.name} · ${period}`}
                className={`flex h-9 items-center overflow-hidden px-2 font-mono text-[11px] font-semibold text-paper transition-[filter] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
                  index === ordered.length - 1 ? 'rounded-r-md bg-accent-fill' : 'bg-accent-fill/80'
                } ${index === 0 ? 'rounded-l-md' : ''}`}
              >
                <span className="truncate">{chapter.name}</span>
              </a>
              <span className="tabular mt-1.5 block break-words px-0.5 font-mono text-[10px] leading-tight text-muted">{period}</span>
            </li>
          )
        })}
      </ol>

      <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

/** 每種來源的主幹樣式：公司是鎖住的柿色虛線，學校研究是梅色，外包案是墨色。 */
const SOURCE_STYLE: Record<SourceKind, { icon: string; chip: string; trunk: string; band: string }> = {
  company: { icon: 'lock', chip: 'bg-accent-soft text-accent', trunk: 'border-accent-fill/70', band: 'border-accent-fill/50 bg-accent-soft' },
  study: { icon: 'study', chip: 'bg-plum/10 text-plum', trunk: 'border-plum/50', band: 'border-plum/40 bg-plum/10' },
  contract: { icon: 'contract', chip: 'bg-ink/10 text-ink', trunk: 'border-ink/40', band: 'border-ink/30 bg-ink/10' },
}

/** 一列時間帶：來源的期間（底色）和 repo 的存續期間（線）。 */
function TimeStrip({ at, band, bandClass, line }: { at: (value: number) => number; band?: [number, number]; bandClass: string; line?: [number, number] }) {
  return (
    <div className="relative h-4" aria-hidden="true">
      <span className="absolute inset-x-0 top-1/2 h-px bg-line" />
      {band && (
        <span className={`absolute top-1/2 h-3 -translate-y-1/2 rounded-sm border ${bandClass}`} style={{ left: `${at(band[0])}%`, width: `${at(band[1]) - at(band[0])}%` }} />
      )}
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

function SourceTrunk({ group, at, axisStart }: { group: SpinoffGroup; at: (value: number) => number; axisStart: number }) {
  const { t } = useLanguage()
  const style = SOURCE_STYLE[group.kind]
  const rows = group.spinoffs
  const band: [number, number] | undefined = group.start ? [yearValue(group.start), endValue(group.end)] : undefined
  const lastTrunkRow = rows.map((row) => !row.from).lastIndexOf(true)
  const title = group.kind === 'company' ? t('work.trunk', { name: group.label }) : [group.label, group.detail].filter(Boolean).join(' · ')

  const line = (lineStyle: CSSProperties, tone: 'trunk' | 'lane') => (
    <span className={`absolute w-0 border-l-2 ${tone === 'trunk' ? `border-dashed ${style.trunk}` : 'border-clip'}`} style={lineStyle} aria-hidden="true" />
  )
  const curve = (fromX: number, toX: number) => (
    <span className="absolute rounded-bl-[10px] border-b-2 border-l-2 border-clip" style={{ left: fromX - 1, top: NODE_Y - 10, width: toX - fromX, height: 10 }} aria-hidden="true" />
  )
  const hasChildAfter = (index: number) => rows[index + 1]?.from?.id === rows[index].project.id

  return (
    <ol>
      <li className="relative grid gap-3 pb-6 last:pb-0 md:grid-cols-[minmax(0,1fr)_14rem] md:items-start" style={{ paddingLeft: LANE_X + 15 }}>
        {rows.length > 0 && line({ left: TRUNK_X - 1, top: NODE_Y, bottom: 0 }, 'trunk')}
        <span className={`absolute grid h-6 w-6 place-items-center rounded-full ${style.chip}`} style={{ left: TRUNK_X - 12, top: NODE_Y - 12 }} aria-hidden="true">
          <Icon name={style.icon} size={13} />
        </span>
        <div>
          <p className="font-display font-bold">{title}</p>
          {group.start && (
            <p className="tabular font-mono text-xs text-muted">
              {group.start} – {displayDate(group.end ?? '', t('common.present'))}
            </p>
          )}
          {group.note && <p className="mt-1 max-w-prose text-sm text-muted">{group.note}</p>}
        </div>
        <div>
          <TimeStrip at={at} band={band} bandClass={style.band} />
          <div className="tabular mt-1 flex justify-between font-mono text-[10px] text-muted" aria-hidden="true">
            <span>{axisStart}</span>
            <span>{t('work.now')}</span>
          </div>
        </div>
      </li>

      {rows.map((row, index) => {
        const child = Boolean(row.from)
        const nodeX = child ? CHILD_X : LANE_X
        return (
          <li key={row.project.id} className="relative grid gap-3 pb-6 last:pb-0 md:grid-cols-[minmax(0,1fr)_14rem] md:items-start" style={{ paddingLeft: nodeX + 15 }}>
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
            <TimeStrip at={at} band={band} bandClass={style.band} line={[yearValue(row.project.timeline.start), endValue(row.project.timeline.end)]} />
          </li>
        )
      })}
    </ol>
  )
}

function Lineage({ chapter }: { chapter: WorkChapter }) {
  const { t } = useLanguage()
  const groups = chapter.spinoffGroups
  // 同一章的每條主幹共用一條時間軸，才看得出誰先誰後。
  const starts = groups.flatMap((group) => [group.start, ...group.spinoffs.map((row) => row.project.timeline.start)]).filter(Boolean) as string[]
  const axisStart = Math.floor(Math.min(...starts.map(yearValue)))
  const at = scale(axisStart, buildYear)

  return (
    <section aria-labelledby={`${chapter.id}-spinoffs`} className="rounded-2xl border border-line bg-surface p-5 md:p-7">
      <h3 id={`${chapter.id}-spinoffs`} className="font-display text-xl font-bold">
        {t('work.spinoffsTitle')}
      </h3>
      <p className="mt-2 max-w-prose text-sm text-muted">{t('work.spinoffsIntro')}</p>
      <div className="mt-6 grid gap-8">
        {groups.map((group) => (
          <SourceTrunk key={`${group.kind}-${group.label}`} group={group} at={at} axisStart={axisStart} />
        ))}
      </div>
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
          {chapter.spinoffGroups.length > 0 && <Lineage chapter={chapter} />}
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
