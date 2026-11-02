'use client'

import Link from 'next/link'
import CopyButton from '@/components/CopyButton'
import Icon from '@/components/Icon'
import { useLanguage } from '@/contexts/LanguageContext'
import { getPersonalInfo } from '@/data/personal'

export default function AboutPage() {
  const { locale, t } = useLanguage()
  const me = getPersonalInfo(locale)

  return (
    <div className="shell pt-14 md:pt-20">
      <header className="grid gap-10 md:grid-cols-[minmax(0,1fr)_14rem] md:items-end">
        <div>
          <h1 className="font-display text-5xl font-bold tracking-tight md:text-6xl">{t('about.title')}</h1>
          <p className="mt-4 max-w-[54ch] text-lg text-muted">{t('about.lead')}</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={me.avatar} alt={t('home.hero.avatarAlt')} width={224} height={224} className="aspect-square w-28 rounded-[1.5rem] border border-line object-cover md:w-full" />
      </header>

      <section className="mt-16 grid gap-10 border-t border-line pt-12 lg:grid-cols-[14rem_minmax(0,1fr)]" aria-labelledby="story-title">
        <h2 id="story-title" className="font-display text-2xl font-bold">
          {t('about.story')}
        </h2>
        <div className="grid max-w-prose gap-5 text-lg leading-relaxed">
          {me.story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-10 border-t border-line pt-12 lg:grid-cols-[14rem_minmax(0,1fr)]" aria-labelledby="how-title">
        <h2 id="how-title" className="font-display text-2xl font-bold">
          {t('about.how')}
        </h2>
        <div className="max-w-prose">
          <p className="font-display text-2xl leading-relaxed">{me.howIWork}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {me.tools.map((tool) => (
              <li key={tool} className="chip">
                {tool}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-16 grid gap-10 border-t border-line pt-12 lg:grid-cols-[14rem_minmax(0,1fr)]" aria-labelledby="languages-title">
        <h2 id="languages-title" className="font-display text-2xl font-bold">
          {t('about.languages')}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {me.languages.map((language) => (
            <li key={language.name} className="rounded-2xl border border-line bg-surface p-5">
              <p className="font-display text-xl font-bold">{language.name}</p>
              <p className="mt-1 font-mono text-sm text-accent">{language.level}</p>
              <p className="mt-2 text-sm text-muted">{language.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 grid gap-10 border-t border-line pt-12 lg:grid-cols-[14rem_minmax(0,1fr)]" aria-labelledby="contact-title">
        <h2 id="contact-title" className="font-display text-2xl font-bold">
          {t('about.contact')}
        </h2>
        <div>
          <p className="max-w-prose text-muted">{t('about.contactIntro')}</p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <a href={`mailto:${me.email}`} className="btn-primary">
              <Icon name="email" size={16} /> {me.email}
            </a>
            <CopyButton value={me.email} />
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {me.socialLinks.map((link) => (
              <li key={link.name}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted transition-colors hover:text-ink">
                  <Icon name={link.icon} size={15} />
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-20">
        <Link href="/valhalla/" className="group flex flex-col gap-4 rounded-3xl bg-[#1a1214] p-8 text-[#efe5e1] md:flex-row md:items-center md:justify-between md:p-10">
          <span>
            <span className="font-pixel text-sm text-[#f28a38]">VALHALLA</span>
            <span className="mt-2 block font-display text-2xl font-bold">{t('about.valhalla')}</span>
            <span className="mt-2 block max-w-prose text-[#cbbcb9]">{t('about.valhallaBody')}</span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-[#8de6cf]">
            {t('about.valhallaCta')} <Icon name="arrow" size={18} className="transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </section>
    </div>
  )
}
