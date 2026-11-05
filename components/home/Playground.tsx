'use client'

import Link from 'next/link'
import Icon from '@/components/Icon'
import { SectionHeader } from '@/components/site/ui'
import { useLanguage } from '@/contexts/LanguageContext'
import playground from '@/content/playground.json'
import { getProjectById, type ProjectDetail } from '@/data/projects'

export default function Playground() {
  const { locale, t } = useLanguage()
  const projects = playground.projects
    .map(id => getProjectById(id, locale))
    .filter((project): project is ProjectDetail => Boolean(project?.links.demo))

  return (
    <section id="playground" aria-labelledby="playground-title" className="shell scroll-mt-24 pt-24">
      <div className="rounded-3xl border border-line bg-clip-soft/40 p-5 sm:p-8 md:p-10">
        <p className="eyebrow text-clip">{t('home.playground.eyebrow')}</p>
        <div className="mt-3">
          <SectionHeader
            id="playground-title"
            title={t('home.playground.title')}
            intro={t('home.playground.intro')}
            action={
              <Link href="/projects/?demo=1" className="link inline-flex items-center gap-1.5 text-sm font-semibold">
                {t('home.playground.all')} <Icon name="arrow" size={15} />
              </Link>
            }
          />
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <li key={project.id} className="flex">
              <article className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-line bg-surface">
                {project.thumbnail && (
                  <div className="aspect-video overflow-hidden border-b border-line bg-paper">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={project.thumbnail} alt="" loading="lazy" decoding="async" width={960} height={540} className="h-full w-full object-contain" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <p className="font-mono text-xs text-clip" aria-hidden="true">{String(index + 1).padStart(2, '0')} /</p>
                  <h3 className="mt-2 break-words font-display text-xl font-bold">
                    <Link href={`/projects/${project.id}/`} className="hover:text-accent">{project.title}</Link>
                  </h3>
                  <p className="mt-2 text-sm text-muted">{project.description}</p>
                  <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-5 self-start" aria-label={t('home.playground.open', { title: project.title })}>
                    {t('home.playground.try')} <Icon name="external" size={14} />
                    <span className="sr-only">({t('common.newTab')})</span>
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
