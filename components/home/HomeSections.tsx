'use client'

// 首頁 Telepy 之後的區塊：精選作品、開源、經歷摘要、工作方式與文章。
import Link from 'next/link'
import Icon from '@/components/Icon'
import ProjectCard from '@/components/projects/ProjectCard'
import { ExternalLink, SectionHeader, StarCount } from '@/components/site/ui'
import { useLanguage } from '@/contexts/LanguageContext'
import { opensource, writing } from '@/data/content'
import { getRepoStats } from '@/data/github'
import { getPersonalInfo } from '@/data/personal'
import { allProjectsData, getProjectsByTier } from '@/data/projects'
import { pick } from '@/lib/i18n/localize'

export function SelectedWork() {
  const { locale, t } = useLanguage()
  const projects = getProjectsByTier('selected', locale).slice(0, 6)
  return (
    <section aria-labelledby="selected-title" className="shell pt-24">
      <SectionHeader
        id="selected-title"
        title={t('home.selected.title')}
        intro={t('home.selected.intro')}
        action={
          <Link href="/projects/" className="link inline-flex items-center gap-1.5 text-sm font-semibold">
            {t('home.selected.all', { count: allProjectsData.length })} <Icon name="arrow" size={15} />
          </Link>
        }
      />
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <li key={project.id} className="flex">
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export function OpenSource() {
  const { locale, t } = useLanguage()
  return (
    <section aria-labelledby="opensource-title" className="shell pt-24">
      <SectionHeader id="opensource-title" title={t('home.opensource.title')} intro={t('home.opensource.intro')} />
      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div>
          <h3 className="eyebrow">{t('home.opensource.upstream')}</h3>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {opensource.upstream.map((item) => (
              <li key={item.repo} className="flex items-start gap-4 py-4">
                <Icon name="pr" size={18} className="mt-1 shrink-0 text-clip" />
                <div className="min-w-0">
                  <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <ExternalLink href={item.url} className="font-mono text-sm font-semibold text-ink hover:text-accent">
                      {item.repo}
                    </ExternalLink>
                    <span className="font-mono text-xs text-muted">
                      {item.count > 1 ? t('home.opensource.prs', { count: item.count }) : t('home.opensource.pr')}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-muted">{pick(locale, item.summary)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="eyebrow">{t('home.opensource.packages')}</h3>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {opensource.packages.map((pkg) => (
              <li key={pkg.name} className="flex items-start gap-4 py-4">
                <Icon name="package" size={18} className="mt-1 shrink-0 text-accent" />
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    {pkg.project ? (
                      <Link href={`/projects/${pkg.project}/`} className="font-mono text-sm font-semibold hover:text-accent">
                        {pkg.name}
                      </Link>
                    ) : (
                      <ExternalLink href={pkg.url} className="font-mono text-sm font-semibold text-ink hover:text-accent" icon={false}>
                        {pkg.name}
                      </ExternalLink>
                    )}
                    <StarCount stars={getRepoStats(pkg.repo)?.stars} />
                  </p>
                  <p className="mt-1 text-sm text-muted">{pick(locale, pkg.summary)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function Career() {
  const { locale, t } = useLanguage()
  const me = getPersonalInfo(locale)
  return (
    <section aria-labelledby="career-title" className="shell pt-24">
      <SectionHeader
        id="career-title"
        title={t('home.career.title')}
        intro={t('home.career.intro')}
        action={
          <Link href="/experience/" className="link inline-flex items-center gap-1.5 text-sm font-semibold">
            {t('home.career.full')} <Icon name="arrow" size={15} />
          </Link>
        }
      />
      <ol className="mt-10 grid gap-6 border-t-2 border-ink pt-6 sm:grid-cols-2 lg:grid-cols-4">
        {me.eras.map((era, index) => (
          <li key={era.period} className="relative">
            <span
              className={`absolute -top-[31px] left-0 h-3 w-3 rounded-full border-2 border-ink ${index === me.eras.length - 1 ? 'bg-accent-fill' : 'bg-paper'}`}
              aria-hidden="true"
            />
            <p className="tabular font-mono text-xs text-muted">{era.period}</p>
            <h3 className="mt-2 font-display text-xl font-bold">{era.title}</h3>
            <p className="mt-2 text-sm text-muted">{era.note}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function WorkAndWriting() {
  const { locale, t } = useLanguage()
  const me = getPersonalInfo(locale)
  return (
    <section className="shell grid gap-14 pt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div aria-labelledby="how-title">
        <h2 id="how-title" className="section-title">
          {t('home.how.title')}
        </h2>
        <p className="mt-6 max-w-[48ch] font-display text-xl leading-relaxed md:text-2xl md:leading-relaxed">{me.howIWork}</p>
        <p className="eyebrow mt-8">{t('home.how.tools')}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {me.tools.map((tool) => (
            <li key={tool} className="chip">
              {tool}
            </li>
          ))}
        </ul>
      </div>
      <div aria-labelledby="writing-title">
        <h2 id="writing-title" className="section-title">
          {t('home.writing.title')}
        </h2>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {writing.map((item) => (
            <li key={item.url}>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="group flex items-start justify-between gap-6 py-4">
                <span className="min-w-0">
                  <span className="block font-display text-lg font-bold transition-colors group-hover:text-accent">{pick(locale, item.title)}</span>
                  <span className="mt-1 block text-sm text-muted">{pick(locale, item.description)}</span>
                  <span className="mt-2 block font-mono text-xs text-muted">{item.source}</span>
                </span>
                <Icon name="external" size={18} className="mt-1 shrink-0 text-muted transition-colors group-hover:text-accent" />
                <span className="sr-only">({t('common.newTab')})</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
