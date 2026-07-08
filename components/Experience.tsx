'use client'

import React, { useMemo, useState } from 'react'
import { getExperienceData } from '@/data/experience'
import { getEducationData } from '@/data/education'
import TerminalCommand from './TerminalCommand'
import { useLanguage } from '@/contexts/LanguageContext'

function getGroupedExperience(experienceData: ReturnType<typeof getExperienceData>) {
  const grouped: { company: string; items: ReturnType<typeof getExperienceData> }[] = []
  experienceData.forEach((exp) => {
    const existingGroup = grouped.find((g) => g.company === exp.company)
    if (existingGroup) existingGroup.items.push(exp)
    else grouped.push({ company: exp.company, items: [exp] })
  })
  return grouped
}

const ROLE_TRANSITION: Record<'join' | 'promotion' | 'transfer', { icon: string; className: string }> = {
  promotion: { icon: '▲', className: 'text-green-400 border-green-500/40 bg-green-500/10' },
  transfer: { icon: '⇄', className: 'text-blue-400 border-blue-500/40 bg-blue-500/10' },
  join: { icon: '●', className: 'text-gray-400 border-gray-600/40 bg-gray-500/10' },
}

export default function Experience() {
  const { locale, t } = useLanguage()
  const experienceData = useMemo(() => getExperienceData(locale), [locale])
  const educationData = useMemo(() => getEducationData(locale), [locale])
  const groupedData = useMemo(() => getGroupedExperience(experienceData), [experienceData])
  // Expand the current employer and the previous one so the recent career
  // progression (incl. the HD Renewables promotions) is visible without a click.
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    [groupedData[0]?.company, groupedData[1]?.company].filter((c): c is string => Boolean(c))
  )
  const [commandComplete, setCommandComplete] = useState(false)

  const toggleGroup = (company: string) => {
    setExpandedGroups((prev) =>
      prev.includes(company) ? prev.filter((c) => c !== company) : [...prev, company]
    )
  }

  // The data uses the sentinel "Present" for ongoing roles; localize it.
  const displayEnd = (end: string) => (end === 'Present' ? t('common.present') : end)

  return (
    <section id="experience" className="min-h-screen pt-16 md:pt-20 pb-20 font-mono relative overflow-hidden pointer-events-none">
      <div className="relative z-10 container mx-auto px-2 md:px-4 max-w-7xl pointer-events-auto">
        <div className="border border-gray-700 rounded-lg overflow-hidden shadow-2xl bg-black/95 backdrop-blur-sm">
          <div className="w-full bg-[#1a1a1a] p-3 flex items-center gap-2 sticky top-0 z-20 border-b border-gray-800">
            <div className="flex gap-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400" />
            </div>
            <div className="flex-1 text-center text-xs md:text-sm text-gray-500 font-bold select-none">
              {t('experience.terminalTitle')}
            </div>
          </div>

          <div className="min-h-[80vh] p-6 md:p-12 text-gray-300">
            <TerminalCommand
              path="~/experience"
              command={t('experience.command')}
              startDelay={300}
              typingSpeed={40}
              onComplete={() => setCommandComplete(true)}
              className="mb-12 border-b border-gray-900 pb-8 pt-2"
            >
              <div className="mb-8 p-4 bg-gray-900/50 border-l-4 border-secondary text-gray-400 text-xs md:text-sm mt-6">
                <span className="text-secondary font-bold">natlee@mainframe</span>: <span className="text-blue-400">~/var/log/career.log</span>
                <br />
                <span>{t('experience.totalGroups', { count: groupedData.length })}</span>
                <span className="animate-pulse">_</span>
              </div>

              <div className="space-y-6">
                {groupedData.map((group) => {
                  const isExpanded = expandedGroups.includes(group.company)
                  return (
                    <div key={group.company} className="border border-gray-800 bg-[#0a0a0a] rounded overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.company)}
                        aria-expanded={isExpanded}
                        className={`w-full cursor-pointer p-4 flex items-center justify-between transition-colors ${
                          isExpanded ? 'bg-gray-900 border-b border-gray-800' : 'hover:bg-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-3 md:gap-4 text-sm md:text-base min-w-0">
                          <span className={`text-xl transition-transform flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
                          <span className="flex flex-col items-start text-left min-w-0">
                            <span className={`font-bold truncate max-w-full ${isExpanded ? 'text-secondary' : 'text-gray-400'}`}>{group.company}</span>
                            {group.items[0]?.parentCompany && (
                              <span className="text-[10px] text-gray-500 font-normal normal-case tracking-normal truncate max-w-full">
                                {t('experience.subsidiaryOf', { parent: group.items[0].parentCompany })}
                              </span>
                            )}
                          </span>
                          <span className="text-gray-600 text-xs ml-1 md:ml-2 border border-gray-800 px-2 py-0.5 rounded whitespace-nowrap flex-shrink-0">
                            {group.items.length} {group.items.length > 1 ? t('experience.rolesPlural') : t('experience.roles')}
                          </span>
                        </div>
                        <div className="hidden md:block text-xs text-gray-500">
                          {t('experience.latestUpdate', { date: displayEnd(group.items[0].end) })}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="p-0">
                          {group.items.map((exp) => (
                            <div key={exp.id} className="relative pl-8 md:pl-12 py-8 pr-4 group transition-colors hover:bg-white/5">
                              {group.items.length > 1 && <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-gray-800" />}
                              <div className={`absolute left-[13px] md:left-[21px] top-10 w-2 h-2 rounded-full z-10 ${exp.end === 'Present' ? 'bg-green-500 ring-4 ring-green-900/30' : 'bg-gray-600'}`} />
                              <div className="flex flex-col md:flex-row md:items-start gap-4 mb-4">
                                <div className="w-48 flex-shrink-0 text-xs text-gray-500 font-mono pt-1">[{exp.start} -- {displayEnd(exp.end)}]</div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 md:gap-3 flex-wrap mb-1">
                                    <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                                    {exp.roleType && (
                                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${ROLE_TRANSITION[exp.roleType].className}`}>
                                        <span aria-hidden="true" className="mr-1">{ROLE_TRANSITION[exp.roleType].icon}</span>
                                        {t(`experience.transition.${exp.roleType}` as 'experience.transition.promotion')}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-orange-300 text-sm mb-2">@ {exp.location}</div>
                                  {exp.department && (
                                    <div className="text-gray-500 text-xs mb-4">
                                      {t('experience.department')}: {exp.department}
                                    </div>
                                  )}
                                  <div className="border-l-2 border-gray-800 pl-4 space-y-4">
                                    <div>
                                      <span className="text-gray-500 text-xs block mb-1">{t('experience.logSummary')}</span>
                                      <p className="text-gray-300 leading-relaxed max-w-3xl">{exp.summary}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-500 text-xs block mb-1">{t('experience.responsibilities')}</span>
                                      <ul className="space-y-1">
                                        {exp.responsibilities.map((resp, i) => (
                                          <li key={i} className="flex gap-2 items-start text-sm text-gray-400">
                                            <span className="text-secondary mt-1">➜</span>
                                            <span>{resp}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    {exp.achievements && exp.achievements.length > 0 && (
                                      <div>
                                        <span className="text-gray-500 text-xs block mb-1">{t('experience.achievements')}</span>
                                        <ul className="space-y-1">
                                          {exp.achievements.map((ach, i) => (
                                            <li key={i} className="flex gap-2 items-start text-sm text-green-400/90">
                                              <span className="text-green-500 font-bold mt-1">+</span>
                                              <span>{ach}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    <div className="pt-2 flex flex-wrap gap-2">
                                      {exp.techStack.map((tech) => (
                                        <span key={tech} className="bg-gray-900 border border-gray-700 text-gray-400 text-xs px-2 py-1 rounded hover:border-secondary hover:text-secondary transition-colors">
                                          #{tech}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="mt-20">
                <div className="mb-8 p-4 bg-gray-900/50 border-l-4 border-blue-500 text-gray-400 text-xs md:text-sm">
                  <span className="text-blue-500 font-bold">natlee@mainframe</span>: <span className="text-green-400">{t('experience.educationPath')}</span>
                  <br />
                  <span>{t('experience.loadedModules', { count: educationData.length })}</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {educationData.map((edu) => (
                    <div key={edu.id} className="border border-gray-800 bg-[#0a0a0a] p-6 rounded relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                      <div className="absolute top-0 right-0 bg-gray-900 border-b border-l border-gray-800 px-3 py-1 text-xs text-blue-400 font-bold">
                        {edu.startYear} - {edu.endYear}
                      </div>
                      <div className="mb-4">
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">{t('experience.module')}</div>
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{edu.schoolEn}</h3>
                        <div className="text-sm text-gray-400 mt-1">{t('experience.degreeInMajor', { degree: edu.degree, major: edu.major })}</div>
                        {edu.minor && <div className="text-xs text-gray-500 mt-1">{t('experience.minor')}: {edu.minor}</div>}
                      </div>
                      <div className="border-t border-gray-800 pt-4 mt-4">
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">{t('experience.dependencies')}</div>
                        <div className="flex flex-wrap gap-2">
                          {(edu.degree.includes('Master') || edu.degree.includes('碩士')
                            ? ['Computer Vision', 'Deep Learning', 'Cloud Computing']
                            : ['Algorithms', 'Data Structures', 'OS', 'Networks']
                          ).map((course) => (
                            <span key={course} className="text-xs bg-gray-900 px-2 py-1 rounded text-gray-400 border border-gray-800">{course}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-gray-600 text-center text-xs mt-12 mb-8">{t('experience.endOfLog')}</div>
            </TerminalCommand>

            {commandComplete && (
              <div className="mt-12 pt-6 border-t border-gray-800 text-gray-600 text-xs text-center flex justify-between items-center px-4 animate-content-reveal">
                <span>{t('experience.totalEntries', { count: experienceData.length + educationData.length })}</span>
                <span className="animate-pulse">_</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
