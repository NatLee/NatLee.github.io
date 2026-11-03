'use client'

// 列印版履歷：/experience 按「列印或存成 PDF」印出來的就是這一份；螢幕上不顯示，螢幕版則整塊 print:hidden。
// 兩邊各自排版。紙本是一份精簡履歷：職稱靠左、日期靠右，地點提到公司那一行（同公司各職位相同就不重複），
// 每個職位只留摘要與成果，技能一類一行。風格沿用網站：梅褐墨色、柿橘重點、青綠標晉升與外派，開頭放 N 字標。
// 頁面邊距、頁碼、強制印出底色與分頁規則在 globals.css 的 @media print。
import { useEffect, type ReactNode } from 'react'
import Icon from '@/components/Icon'
import { useLanguage } from '@/contexts/LanguageContext'
import { opensource } from '@/data/content'
import { getEducationData } from '@/data/education'
import { getExperienceData, groupRoles, type Experience } from '@/data/experience'
import { getPersonalInfo } from '@/data/personal'
import { getSkills } from '@/data/skills'
import { pick } from '@/lib/i18n/localize'

const badgeTone: Record<string, string> = {
  promotion: 'bg-clip-soft text-clip',
  transfer: 'bg-accent-soft text-accent',
  join: 'border-[0.5pt] border-line text-muted',
}

const bareUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-[5.5mm]">
      <h2 className="cv-keep-next flex items-center gap-[2.5mm] text-[9pt] font-bold uppercase tracking-[0.05em]">
        <span className="h-[1.8mm] w-[1.8mm] shrink-0 rounded-[0.3mm] bg-accent-fill" aria-hidden="true" />
        {title}
        <span className="flex-1 border-t-[0.5pt] border-line" aria-hidden="true" />
      </h2>
      <div className="mt-[2.8mm]">{children}</div>
    </section>
  )
}

/** 一組角色的整段期間：最早的開始到最晚的結束（任何一個還在職就是「至今」）。日期格式 YYYY.MM 可以直接字串排序。 */
function groupSpan(roles: Experience[]) {
  const start = roles.map((role) => role.start).sort()[0]
  const end = roles.some((role) => role.end === 'Present') ? 'Present' : roles.map((role) => role.end).sort().at(-1)!
  return { start, end }
}

export default function PrintCV() {
  const { locale, t } = useLanguage()
  const me = getPersonalInfo(locale)
  const groups = groupRoles(getExperienceData(locale))
  const education = getEducationData(locale)
  const skills = getSkills(locale)
  const present = t('common.present')
  const period = (start: string, end: string) => `${start} – ${end === 'Present' ? present : end}`
  const cvTitle = t('experience.cvTitle', { name: me.displayName })

  // 存成 PDF 時瀏覽器拿 document.title 當檔名：列印期間換成「Nat Lee — CV」，印完換回來。
  useEffect(() => {
    let previous = document.title
    const before = () => {
      previous = document.title
      document.title = cvTitle
    }
    const after = () => {
      document.title = previous
    }
    window.addEventListener('beforeprint', before)
    window.addEventListener('afterprint', after)
    return () => {
      window.removeEventListener('beforeprint', before)
      window.removeEventListener('afterprint', after)
    }
  }, [cvTitle])

  const social = (icon: string) => me.socialLinks.find((link) => link.icon === icon)?.url
  const contacts = [
    { icon: 'email', href: `mailto:${me.email}`, label: me.email },
    { icon: 'globe', href: 'https://natlee.github.io/', label: 'natlee.github.io' },
    ...(['linkedin', 'github'] as const).flatMap((icon) => {
      const url = social(icon)
      return url ? [{ icon, href: url, label: bareUrl(url) }] : []
    }),
  ]

  return (
    <article className="cv-print hidden print:block" aria-label={cvTitle}>
      <header className="cv-keep">
        <div className="flex items-center justify-between gap-[8mm]">
          <div className="flex items-center gap-[4mm]">
            {/* eslint-disable-next-line @next/next/no-img-element -- 靜態輸出，favicon.svg 就是 N 字標原稿 */}
            <img src="/favicon.svg" alt="" width={46} height={46} className="h-[12.5mm] w-[12.5mm]" />
            <div>
              <p className="flex flex-wrap items-baseline gap-x-[2.5mm]">
                <span className="font-display text-[24pt] font-bold leading-none tracking-[-0.02em]">{me.displayName}</span>
                <span className="font-display text-[11pt] font-medium text-muted">{me.name}</span>
              </p>
              <p className="mt-[2mm] text-[10pt] leading-none">
                <span className="font-semibold text-accent">{me.title}</span>
                <span className="text-muted"> · {me.location}</span>
              </p>
            </div>
          </div>
          <ul className="grid shrink-0 gap-[0.9mm] text-right font-mono text-[7.5pt] leading-tight">
            {contacts.map((contact) => (
              <li key={contact.href}>
                <a href={contact.href} className="inline-flex items-center gap-[1.6mm]">
                  {contact.label}
                  <Icon name={contact.icon} size={10} className="text-accent" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        {/* 灰色細線上一小段柿橘色：跟網站的 eyebrow 底線同一個手勢。 */}
        <div className="relative mt-[4.5mm] border-t-[0.75pt] border-line" aria-hidden="true">
          <span className="absolute -top-[1.5pt] left-0 w-[22mm] border-t-[2.25pt] border-accent-fill" />
        </div>
        <p className="mt-[3mm] text-[9.5pt] text-muted">{me.description}</p>
      </header>

      <Section title={t('experience.work')}>
        <ol className="space-y-[3.8mm]">
          {groups.map((group) => {
            const home = group.roles[0].location
            const span = groupSpan(group.roles)
            return (
              // 公司這一層可以跨頁（HD Renewables 一組比一頁長）；不跨頁的是單一職位。
              <li key={group.name}>
                <div className="cv-keep-next flex items-baseline justify-between gap-[4mm]">
                  <h3 className="text-[11pt] font-bold">{group.name}</h3>
                  <p className="shrink-0 text-[8pt] text-muted">
                    {group.roles.length > 1 && (
                      <>
                        <span className="tabular font-mono text-[7.5pt]">{period(span.start, span.end)}</span>
                        {' · '}
                      </>
                    )}
                    {home}
                  </p>
                </div>
                {/* 內縮 2mm：圓點有一半在線的左邊，超出頁面內容區的部分 Chrome 會直接裁掉。 */}
                <ol className="ml-[2mm] mt-[1.6mm]">
                  {group.roles.map((role) => {
                    const meta = [role.company !== group.name ? role.company : null, role.location !== home ? role.location : null].filter(Boolean)
                    return (
                      <li key={role.id} className="cv-keep relative border-l-[0.75pt] border-line pb-[2.8mm] pl-[4.5mm] last:pb-0">
                        <span className={`cv-dot${role.end === 'Present' ? ' cv-dot-now' : ''}`} aria-hidden="true" />
                        <div className="flex items-baseline justify-between gap-[4mm]">
                          <h4 className="flex flex-wrap items-baseline gap-x-[2mm] text-[10pt] font-bold leading-snug">
                            {role.title}
                            {role.roleType && (
                              <span
                                className={`rounded-[0.6mm] px-[1.3mm] py-[0.25mm] font-mono text-[6.5pt] font-normal uppercase leading-none tracking-[0.06em] ${badgeTone[role.roleType] ?? ''}`}
                              >
                                {t(`experience.roleType.${role.roleType}`)}
                              </span>
                            )}
                          </h4>
                          <span className={`tabular shrink-0 font-mono text-[7.5pt] ${role.end === 'Present' ? 'text-accent' : 'text-muted'}`}>
                            {period(role.start, role.end)}
                          </span>
                        </div>
                        {(meta.length > 0 || role.assignment) && (
                          <p className="text-[8pt] text-muted">
                            {meta.join(' · ')}
                            {role.assignment && (
                              <span className="text-clip">
                                {meta.length > 0 && <span className="text-muted"> · </span>}
                                <Icon name="globe" size={9} className="mr-[0.8mm] inline-block align-[-1px]" />
                                {t('experience.assignment', { location: role.assignment.location })} ·{' '}
                                <span className="tabular font-mono text-[7.5pt]">{period(role.assignment.start, role.assignment.end)}</span>
                              </span>
                            )}
                          </p>
                        )}
                        <p className="mt-[0.7mm]">{role.summary}</p>
                        {role.achievements && role.achievements.length > 0 && (
                          <ul className="mt-[0.9mm] space-y-[0.4mm]">
                            {role.achievements.map((item) => (
                              <li key={item} className="relative pl-[3.2mm]">
                                <span className="absolute left-[0.3mm] top-[0.5em] h-[1.1mm] w-[1.1mm] rounded-full bg-accent-fill" aria-hidden="true" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ol>
              </li>
            )
          })}
        </ol>
      </Section>

      <Section title={t('experience.education')}>
        <ul className="space-y-[2mm]">
          {education.map((entry) => (
            <li key={entry.id} className="cv-keep">
              <div className="flex items-baseline justify-between gap-[4mm]">
                <p className="text-[9.5pt] font-bold">{locale === 'zh-TW' ? entry.school : entry.schoolEn}</p>
                <span className="tabular shrink-0 font-mono text-[7.5pt] text-muted">
                  {entry.startYear} – {entry.endYear}
                </span>
              </div>
              <p className="text-[8.5pt]">
                {entry.degree} · {entry.major}
                {entry.minor && <span className="text-muted"> · {t('experience.minor', { minor: entry.minor })}</span>}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t('experience.skills')}>
        <dl className="space-y-[1mm] text-[8.5pt]">
          {skills.map((category) => (
            <div key={category.id} className="cv-keep grid grid-cols-[38mm_minmax(0,1fr)] gap-x-[3mm]">
              <dt className="font-semibold">{category.name}</dt>
              <dd>
                {category.skills.map((skill, index) => (
                  <span key={skill.name}>
                    {index > 0 && <span className="text-muted"> · </span>}
                    {skill.name}
                    {skill.years ? <span className="text-muted"> {t('experience.years', { count: skill.years })}</span> : null}
                  </span>
                ))}
              </dd>
            </div>
          ))}
          <div className="cv-keep grid grid-cols-[38mm_minmax(0,1fr)] gap-x-[3mm]">
            <dt className="font-semibold">{t('experience.languages')}</dt>
            <dd>
              {me.languages.map((language, index) => (
                <span key={language.name}>
                  {index > 0 && <span className="text-muted"> · </span>}
                  {language.name}
                  <span className="text-muted"> {language.level}</span>
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </Section>

      <Section title={t('experience.upstream')}>
        <ul className="space-y-[1mm] text-[8.5pt]">
          {opensource.upstream.map((item) => (
            <li key={item.repo} className="cv-keep grid grid-cols-[52mm_minmax(0,1fr)] gap-x-[3mm]">
              <a href={item.url} className="font-mono text-[7.8pt] font-semibold">
                {item.repo}
              </a>
              <span className="text-muted">{pick(locale, item.summary)}</span>
            </li>
          ))}
        </ul>
      </Section>
    </article>
  )
}
