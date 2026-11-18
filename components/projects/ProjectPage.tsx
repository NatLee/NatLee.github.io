'use client'

// 案例頁模板（Telepy 以外的所有作品）：標頭（資料卡含技術）→ 主圖 → 交錯敘事的正文（見下方註解）→ 相關作品。
import Link from 'next/link'
import type { ReactNode } from 'react'
import Icon from '@/components/Icon'
import ArchitectureFlow from '@/components/projects/ArchitectureFlow'
import { DiagramCard, FlowSidePanel, useWideLayout } from '@/components/projects/DiagramPanel'
import ProjectCard, { StatusTag } from '@/components/projects/ProjectCard'
import { Block, Bullets, Checklist, Gallery, Intro, LessonCards, ProblemApproach, PullQuote, Row, Shot } from '@/components/projects/ProjectSections'
import { StarCount, ThemeLabels } from '@/components/site/ui'
import { MascotRemark } from '@/components/mascot/Mascot'
import OriginBadge from '@/components/work/OriginBadge'
import { useLanguage } from '@/contexts/LanguageContext'
import { getProjectById, getProjectStars, getRelatedProjects, localizeCategory, type ProjectDetail } from '@/data/projects'
import { getProjectOrigins } from '@/data/work'
import { pick } from '@/lib/i18n/localize'

const LINK_ORDER = ['github', 'demo', 'pypi', 'documentation', 'article'] as const
const LINK_ICON: Record<(typeof LINK_ORDER)[number], string> = {
  github: 'github',
  demo: 'demo',
  pypi: 'pypi',
  documentation: 'docs',
  article: 'article',
}

export function ProjectLinks({ project, primary = 'github' }: { project: ProjectDetail; primary?: string }) {
  const { t } = useLanguage()
  const keys = LINK_ORDER.filter((key) => project.links[key])
  if (!keys.length) return null
  return (
    <div className="flex flex-wrap gap-2">
      {keys.map((key) => (
        <a
          key={key}
          href={project.links[key]}
          target="_blank"
          rel="noopener noreferrer"
          className={key === primary ? 'btn-primary' : 'btn-ghost'}
        >
          <Icon name={LINK_ICON[key]} size={16} />
          {t(`project.links.${key}`)}
          {key === 'github' && <StarCount stars={getProjectStars(project)} tone={key === primary ? 'inherit' : 'muted'} />}
          <span className="sr-only">({t('common.newTab')})</span>
        </a>
      ))}
    </div>
  )
}

export function formatPeriod(project: ProjectDetail, present: string) {
  const start = project.timeline.start?.replace('-', '.') ?? ''
  const end = !project.timeline.end || project.timeline.end === 'Present' ? present : project.timeline.end.replace('-', '.')
  return start === end ? start : `${start} – ${end}`
}

export function RelatedProjects({ project }: { project: ProjectDetail }) {
  const { locale, t } = useLanguage()
  const related = getRelatedProjects(project, locale)
  if (!related.length) return null
  return (
    <section className="mt-24" aria-labelledby="related-title">
      <h2 id="related-title" className="section-title">
        {t('project.related')}
      </h2>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((item) => (
          <li key={item.id} className="flex">
            <ProjectCard project={item} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export function BackLink() {
  const { t } = useLanguage()
  return (
    <nav aria-label="Breadcrumb" className="no-print">
      <Link href="/projects/" className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink">
        <Icon name="arrow" size={15} className="rotate-180" />
        {t('project.back')}
      </Link>
    </nav>
  )
}

export default function ProjectPage({ id }: { id: string }) {
  const { locale, t } = useLanguage()
  const wide = useWideLayout()
  const project = getProjectById(id, locale)
  if (!project) return null
  const [cover, ...gallery] = project.images
  const hasFlow = Boolean(project.flow?.length)
  const hasArchitecture = Boolean(project.architecture?.length)
  // 截圖（封面以外）和說明：前三張穿插在段落之間，其餘放最後的截圖區。
  const shots = gallery.map((src, index) => ({
    src,
    caption: project.imageCaptions?.[index + 1] || '',
    alt: t('project.imageAlt', { title: project.title, n: index + 2 }),
  }))
  // 截圖依序發給各段：有流程圖時一張放在流程圖旁邊；沒有流程圖時功能配一張、成果配一張（有成果才配，不讓截圖單獨佔一列）。
  // 沒發出去的都放最後的截圖區。
  const pool = [...shots]
  const chapterShot = hasFlow ? pool.shift() : undefined
  const featureShot = !hasFlow && project.features.length ? pool.shift() : undefined
  const resultShot = !hasFlow && project.results.length ? pool.shift() : undefined
  const galleryShots = pool

  const origins = getProjectOrigins(project.id)
  const origin = origins.find((item) => item.kind === 'work')
  const chapterLink = origin && `/work/#${origin.chapterId}`

  const facts: [string, ReactNode][] = [
    [t('project.role'), project.role],
    [t('project.period'), <span key="period" className="tabular">{formatPeriod(project, t('common.present'))}</span>],
    [t('project.status'), <StatusTag key="status" status={project.status} />],
    [t('project.theme'), <ThemeLabels key="theme" themes={project.themes} />],
  ]
  if (origin && chapterLink) {
    facts.push([t('project.company'), <Link key="company" href={chapterLink} className="link">{project.company}</Link>])
  } else if (origins.length) {
    // 衍生 repo 可能有好幾個出處，每個都連到它在 /work 的那一章。
    facts.push([
      t('project.origin'),
      <span key="origin" className="flex flex-wrap gap-x-2">
        {origins.map((item, index) => (
          <span key={`${item.chapterId}-${item.label.en}`}>
            <Link href={`/work/#${item.chapterId}`} className="link">
              {pick(locale, item.label)}
            </Link>
            {index < origins.length - 1 ? ' +' : ''}
          </span>
        ))}
      </span>,
    ])
  }
  // 技術放在資料卡最後，正文就不必留一條窄欄給它。
  facts.push([
    t('project.stack'),
    <ul key="stack" className="flex flex-wrap gap-1.5">
      {project.technologies.map((tech) => (
        <li key={tech} className="chip">
          {tech}
        </li>
      ))}
    </ul>,
  ])

  return (
    <div className="shell pt-10">
      <BackLink />
      <header className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="eyebrow">{localizeCategory(project.category, locale)}</p>
            <OriginBadge projectId={project.id} />
          </div>
          <h1 className="mt-3 break-words font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">{project.title}</h1>
          <p className="mt-3 font-display text-xl text-muted md:text-2xl">{project.subtitle}</p>
          <p className="mt-6 max-w-prose text-lg">{project.description}</p>
          {origin?.kind === 'work' && chapterLink && (
            <p className="mt-6 flex max-w-prose gap-3 rounded-xl border border-accent-fill/50 bg-accent-soft/60 px-4 py-3 text-sm leading-relaxed">
              <Icon name="lock" size={16} className="mt-0.5 shrink-0 text-accent" />
              <span>
                {t('project.workNotice', { company: pick(locale, origin.label) })}{' '}
                <Link href={chapterLink} className="link font-semibold">
                  {t('project.workChapter')}
                </Link>
              </span>
            </p>
          )}
          <div className="mt-8">
            <ProjectLinks project={project} />
          </div>
        </div>
        <dl className="grid h-fit gap-4 rounded-2xl border border-line bg-surface p-5 text-sm">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt className="eyebrow">{label}</dt>
              <dd className="mt-1">{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      {cover ? (
        <figure className="mt-12 overflow-hidden rounded-2xl border border-line bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover} alt={t('project.imageAlt', { title: project.title, n: 1 })} className="mx-auto block max-h-[70vh] w-auto max-w-full" />
        </figure>
      ) : (
        <p className="mt-12 rounded-2xl border border-dashed border-line p-6 text-sm text-muted">{t('project.noImage')}</p>
      )}

      {/* 交錯敘事：每一段依內容挑排法（ProjectSections.tsx），往下捲有起伏，整頁寬度都用上。
          開場（大字概要＋「為什麼做」小卡）→ 引言（能帶來什麼）→ 中段 → 學到什麼 → 架構圖 → 其餘截圖。
          中段，寬螢幕：有流程圖時是「怎麼運作」一章，流程圖跟著捲、旁邊是功能、問題與做法、成果和一張截圖；
          沒有流程圖時截圖和文字左右交錯。窄螢幕都是一欄，流程圖和架構圖在同一張卡裡（DiagramPanel.tsx）。 */}
      <div className="mt-16 grid gap-16 text-[1.0625rem] leading-relaxed lg:gap-20">
        <Intro overviewTitle={t('project.overview')} overview={project.longDescription} whyTitle={t('project.why')} why={project.why} />
        {project.gains && <PullQuote label={t('project.gains')} text={project.gains} />}

        {(hasFlow || hasArchitecture) && (
          <div className="reveal min-w-0 lg:hidden">{!wide && <DiagramCard flow={project.flow} architecture={project.architecture} seed={project.id} lines={project.mascotLines} />}</div>
        )}

        {hasFlow ? (
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
            {/* 左格撐滿這一章的高度，流程圖在裡面跟著捲（sticky 需要外層比自己高）。 */}
            <div className="hidden min-w-0 lg:block">
              <div className="sticky top-24 flex max-h-[calc(100vh-7rem)] flex-col">
                {wide && <FlowSidePanel steps={project.flow!} seed={project.id} lines={project.mascotLines} />}
              </div>
            </div>
            <div className="grid min-w-0 content-start gap-12">
              {project.features.length > 0 && <Checklist title={t('project.features')} items={project.features} />}
              <ProblemApproach stacked problemTitle={t('project.problem')} problems={project.challenges} approachTitle={t('project.approach')} approaches={project.solutions} />
              {project.results.length > 0 && (
                <Block title={t('project.results')}>
                  <Bullets items={project.results} />
                </Block>
              )}
              {chapterShot && <Shot {...chapterShot} />}
            </div>
          </div>
        ) : (
          <>
            {project.features.length > 0 && (
              <Row shot={featureShot}>
                <Checklist title={t('project.features')} items={project.features} columns={featureShot ? 1 : 2} />
              </Row>
            )}
            <ProblemApproach problemTitle={t('project.problem')} problems={project.challenges} approachTitle={t('project.approach')} approaches={project.solutions} />
            {project.results.length > 0 && (
              <Row shot={resultShot} flip>
                <div className="max-w-prose">
                  <Block title={t('project.results')}>
                    <Bullets items={project.results} />
                  </Block>
                </div>
              </Row>
            )}
          </>
        )}

        {project.lessons && project.lessons.length > 0 && <LessonCards title={t('project.lessons')} items={project.lessons} />}

        {hasArchitecture && (
          <section className="hidden rounded-3xl border border-line bg-surface/60 p-8 lg:block" aria-labelledby="architecture-title">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
              <div>
                <h2 id="architecture-title" className="font-display text-2xl font-bold">
                  {t('project.architecture')}
                </h2>
                <p className="mt-2 max-w-prose text-sm text-muted">{t('project.architectureNote')}</p>
              </div>
              {wide && <MascotRemark section="architecture" seed={project.id} own={project.mascotLines} pose="wave" />}
            </div>
            {wide && (
              <div className="reveal mt-6">
                <ArchitectureFlow steps={project.architecture!} />
                <p className="mt-4 font-mono text-[11px] text-muted">{t('project.diagramHint')}</p>
              </div>
            )}
          </section>
        )}

        <Gallery title={t('project.gallery')} shots={galleryShots} />
      </div>

      <RelatedProjects project={project} />
    </div>
  )
}
