'use client'

// 作品索引：搜尋 + 主題篩選，結果分三層顯示（旗艦、精選卡片、其他列表）。
// 篩選條件寫進網址（?theme=ai&q=django），可以直接分享。
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import Icon from '@/components/Icon'
import ProjectCard, { StatusTag } from '@/components/projects/ProjectCard'
import TelepyLogo from '@/components/projects/TelepyLogo'
import { StarCount, ThemeLabel } from '@/components/site/ui'
import { useLanguage } from '@/contexts/LanguageContext'
import { PROJECT_THEMES, getLocalizedProjects, getProjectStars, projectYear, type ProjectDetail, type ProjectTheme } from '@/data/projects'
import { projectFilterSearch, readProjectFilters } from '@/lib/project-filters'

type ThemeFilter = ProjectTheme | 'all'

function haystack(project: ProjectDetail) {
  return [project.title, project.subtitle, project.description, project.category, project.theme, ...project.technologies].join(' ').toLowerCase()
}

export default function ProjectsIndex() {
  const { locale, t } = useLanguage()
  const projects = useMemo(() => getLocalizedProjects(locale), [locale])
  const [query, setQuery] = useState('')
  const [theme, setTheme] = useState<ThemeFilter>('all')
  const [demoOnly, setDemoOnly] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    function restoreFilters() {
      const filters = readProjectFilters(window.location.search, PROJECT_THEMES)
      setTheme(filters.theme as ThemeFilter)
      setQuery(filters.query)
      setDemoOnly(filters.demoOnly)
      setReady(true)
    }
    restoreFilters()
    window.addEventListener('popstate', restoreFilters)
    return () => window.removeEventListener('popstate', restoreFilters)
  }, [])

  useEffect(() => {
    if (!ready) return
    const search = projectFilterSearch({ theme, query, demoOnly })
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${search}${window.location.hash}`)
  }, [theme, query, demoOnly, ready])

  const needle = query.trim().toLowerCase()
  const byQuery = projects.filter((project) => (!demoOnly || Boolean(project.links.demo)) && (!needle || haystack(project).includes(needle)))
  const visible = byQuery.filter((project) => theme === 'all' || project.theme === theme)
  const countFor = (value: ThemeFilter) => (value === 'all' ? byQuery.length : byQuery.filter((p) => p.theme === value).length)

  const flagship = visible.filter((p) => p.tier === 'flagship')
  const selected = visible.filter((p) => p.tier === 'selected')
  const archive = visible.filter((p) => p.tier === 'archive')

  function clear() {
    setQuery('')
    setTheme('all')
    setDemoOnly(false)
  }

  return (
    <>
      <header className="shell pt-14 md:pt-20">
        <h1 className="font-display text-5xl font-bold tracking-tight md:text-6xl">{t('projects.title')}</h1>
        <p className="mt-4 max-w-[60ch] text-lg text-muted">{t('projects.intro', { count: projects.length })}</p>
      </header>

      <div className="shell mt-10 grid gap-4">
        <label htmlFor="project-search" className="sr-only">
          {t('projects.searchLabel')}
        </label>
        <div className="relative max-w-xl">
          <Icon name="search" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="project-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('projects.searchPlaceholder')}
            autoComplete="off"
            className="h-12 w-full rounded-xl border border-line bg-surface pl-11 pr-12 text-base text-ink placeholder:text-muted/80 focus:border-accent-fill focus:outline-none"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-line px-1.5 font-mono text-xs text-muted sm:block">/</kbd>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label={t('projects.searchLabel')}>
          {(['all', ...PROJECT_THEMES] as ThemeFilter[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              aria-pressed={theme === value}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                theme === value ? 'border-ink bg-ink text-paper' : 'border-line bg-surface text-muted hover:border-ink/40 hover:text-ink'
              }`}
            >
              {value === 'all' ? t('projects.all') : t(`projects.themes.${value}`)}
              <span className="tabular font-mono text-xs opacity-70">{countFor(value)}</span>
            </button>
          ))}
        </div>
        <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={demoOnly} onChange={event => setDemoOnly(event.target.checked)} className="h-4 w-4 accent-[rgb(var(--clip))]" />
          {t('projects.demoOnly')}
        </label>
        <p className="font-mono text-xs text-muted" aria-live="polite">
          {t('projects.shown', { shown: visible.length, total: projects.length })}
        </p>
      </div>

      {visible.length === 0 && (
        <div className="shell mt-10">
          <div className="rounded-2xl border border-dashed border-line p-8">
            <p className="text-muted">{t('projects.empty', { query: query.trim() || t(`projects.themes.${theme}`) })}</p>
            <button type="button" onClick={clear} className="btn-ghost mt-4">
              {t('projects.clear')}
            </button>
          </div>
        </div>
      )}

      {flagship.map((project) => (
        <section key={project.id} className="shell mt-10" aria-label={project.title}>
          <Link
            href={`/projects/${project.id}/`}
            className="group grid gap-6 rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-accent-fill/60 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:p-8"
          >
            <TelepyLogo size={56} />
            <span className="min-w-0">
              <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="font-display text-3xl font-bold">{project.title}</span>
                <span className="eyebrow">{t('home.flagship.eyebrow')}</span>
              </span>
              <span className="mt-2 block max-w-[70ch] text-muted">{project.description}</span>
            </span>
            <span className="flex items-center gap-4">
              <StarCount stars={getProjectStars(project)} />
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                {t('home.flagship.caseStudy')} <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </span>
          </Link>
        </section>
      ))}

      {selected.length > 0 && (
        <section className="shell mt-14" aria-labelledby="selected-heading">
          <h2 id="selected-heading" className="eyebrow">
            {t('projects.selected')}
          </h2>
          <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {selected.map((project) => (
              <li key={project.id} className="flex">
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {archive.length > 0 && (
        <section className="shell mt-16" aria-labelledby="archive-heading">
          <h2 id="archive-heading" className="eyebrow">
            {t('projects.more')}
          </h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {archive.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/projects/${project.id}/`}
                  className="group grid gap-x-6 gap-y-1 py-4 md:grid-cols-[minmax(0,1fr)_14rem_4rem_4rem] md:items-baseline"
                >
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="break-words font-display text-lg font-bold transition-colors group-hover:text-accent">{project.title}</span>
                      <StatusTag status={project.status} />
                    </span>
                    <span className="mt-0.5 block text-sm text-muted md:truncate">{project.description}</span>
                  </span>
                  <ThemeLabel theme={project.theme} />
                  <span className="tabular font-mono text-xs text-muted">{projectYear(project)}</span>
                  <span className="flex items-center gap-3 md:justify-end">
                    <StarCount stars={getProjectStars(project)} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
