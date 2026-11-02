'use client'

import Link from 'next/link'
import Icon from '@/components/Icon'
import TelepyLogo from '@/components/projects/TelepyLogo'
import { StarCount } from '@/components/site/ui'
import Tapi from '@/components/tapi/Tapi'
import { useLanguage } from '@/contexts/LanguageContext'
import { telepyCase } from '@/data/content'
import { getProjectById, getProjectStars } from '@/data/projects'
import { pick } from '@/lib/i18n/localize'

export default function Flagship() {
  const { locale, t } = useLanguage()
  const project = getProjectById('telepy', locale)
  if (!project) return null

  return (
    <section aria-labelledby="flagship-title" className="border-y border-line bg-surface">
      <div className="shell grid gap-12 py-20 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
        <div>
          <p className="eyebrow">{t('home.flagship.eyebrow')}</p>
          <div className="mt-5 flex items-center gap-4">
            <TelepyLogo size={52} />
            <h2 id="flagship-title" className="font-display text-5xl font-bold tracking-tight">
              {project.title}
            </h2>
          </div>
          <p className="mt-5 font-display text-2xl font-medium">{pick(locale, telepyCase.tagline)}</p>
          <p className="mt-3 max-w-[56ch] text-muted">{project.description}</p>

          <dl className="mt-8 grid grid-cols-2 gap-3">
            {telepyCase.stats.map((stat) => (
              <div key={stat.value} className="rounded-xl border border-line bg-paper px-4 py-3">
                <dt className="sr-only">{pick(locale, stat.label)}</dt>
                <dd>
                  <span className="tabular block font-display text-2xl font-bold">{stat.value}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-muted" aria-hidden="true">
                    {pick(locale, stat.label)}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/projects/telepy/" className="btn-primary">
              {t('home.flagship.caseStudy')} <Icon name="arrow" size={16} />
            </Link>
            <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <Icon name="github" size={16} /> GitHub
              <StarCount stars={getProjectStars(project)} />
            </a>
          </div>
        </div>

        <div className="relative pt-12 lg:pt-0">
          <div className="absolute right-6 top-0 z-10 lg:-top-[52px]">
            <Tapi pose="wave" size={78} label={t('home.flagship.tapi')} />
          </div>
          <figure className="relative overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_24px_60px_-30px_rgb(var(--plum)/0.45)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={telepyCase.banner} alt={t('home.flagship.shotAlt')} loading="lazy" className="block w-full" />
          </figure>
        </div>
      </div>
    </section>
  )
}
