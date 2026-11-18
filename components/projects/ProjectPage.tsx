'use client'

// 案例頁模板（Telepy 以外的所有作品）：標頭 → 主圖 → 概要 / 問題 / 做法 / 成果 / 功能 → 截圖 → 相關作品。
import Link from 'next/link'
import type { ReactNode } from 'react'
import Icon from '@/components/Icon'
import ArchitectureFlow from '@/components/projects/ArchitectureFlow'
import { DiagramCard, FlowSidePanel, useWideLayout } from '@/components/projects/DiagramPanel'
import ProjectCard, { StatusTag } from '@/components/projects/ProjectCard'
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

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-4">
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      {children}
    </section>
  )
}

/** 一張截圖加說明；點了開原圖。直式截圖限制高度、置中，不會把頁面撐得太長。 */
function Shot({ src, caption, alt }: { src: string; caption: string; alt: string }) {
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

function Bullets({ items }: { items: string[] }) {
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

      {/* 文字和截圖一欄到底，截圖穿插在段落之間，剩下的放最後。
          寬螢幕：右欄是技術和流程圖，流程圖跟著捲動停在畫面裡；架構圖在下方全寬。
          窄螢幕：流程圖和架構圖合成一張卡，放在第一段文字後面。擺法見 DiagramPanel.tsx。 */}
      <div className={`mt-16 grid gap-14 ${hasFlow ? 'lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-12' : 'lg:grid-cols-[minmax(0,1fr)_16rem]'}`}>
        <div className="grid min-w-0 gap-12 text-[1.0625rem] leading-relaxed">
          <div className="grid max-w-prose gap-12">
            <Block title={t('project.overview')}>
              <p>{project.longDescription}</p>
            </Block>
            {project.why && (
              <Block title={t('project.why')}>
                <p>{project.why}</p>
              </Block>
            )}
            {project.gains && (
              <Block title={t('project.gains')}>
                <p>{project.gains}</p>
              </Block>
            )}
          </div>
          {shots[0] && <Shot {...shots[0]} />}
          {(hasFlow || hasArchitecture) && (
            <div className="reveal min-w-0 lg:hidden">{!wide && <DiagramCard flow={project.flow} architecture={project.architecture} seed={project.id} />}</div>
          )}
          {(project.challenges.length > 0 || project.solutions.length > 0) && (
            <div className="grid max-w-prose gap-12">
              {project.challenges.length > 0 && (
                <Block title={t('project.problem')}>
                  <Bullets items={project.challenges} />
                </Block>
              )}
              {project.solutions.length > 0 && (
                <Block title={t('project.approach')}>
                  <Bullets items={project.solutions} />
                </Block>
              )}
            </div>
          )}
          {shots[1] && <Shot {...shots[1]} />}
          {(project.results.length > 0 || project.features.length > 0) && (
            <div className="grid max-w-prose gap-12">
              {project.results.length > 0 && (
                <Block title={t('project.results')}>
                  <Bullets items={project.results} />
                </Block>
              )}
              {project.features.length > 0 && (
                <Block title={t('project.features')}>
                  <Bullets items={project.features} />
                </Block>
              )}
            </div>
          )}
          {shots[2] && <Shot {...shots[2]} />}
          {project.lessons && project.lessons.length > 0 && (
            <div className="grid max-w-prose gap-12">
              <Block title={t('project.lessons')}>
                <Bullets items={project.lessons} />
              </Block>
            </div>
          )}
        </div>
        <aside className={`h-fit lg:sticky lg:top-24 ${hasFlow ? 'lg:flex lg:max-h-[calc(100vh-7rem)] lg:flex-col lg:gap-6' : ''}`}>
          <div>
            <h2 className="eyebrow">{t('project.stack')}</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <li key={tech} className="chip">
                  {tech}
                </li>
              ))}
            </ul>
          </div>
          {hasFlow && <div className="hidden min-h-0 flex-1 flex-col lg:flex">{wide && <FlowSidePanel steps={project.flow!} seed={project.id} />}</div>}
        </aside>
      </div>

      {hasArchitecture && (
        <section className="mt-20 hidden lg:block" aria-labelledby="architecture-title">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              <h2 id="architecture-title" className="font-display text-2xl font-bold">
                {t('project.architecture')}
              </h2>
              <p className="mt-2 max-w-prose text-sm text-muted">{t('project.architectureNote')}</p>
            </div>
            {wide && <MascotRemark section="architecture" seed={project.id} pose="wave" />}
          </div>
          {wide && (
            <div className="reveal mt-6">
              <ArchitectureFlow steps={project.architecture!} />
              <p className="mt-4 font-mono text-[11px] text-muted">{t('project.diagramHint')}</p>
            </div>
          )}
        </section>
      )}

      {shots.length > 3 && (
        <section className="mt-20" aria-labelledby="gallery-title">
          <h2 id="gallery-title" className="font-display text-2xl font-bold">
            {t('project.gallery')}
          </h2>
          <ul className="mt-6 grid gap-8 md:grid-cols-2">
            {shots.slice(3).map((shot) => (
              <li key={shot.src}>
                <Shot {...shot} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <RelatedProjects project={project} />
    </div>
  )
}
