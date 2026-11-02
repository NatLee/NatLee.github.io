'use client'

// 履歷頁：工作（依集團分組）、學歷、技能（年資 + 用在哪些作品）、開源貢獻。
// 「列印或存成 PDF」用瀏覽器列印。列印版是一份精簡履歷：開頭換成姓名與聯絡方式，每個職位只留摘要與成果，
// 技能改成一類一行；顏色、頁首頁尾與分頁規則在 globals.css 的 @media print。
import Link from 'next/link'
import type { ReactNode } from 'react'
import Icon from '@/components/Icon'
import { ExternalLink } from '@/components/site/ui'
import { useLanguage } from '@/contexts/LanguageContext'
import { opensource } from '@/data/content'
import { getEducationData } from '@/data/education'
import { getExperienceData, type Experience } from '@/data/experience'
import { getPersonalInfo } from '@/data/personal'
import { getSkills, projectsUsingSkill } from '@/data/skills'
import { pick } from '@/lib/i18n/localize'

function Section({ id, title, children, intro }: { id: string; title: string; intro?: string; children: ReactNode }) {
  return (
    <section className="mt-16 border-t border-line pt-12 print:mt-4 print:pt-3" aria-labelledby={id}>
      <div className="grid gap-8 lg:grid-cols-[12rem_minmax(0,1fr)] print:block">
        <div>
          <h2 id={id} className="font-display text-2xl font-bold print:break-after-avoid print:text-[12pt] print:uppercase print:tracking-wider">
            {title}
          </h2>
          {intro && <p className="mt-2 text-sm text-muted print:hidden">{intro}</p>}
        </div>
        <div className="min-w-0 print:mt-2">{children}</div>
      </div>
    </section>
  )
}

function groupRoles(entries: Experience[]) {
  const groups: { name: string; roles: Experience[] }[] = []
  for (const entry of entries) {
    const name = entry.group ?? entry.company
    const existing = groups.find((group) => group.name === name)
    if (existing) existing.roles.push(entry)
    else groups.push({ name, roles: [entry] })
  }
  return groups
}

const roleTypeStyle: Record<string, string> = {
  promotion: 'bg-clip-soft text-clip',
  transfer: 'bg-accent-soft text-accent',
  join: 'bg-paper text-muted border border-line',
}

export default function ExperiencePage() {
  const { locale, t } = useLanguage()
  const me = getPersonalInfo(locale)
  const groups = groupRoles(getExperienceData(locale))
  const education = getEducationData(locale)
  const skills = getSkills(locale)
  const present = t('common.present')
  const period = (start: string, end: string) => `${start} – ${end === 'Present' ? present : end}`

  return (
    <div className="cv shell pt-14 md:pt-20 print:pt-0">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="print:hidden">
          <h1 className="font-display text-5xl font-bold tracking-tight md:text-6xl">{t('experience.title')}</h1>
          <p className="mt-4 max-w-[60ch] text-lg text-muted">{t('experience.intro')}</p>
        </div>
        {/* 列印版的開頭：履歷看的是人，不是頁面標題。 */}
        <div className="hidden print:block">
          <p className="font-display text-[22pt] font-bold leading-tight">
            {me.displayName} <span className="text-[13pt] font-medium text-muted">{me.name}</span>
          </p>
          <p className="mt-1 text-[10pt]">
            {me.title} · {me.location}
          </p>
          <p className="mt-0.5 font-mono text-[9pt] text-muted">
            {me.email} · natlee.github.io · {me.socialLinks.find((link) => link.icon === 'linkedin')?.url.replace(/^https?:\/\/(www\.)?/, '')}
          </p>
          <p className="mt-2 max-w-none text-[10pt]">{me.description}</p>
        </div>
        <button type="button" onClick={() => window.print()} className="btn-ghost no-print">
          <Icon name="print" size={16} /> {t('experience.print')}
        </button>
      </header>

      <Section id="work-title" title={t('experience.work')}>
        <ol className="grid gap-12 print:gap-4">
          {groups.map((group) => (
            // 公司這一層不能設「不可分頁」：HD Renewables 一組比一頁還長，會整組跳到下一頁、留下空白頁。
            <li key={group.name}>
              <h3 className="font-display text-xl font-bold print:break-after-avoid print:text-[11.5pt]">{group.name}</h3>
              <ol className="mt-5 grid gap-8 border-l-2 border-line pl-6 print:mt-1.5 print:gap-3 print:border-l print:pl-4">
                {group.roles.map((role) => (
                  <li key={role.id} className="relative print-avoid-break">
                    <span
                      className={`absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 ${role.end === 'Present' ? 'border-accent-fill bg-accent-fill' : 'border-line bg-paper'} print:-left-[21px]`}
                      aria-hidden="true"
                    />
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h4 className="font-display text-lg font-bold">{role.title}</h4>
                      {role.roleType && (
                        <span className={`rounded-md px-2 py-0.5 font-mono text-[11px] ${roleTypeStyle[role.roleType] ?? ''}`}>
                          {t(`experience.roleType.${role.roleType}`)}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 flex flex-wrap gap-x-3 font-mono text-xs text-muted">
                      <span className="tabular">{period(role.start, role.end)}</span>
                      <span>{role.company !== group.name ? role.company : null}</span>
                      <span>{role.location}</span>
                    </p>
                    {role.parentCompany && role.company !== group.name && (
                      <p className="mt-1 text-xs text-muted">{t('experience.subsidiary', { parent: role.parentCompany })}</p>
                    )}
                    {role.assignment && (
                      <p className="mt-2 inline-flex items-center gap-2 rounded-md bg-clip-soft px-2.5 py-1 text-xs text-clip">
                        <Icon name="globe" size={13} />
                        {t('experience.assignment', { location: role.assignment.location })} · <span className="tabular">{period(role.assignment.start, role.assignment.end)}</span>
                      </p>
                    )}
                    <p className="mt-3 max-w-prose print:mt-1 print:max-w-none">{role.summary}</p>
                    {/* 列印版不印職責清單：摘要已經講過一次，只留成果，篇幅少一半。 */}
                    {role.responsibilities.length > 0 && (
                      <ul className="mt-3 grid max-w-prose gap-1.5 text-sm text-muted print:hidden">
                        {role.responsibilities.map((item) => (
                          <li key={item} className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-2">
                            <span className="mt-[0.65em] h-1 w-1 rounded-full bg-muted" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {role.achievements && role.achievements.length > 0 && (
                      <div className="mt-3 max-w-prose print:mt-1 print:max-w-none">
                        <p className="eyebrow print:hidden">{t('experience.achievements')}</p>
                        <ul className="mt-1.5 grid gap-1.5 text-sm print:mt-0.5 print:gap-0.5">
                          {role.achievements.map((item) => (
                            <li key={item} className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-2">
                              <span className="mt-[0.6em] h-1.5 w-1.5 rounded-full bg-accent-fill" aria-hidden="true" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {role.techStack.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-1.5 print:hidden">
                        {role.techStack.map((tech) => (
                          <li key={tech} className="chip">
                            {tech}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="education-title" title={t('experience.education')}>
        <ul className="grid gap-4 sm:grid-cols-2">
          {education.map((entry) => (
            <li key={entry.id} className="rounded-2xl border border-line bg-surface p-5 print-avoid-break print:border-0 print:p-0">
              <p className="tabular font-mono text-xs text-muted">
                {entry.startYear} – {entry.endYear}
              </p>
              <p className="mt-2 font-display text-lg font-bold">{locale === 'zh-TW' ? entry.school : entry.schoolEn}</p>
              <p className="mt-1 text-sm">
                {entry.degree} · {entry.major}
              </p>
              {entry.minor && <p className="mt-1 text-sm text-muted">{t('experience.minor', { minor: entry.minor })}</p>}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="skills-title" title={t('experience.skills')} intro={t('experience.skillsIntro')}>
        {/* 列印版：一類一行，「技術（年資）」。 */}
        <dl className="hidden gap-1 text-[10pt] print:grid">
          {skills.map((category) => (
            <div key={category.id} className="grid grid-cols-[10rem_minmax(0,1fr)] gap-3">
              <dt className="font-semibold">{category.name}</dt>
              <dd>
                {category.skills
                  .map((skill) => (skill.years ? `${skill.name} (${t('experience.years', { count: skill.years })})` : skill.name))
                  .join(', ')}
              </dd>
            </div>
          ))}
        </dl>
        <div className="grid gap-8 print:hidden">
          {skills.map((category) => (
            <div key={category.id}>
              <h3 className="eyebrow">{category.name}</h3>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                  <thead className="sr-only">
                    <tr>
                      <th scope="col">{t('experience.skill')}</th>
                      <th scope="col">{t('experience.experienceCol')}</th>
                      <th scope="col">{t('experience.notes')}</th>
                      <th scope="col">{t('experience.usedIn')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.skills.map((skill) => {
                      const used = projectsUsingSkill(skill.name)
                      return (
                        <tr key={skill.name} className="border-b border-line align-top last:border-0">
                          <th scope="row" className="w-40 py-2.5 pr-4 font-semibold">
                            {skill.name}
                          </th>
                          <td className="tabular w-20 whitespace-nowrap py-2.5 pr-4 font-mono text-xs text-muted">
                            {skill.years ? t('experience.years', { count: skill.years }) : '—'}
                          </td>
                          <td className="py-2.5 pr-4 text-muted">{skill.description}</td>
                          <td className="w-56 py-2.5 text-xs print:hidden">
                            {used.length > 0 && (
                              <span className="flex flex-wrap gap-x-2 gap-y-1">
                                {used.map((project) => (
                                  <Link key={project.id} href={`/projects/${project.id}/`} className="link">
                                    {project.title}
                                  </Link>
                                ))}
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="upstream-title" title={t('experience.upstream')}>
        <ul className="grid gap-3">
          {opensource.upstream.map((item) => (
            <li key={item.repo} className="grid gap-1 sm:grid-cols-[14rem_minmax(0,1fr)]">
              <ExternalLink href={item.url} className="font-mono text-sm font-semibold text-ink hover:text-accent">
                {item.repo}
              </ExternalLink>
              <span className="text-sm text-muted">{pick(locale, item.summary)}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}
