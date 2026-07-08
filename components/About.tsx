'use client'

import { useMemo, useState } from 'react'
import { getPersonalInfo, getYearsOfExperience } from '@/data/personal'
import { skillsData } from '@/data/skills'
import Image from 'next/image'
import Icon from './Icon'
import TerminalCommand from './TerminalCommand'
import CopyButton from './CopyButton'
import { useLanguage } from '@/contexts/LanguageContext'

export default function About() {
  const { locale, t } = useLanguage()
  const personalInfo = useMemo(() => getPersonalInfo(locale), [locale])
  const years = getYearsOfExperience()
  const [firstCommandComplete, setFirstCommandComplete] = useState(false)
  const [secondCommandComplete, setSecondCommandComplete] = useState(false)

  const getAsciiBar = (level: string): string => {
    const totalChars = 20
    let fill = 0
    switch (level) {
      case 'Expert': fill = 19; break
      case 'Advanced': fill = 16; break
      case 'Intermediate': fill = 12; break
      default: fill = 6
    }
    return `[${'#'.repeat(fill)}${'.'.repeat(totalChars - fill)}]`
  }

  return (
    <section id="about" className="min-h-screen pt-16 md:pt-20 pb-20 font-mono relative overflow-hidden pointer-events-none">
      <div className="relative z-10 container mx-auto px-2 md:px-4 max-w-6xl pointer-events-auto">
        <div className="border border-gray-700 rounded-lg overflow-hidden shadow-2xl bg-black/95 backdrop-blur-sm">
          <div className="w-full bg-[#1a1a1a] p-3 flex items-center gap-2 sticky top-0 z-20 border-b border-gray-800">
            <div className="flex gap-2 mr-4" aria-hidden="true">
              <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400" />
            </div>
            <div className="flex-1 text-center text-xs md:text-sm text-gray-500 font-bold select-none">
              {t('about.terminalTitle')}
            </div>
          </div>

          <div className="min-h-[80vh] p-6 md:p-12 text-gray-300">
            <TerminalCommand
              path="~/profile"
              command={t('about.neofetchCommand')}
              startDelay={300}
              typingSpeed={35}
              onComplete={() => setFirstCommandComplete(true)}
            >
              <div className="grid lg:grid-cols-12 gap-12 items-start mt-6">
                <div className="lg:col-span-4 text-center lg:text-left flex flex-col items-center lg:items-start">
                  <div className="relative w-48 h-48 md:w-64 md:h-64 group mb-8">
                    <div className="absolute inset-0 z-30 pointer-events-none bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.2)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] opacity-50 rounded-full" />
                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-gray-800 group-hover:border-secondary transition-colors">
                      <Image src={personalInfo.avatar} alt={personalInfo.displayName} fill className="object-cover relative z-10 transition-transform duration-200 group-hover:scale-105" />
                      <Image src={personalInfo.avatar} alt="" fill className="object-cover absolute inset-0 z-20 opacity-0 group-hover:opacity-60 mix-blend-screen translate-x-1 transition-opacity duration-100 pointer-events-none" />
                      <Image src={personalInfo.avatar} alt="" fill className="object-cover absolute inset-0 z-20 opacity-0 group-hover:opacity-60 mix-blend-multiply -translate-x-1 transition-opacity duration-100 pointer-events-none" />
                    </div>
                  </div>

                  <div className="w-full space-y-2 font-mono text-sm text-left bg-[#111] p-4 border border-gray-800 rounded">
                    <div className="flex gap-2"><span className="text-secondary font-bold">{t('about.os')}:</span> Linux x86_64</div>
                    <div className="flex gap-2"><span className="text-secondary font-bold">{t('about.host')}:</span> {personalInfo.displayName}</div>
                    <div className="flex gap-2"><span className="text-secondary font-bold">{t('about.kernel')}:</span> Software Engineer v6.0</div>
                    <div className="flex gap-2"><span className="text-secondary font-bold">{t('about.uptime')}:</span> {t('about.yearsExperience', { years })}</div>
                    <div className="flex gap-2"><span className="text-secondary font-bold">{t('about.shell')}:</span> zsh 5.9</div>
                    <div className="flex gap-2"><span className="text-secondary font-bold">{t('about.resolution')}:</span> 3840x2160</div>
                    <div className="flex gap-2"><span className="text-secondary font-bold">{t('about.cpu')}:</span> Neural Engine</div>
                    <div className="flex gap-2"><span className="text-secondary font-bold">{t('about.memory')}:</span> Full Stack</div>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <div className="border-l-2 border-gray-800 pl-6 ml-2 space-y-6 text-gray-400 leading-relaxed font-sans text-lg">
                    <p>{personalInfo.bio}</p>
                    <p>{t('about.bioParagraph1', { years })}</p>
                    <p>{t('about.bioParagraph2')}</p>
                  </div>

                  <div className="mt-8 space-y-6">
                    <div>
                      <h4 className="text-secondary font-bold mb-3 text-sm">{t('about.languages')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {personalInfo.languages.map((language) => (
                          <span key={language.name} className="text-xs bg-gray-900 border border-gray-800 px-3 py-1 rounded text-gray-400">
                            {language.name} ({language.level})
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-secondary font-bold mb-3 text-sm">{t('about.interests')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {personalInfo.interests.map((interest) => (
                          <span key={interest} className="text-xs bg-gray-900 border border-gray-800 px-3 py-1 rounded text-gray-400">
                            #{interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 mt-8">
                    {[
                      { label: t('about.email'), icon: 'mail', href: `mailto:${personalInfo.email}` },
                      { label: t('about.github'), icon: 'github', href: personalInfo.socialLinks.find((link) => link.name === 'GitHub')?.url || '#' },
                      { label: t('about.linkedin'), icon: 'linkedin', href: personalInfo.socialLinks.find((link) => link.name === 'LinkedIn')?.url || '#' },
                    ].map((item) => (
                      <div key={item.label} className="relative border border-gray-800 bg-[#0a0a0a] p-4 hover:border-secondary transition-colors group cursor-pointer text-center">
                        <a href={item.href} target={item.href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer" className="flex flex-col items-center gap-2">
                          <Icon name={item.icon} className="w-6 h-6 text-gray-500 group-hover:text-secondary" />
                          <span className="text-xs group-hover:text-white transition-colors">{item.label}</span>
                        </a>
                        {item.href.startsWith('mailto:') && (
                          <CopyButton value={personalInfo.email} label={t('common.copyEmail')} className="absolute top-1.5 right-1.5 text-xs" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TerminalCommand>

            {firstCommandComplete && (
              <div className="mt-12 animate-content-reveal">
                <TerminalCommand
                  path="~/skills"
                  command={t('about.skillsCommand')}
                  startDelay={200}
                  typingSpeed={40}
                  onComplete={() => setSecondCommandComplete(true)}
                >
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                    {skillsData.map((category) => (
                      <div key={category.id} className="mb-6">
                        <h4 className="text-secondary font-bold mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
                          ./{category.id}
                        </h4>
                        <div className="space-y-3 pl-2">
                          {category.skills.map((skill) => (
                            <div key={skill.name} className="group">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 group-hover:text-white transition-colors">{skill.name}</span>
                                <span className="text-gray-600 text-xs font-mono">{getAsciiBar(skill.level)}</span>
                              </div>
                              {skill.years && (
                                <div className="text-[10px] text-gray-600 mt-0.5">{skill.years}y • {skill.description}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TerminalCommand>
              </div>
            )}

            {secondCommandComplete && (
              <div className="mt-12 pt-6 border-t border-gray-800 animate-content-reveal">
                <div className="text-gray-600 text-xs flex justify-between items-center">
                  <span>{t('about.packages')}: {skillsData.flatMap((c) => c.skills).length}</span>
                </div>
                <div className="mt-4">
                  <span className="text-secondary font-bold">natlee@mainframe</span>
                  <span className="text-white">:</span>
                  <span className="text-blue-500">~/profile</span>
                  <span className="text-white">$ </span>
                  <span className="animate-pulse bg-secondary text-black px-1">_</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
