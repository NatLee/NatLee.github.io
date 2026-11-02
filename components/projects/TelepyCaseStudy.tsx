'use client'

// Telepy 的客製案例頁：標頭與數字 → 為什麼要做 → 架構 → 四組功能 → Django 到 Rust 的實測 → 延伸閱讀。
// 文字都在 content/case-studies/telepy.json（雙語），這裡只負責版面。
import Icon from '@/components/Icon'
import { BackLink, ProjectLinks, RelatedProjects } from '@/components/projects/ProjectPage'
import TelepyLogo from '@/components/projects/TelepyLogo'
import { ExternalLink } from '@/components/site/ui'
import Tapi from '@/components/tapi/Tapi'
import { useLanguage } from '@/contexts/LanguageContext'
import { telepyCase } from '@/data/content'
import { getProjectById } from '@/data/projects'
import { pick } from '@/lib/i18n/localize'

function Arrow({ label, direction = 'right' }: { label: string; direction?: 'right' | 'left' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 px-2 py-3 text-center lg:py-0">
      <span className="font-mono text-[11px] leading-tight text-muted">{label}</span>
      {/* 手機上垂直堆疊：往右的箭頭朝下、往左（隧道由裝置撥出）的朝上。 */}
      <span className={`text-accent-fill ${direction === 'left' ? '-rotate-90 lg:rotate-180' : 'rotate-90 lg:rotate-0'}`} aria-hidden="true">
        <Icon name="arrow" size={22} />
      </span>
    </div>
  )
}

export default function TelepyCaseStudy() {
  const { locale, t } = useLanguage()
  const project = getProjectById('telepy', locale)
  if (!project) return null
  const cs = telepyCase
  const arch = cs.architecture

  return (
    <div className="shell pt-10">
      <BackLink />

      <header className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="eyebrow">{t('telepy.eyebrow')}</p>
          <div className="mt-5 flex items-center gap-4">
            <TelepyLogo size={64} />
            <h1 className="font-display text-6xl font-bold tracking-tight md:text-7xl">{project.title}</h1>
          </div>
          <p className="mt-6 max-w-[28ch] font-display text-3xl font-medium leading-tight md:text-4xl">{pick(locale, cs.tagline)}</p>
          <p className="mt-5 max-w-prose text-lg text-muted">{project.description}</p>
          <div className="mt-8">
            <ProjectLinks project={project} />
          </div>
        </div>
        <div className="hidden lg:block">
          <Tapi pose="wave" size={130} label={t('home.flagship.tapi')} />
        </div>
      </header>

      <dl className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
        {cs.stats.map((stat) => (
          <div key={stat.value} className="rounded-2xl border border-line bg-surface px-5 py-4">
            <dt className="sr-only">{pick(locale, stat.label)}</dt>
            <dd>
              <span className="tabular block font-display text-3xl font-bold">{stat.value}</span>
              <span className="mt-1 block text-sm leading-snug text-muted" aria-hidden="true">
                {pick(locale, stat.label)}
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <figure className="mt-10 overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_80px_-40px_rgb(var(--plum)/0.5)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cs.banner} alt={t('home.flagship.shotAlt')} className="block w-full" />
      </figure>

      <section className="mt-24 grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]" aria-labelledby="why-title">
        <h2 id="why-title" className="section-title">
          {t('telepy.problem')}
        </h2>
        <div className="grid max-w-prose gap-5 text-lg leading-relaxed">
          {pick(locale, cs.problem).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="mt-24" aria-labelledby="arch-title">
        <h2 id="arch-title" className="section-title">
          {t('telepy.architecture')}
        </h2>
        <div className="mt-10 grid items-stretch gap-0 lg:grid-cols-[minmax(0,0.8fr)_auto_minmax(0,1.6fr)_auto_minmax(0,0.9fr)]">
          <div className="grid place-items-center rounded-2xl border border-line bg-surface p-6 text-center">
            <Icon name="globe" size={28} className="text-muted" />
            <p className="mt-3 font-display text-lg font-bold">{pick(locale, arch.browser)}</p>
          </div>
          <Arrow label="HTTPS" />
          <div className="rounded-2xl border-2 border-accent-fill/70 bg-accent-soft/40 p-5">
            <p className="flex items-center gap-2 font-display text-lg font-bold">
              <TelepyLogo size={22} /> {pick(locale, arch.server)}
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {arch.parts.map((part) => (
                <li key={part.name} className={`rounded-lg border border-line bg-surface px-3 py-2 ${part.name === 'Rust backend' ? 'sm:col-span-2' : ''}`}>
                  <span className="block font-mono text-sm font-semibold">{part.name}</span>
                  <span className="block text-xs text-muted">{pick(locale, part.note)}</span>
                </li>
              ))}
            </ul>
          </div>
          <Arrow label={pick(locale, arch.tunnel)} direction="left" />
          <div className="grid content-center gap-3 rounded-2xl border border-line bg-surface p-5 text-center">
            <p className="font-display text-lg font-bold">{pick(locale, arch.device)}</p>
            <p className="font-mono text-xs text-muted">ssh -R</p>
            <div className="rounded-lg border border-dashed border-line px-3 py-2 text-sm text-muted">{pick(locale, arch.lan)}</div>
          </div>
        </div>
        <p className="mt-6 max-w-prose text-muted">{t('telepy.architectureNote')}</p>
      </section>

      <section className="mt-24" aria-labelledby="features-title">
        <h2 id="features-title" className="section-title">
          {t('telepy.features')}
        </h2>
        <div className="mt-10 grid gap-16">
          {cs.featureGroups.map((group, index) => (
            <div key={group.image} className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <h3 className="font-display text-2xl font-bold">{pick(locale, group.title)}</h3>
                <ul className="mt-5 grid gap-3">
                  {group.items.map((item) => (
                    <li key={item.en} className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-3">
                      <span className="mt-[0.7em] h-1.5 w-1.5 rounded-full bg-accent-fill" aria-hidden="true" />
                      <span>{pick(locale, item)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <figure className="overflow-hidden rounded-2xl border border-line bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={group.image} alt={pick(locale, group.title)} loading="lazy" className="block w-full" />
              </figure>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-24" aria-labelledby="rewrite-title">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-prose">
            <h2 id="rewrite-title" className="section-title">
              {t('telepy.rewrite')}
            </h2>
            <p className="mt-4 text-lg text-muted">{pick(locale, cs.benchmark.intro)}</p>
          </div>
          <Tapi pose="happy" size={78} />
        </div>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-muted">
                  {t('telepy.metric')}
                </th>
                <th scope="col" className="px-5 py-3 text-right font-mono text-xs font-semibold uppercase tracking-wider text-muted">
                  {t('telepy.before')}
                </th>
                <th scope="col" className="px-5 py-3 text-right font-mono text-xs font-semibold uppercase tracking-wider text-muted">
                  {t('telepy.after')}
                </th>
                <th scope="col" className="px-5 py-3 text-right font-mono text-xs font-semibold uppercase tracking-wider text-muted">
                  {t('telepy.change')}
                </th>
              </tr>
            </thead>
            <tbody className="tabular">
              {cs.benchmark.rows.map((row) => (
                <tr key={row.metric.en} className="border-b border-line last:border-0">
                  <th scope="row" className="px-5 py-3 font-medium">
                    {pick(locale, row.metric)}
                  </th>
                  <td className="px-5 py-3 text-right font-mono text-muted">{row.before}</td>
                  <td className="px-5 py-3 text-right font-mono font-semibold">{row.after}</td>
                  <td className="px-5 py-3 text-right font-mono font-semibold text-clip">{row.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm">
          <ExternalLink href={cs.benchmark.source}>{t('telepy.source')}</ExternalLink>
        </p>
      </section>

      <section className="mt-24 grid gap-12 lg:grid-cols-2" aria-label={t('telepy.reading')}>
        <div>
          <h2 className="eyebrow">{t('telepy.stack')}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <li key={tech} className="chip">
                {tech}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="eyebrow">{t('telepy.reading')}</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {cs.reading.map((item) => (
              <li key={item.url}>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 py-3">
                  <span className="font-medium transition-colors group-hover:text-accent">{pick(locale, item.title)}</span>
                  <Icon name="external" size={16} className="shrink-0 text-muted" />
                  <span className="sr-only">({t('common.newTab')})</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-24 flex flex-col items-start justify-between gap-6 rounded-3xl border border-line bg-surface p-8 md:flex-row md:items-center md:p-10">
        <div className="flex items-center gap-5">
          <Tapi pose="idle" size={78} />
          <div>
            <p className="font-display text-2xl font-bold">{t('telepy.cta')}</p>
            <p className="mt-1 text-muted">{t('telepy.ctaNote')}</p>
          </div>
        </div>
        <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="btn-primary">
          <Icon name="github" size={16} /> GitHub
          <span className="sr-only">({t('common.newTab')})</span>
        </a>
      </section>

      <RelatedProjects project={project} />
    </div>
  )
}
