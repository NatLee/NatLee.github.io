'use client'

import Link from 'next/link'
import Icon from '@/components/Icon'
import { Emphasis } from '@/components/site/ui'
import { useLanguage } from '@/contexts/LanguageContext'
import { getPersonalInfo } from '@/data/personal'
import { allProjectsData } from '@/data/projects'

export default function Hero() {
  const { locale, t } = useLanguage()
  const me = getPersonalInfo(locale)
  const demoCount = allProjectsData.filter(project => project.links.demo).length

  return (
    <section aria-labelledby="hero-title" className="shell grid gap-10 pb-16 pt-12 md:grid-cols-[minmax(0,1fr)_15rem] md:items-start md:pt-20 lg:grid-cols-[minmax(0,1fr)_17rem]">
      <div>
        <p className="eyebrow">{t('home.hero.eyebrow', { location: me.location, year: me.careerStartYear })}</p>
        <h1 id="hero-title" className="mt-4 font-display text-6xl font-bold leading-none tracking-tight md:text-7xl lg:text-8xl">
          {me.displayName}
        </h1>
        <p className="mt-7 max-w-[32ch] font-display text-2xl font-medium leading-snug md:text-[2rem] md:leading-[1.3]">
          <Emphasis text={me.tagline.lead} />
        </p>
        <p className="mt-4 max-w-[54ch] text-lg text-muted">{me.tagline.sub}</p>

        <div className="mt-8 max-w-[60ch] rounded-xl border border-line bg-surface px-5 py-4 font-mono text-[13px] leading-relaxed">
          <span className="type-cmd font-semibold text-clip" style={{ width: '13ch' }}>
            {t('home.hero.nowCmd')}
          </span>
          <p className="after-type caret mt-1 text-ink">{me.now}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/projects/" className="btn-primary">
            {t('home.hero.cta')} <Icon name="arrow" size={16} />
          </Link>
          <a href="#playground" className="btn-ghost">
            {t('home.hero.try')} <Icon name="arrow" size={16} className="rotate-90" />
          </a>
          <Link href="/about/" className="inline-flex items-center px-2 text-sm font-semibold text-muted hover:text-ink">
            {t('home.hero.about')}
          </Link>
        </div>

        <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {me.socialLinks.slice(0, 6).map((link) => (
            <li key={link.name}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted transition-colors hover:text-ink">
                <Icon name={link.icon} size={15} />
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="hidden md:block md:pt-10">
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={me.avatar}
            alt={t('home.hero.avatarAlt')}
            width={272}
            height={272}
            className="aspect-square w-full rounded-[1.75rem] border border-line bg-surface object-cover"
          />
        </figure>
        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
          <div>
            <dt className="text-xs text-muted">{t('home.hero.projects')}</dt>
            <dd className="mt-1 font-display text-3xl font-bold tabular-nums">{allProjectsData.length}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">{t('home.hero.demos')}</dt>
            <dd className="mt-1 font-display text-3xl font-bold tabular-nums text-clip">{demoCount}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
