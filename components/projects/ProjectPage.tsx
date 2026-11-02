'use client'

// 案例頁模板（Telepy 以外的所有作品）：標頭 → 主圖 → 概要 / 問題 / 做法 / 成果 / 功能 → 截圖 → 相關作品。
import Link from 'next/link'
import type { ReactNode } from 'react'
import Icon from '@/components/Icon'
import ProjectCard, { StatusTag } from '@/components/projects/ProjectCard'
import { StarCount, ThemeLabel } from '@/components/site/ui'
import { useLanguage } from '@/contexts/LanguageContext'
import { getProjectById, getProjectStars, getRelatedProjects, localizeCategory, type ProjectDetail } from '@/data/projects'

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
  const project = getProjectById(id, locale)
  if (!project) return null
  const [cover, ...gallery] = project.images

  const facts: [string, ReactNode][] = [
    [t('project.role'), project.role],
    [t('project.period'), <span key="period" className="tabular">{formatPeriod(project, t('common.present'))}</span>],
    [t('project.status'), <StatusTag key="status" status={project.status} />],
    [t('project.theme'), <ThemeLabel key="theme" theme={project.theme} />],
  ]

  return (
    <div className="shell pt-10">
      <BackLink />
      <header className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div>
          <p className="eyebrow">{localizeCategory(project.category, locale)}</p>
          <h1 className="mt-3 font-display text-5xl font-bold tracking-tight md:text-6xl">{project.title}</h1>
          <p className="mt-3 font-display text-xl text-muted md:text-2xl">{project.subtitle}</p>
          <p className="mt-6 max-w-prose text-lg">{project.description}</p>
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

      <div className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="grid max-w-prose gap-12 text-[1.0625rem] leading-relaxed">
          <Block title={t('project.overview')}>
            <p>{project.longDescription}</p>
          </Block>
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
        <aside className="h-fit lg:sticky lg:top-24">
          <h2 className="eyebrow">{t('project.stack')}</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <li key={tech} className="chip">
                {tech}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {gallery.length > 0 && (
        <section className="mt-20" aria-labelledby="gallery-title">
          <h2 id="gallery-title" className="font-display text-2xl font-bold">
            {t('project.gallery')}
          </h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-2">
            {gallery.map((src, index) => (
              <li key={src}>
                <a href={src} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-ink/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={t('project.imageAlt', { title: project.title, n: index + 2 })} loading="lazy" className="block w-full" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <RelatedProjects project={project} />
    </div>
  )
}
