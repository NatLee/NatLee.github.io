'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getAllCategories, getLocalizedProjects, localizeCategory } from '@/data/projects'
import TerminalCommand from './TerminalCommand'
import { useLanguage } from '@/contexts/LanguageContext'

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function getStableSize(id: string): string {
  return `${(hashString(id) % 900) + 100}KB`
}

function getCategoryEmoji(category: string): string {
  const c = category.toLowerCase()
  if (c.includes('web')) return '🌐'
  if (c.includes('vision') || c.includes('ai') || c.includes('ml') || c.includes('learning')) return '🧠'
  if (c.includes('medical')) return '🩺'
  if (c.includes('image')) return '🖼️'
  if (c.includes('data collection')) return '🕸️'
  if (c.includes('data')) return '📊'
  if (c.includes('devops')) return '⚙️'
  if (c.includes('api') || c.includes('sdk')) return '🔌'
  if (c.includes('extension')) return '🧩'
  if (c.includes('automation')) return '🤖'
  if (c.includes('backend')) return '🖥️'
  if (c.includes('tool') || c.includes('utilit') || c.includes('productivity')) return '🛠️'
  return '📁'
}

function getStableDate(id: string): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const hash = hashString(id)
  const day = String((hash % 28) + 1).padStart(2, '0')
  const hour = String(hash % 24).padStart(2, '0')
  const minute = String(hash % 60).padStart(2, '0')
  return `${months[hash % 12]} ${day} ${hour}:${minute}`
}

export default function ProjectsGrid() {
  const { locale, t } = useLanguage()
  const allProjects = useMemo(() => getLocalizedProjects(locale), [locale])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [commandComplete, setCommandComplete] = useState(false)
  const [isExplorerOpen, setIsExplorerOpen] = useState(false)
  // The explorer panel is a mobile-only collapsible; at the `lg` breakpoint it is
  // always visible, so aria-expanded must report open there regardless of state.
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)')
    const update = () => setIsDesktop(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  const categories = ['All', ...getAllCategories()]

  const filteredProjects = allProjects.filter((project) => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory
    const term = searchTerm.toLowerCase().trim()
    const matchesSearch =
      term === '' ||
      project.title.toLowerCase().includes(term) ||
      project.description.toLowerCase().includes(term) ||
      project.category.toLowerCase().includes(term) ||
      (project.technologies?.some((tech) => tech.toLowerCase().includes(term)) ?? false)
    return matchesCategory && matchesSearch
  })

  const totalProjects = allProjects.length
  const hiddenCount = totalProjects - filteredProjects.length
  const yearValues = allProjects
    .map((project) => {
      const startYear = project.timeline?.start
      if (!startYear || startYear === 'Present') return undefined
      const match = startYear.match(/^\d{4}/)
      return match ? parseInt(match[0]) : undefined
    })
    .filter((year): year is number => typeof year === 'number')
    .sort((a, b) => a - b)
  const yearRange = yearValues.length > 0 ? `${yearValues[0]}–${yearValues[yearValues.length - 1]}` : 'N/A'
  const topCategory = (() => {
    const counts: Record<string, number> = {}
    allProjects.forEach((p) => {
      if (!p.category) return
      counts[p.category] = (counts[p.category] || 0) + 1
    })
    const entries = Object.entries(counts)
    if (!entries.length) return 'N/A'
    return entries.sort((a, b) => b[1] - a[1])[0][0]
  })()

  return (
    <section id="projects" className="min-h-screen pt-16 md:pt-20 pb-20 font-mono relative overflow-hidden pointer-events-none">
      <div className="relative z-10 container mx-auto px-2 md:px-4 max-w-[1400px] pointer-events-auto">
        <div className="border border-gray-700 rounded-lg overflow-hidden shadow-2xl bg-black/95 backdrop-blur-sm">
          <div className="w-full bg-[#1a1a1a] sticky top-0 z-20 border-b border-gray-800">
            <div className="p-3 flex items-center gap-2">
              <div className="flex gap-2 mr-4" aria-hidden="true">
                <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400" />
              </div>
              <div className="flex-1 text-center text-xs md:text-sm text-gray-500 font-bold select-none">
                <span className="hidden sm:inline">natlee@mainframe: </span>
                <span className="text-secondary">~/projects</span>
              </div>
            </div>
            <div className="flex items-end px-2 gap-1 bg-[#111]">
              <Link href="/" className="group flex items-center gap-1.5 px-3 py-2 text-xs font-mono bg-[#1a1a1a] text-gray-600 hover:text-gray-300 border-t border-x border-gray-800 rounded-t transition-colors" title="Go to Home">
                <span className="group-hover:text-secondary">~</span>
              </Link>
              <div className="flex items-center gap-2 px-4 py-2 text-xs font-mono bg-black/60 text-secondary border-t border-x border-secondary/30 rounded-t font-bold">
                <span>📁</span>
                <span>projects/</span>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-1" />
              </div>
            </div>
          </div>

          <div className="min-h-[80vh] p-4 md:p-8 lg:p-12 text-gray-300">
            <TerminalCommand path="~/projects" command={t('projects.command')} startDelay={300} typingSpeed={35} onComplete={() => setCommandComplete(true)} className="mb-12 border-b border-gray-900 pb-8 pt-2">
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mt-6">
                <aside className="w-full lg:w-64 flex-shrink-0 bg-[#0a0a0a] border border-gray-800 rounded-lg flex flex-col lg:h-fit lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)]">
                  <button
                    type="button"
                    onClick={() => setIsExplorerOpen(!isExplorerOpen)}
                    aria-expanded={isDesktop || isExplorerOpen}
                    aria-controls="projects-explorer-panel"
                    className="w-full flex items-center justify-between p-3 lg:p-4 text-xs text-gray-500 font-bold uppercase tracking-wider border-b border-gray-800 lg:cursor-default"
                  >
                    <div className="flex items-center gap-2">
                      <span className="lg:hidden">{isExplorerOpen ? '▼' : '▶'}</span>
                      <span>{t('projects.explorer')}</span>
                      {selectedCategory !== 'All' && <span className="text-secondary normal-case font-normal">({localizeCategory(selectedCategory, locale)})</span>}
                    </div>
                    <span className="text-gray-600 lg:hidden">{categories.length - 1} {t('projects.categories')}</span>
                  </button>

                  <div id="projects-explorer-panel" className={`overflow-hidden transition-all duration-300 lg:!max-h-none ${isExplorerOpen ? 'max-h-[500px]' : 'max-h-0 lg:max-h-none'}`}>
                    <div className="p-3 lg:p-4 pt-2">
                      <div className="overflow-y-auto custom-scrollbar pr-2 space-y-1 max-h-[300px] lg:max-h-none">
                        <button
                          type="button"
                          onClick={() => { setSelectedCategory('All'); setIsExplorerOpen(false) }}
                          className={`w-full text-left cursor-pointer px-2 py-1.5 rounded flex items-center gap-2 transition-colors ${selectedCategory === 'All' ? 'bg-secondary/10 text-secondary' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
                        >
                          <span className="opacity-70">📂</span>
                          <span className="font-bold">/ {t('projects.all')}</span>
                        </button>
                        {categories.filter((c) => c !== 'All').map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => { setSelectedCategory(category); setIsExplorerOpen(false) }}
                            className={`w-full text-left cursor-pointer px-2 py-1.5 rounded flex items-center gap-2 transition-colors ml-2 lg:ml-4 border-l border-gray-800 ${selectedCategory === category ? 'bg-secondary/10 text-secondary' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
                          >
                            <span className="opacity-70 text-xs hidden lg:inline">drwxr-xr-x</span>
                            <span className="opacity-70 lg:hidden">📁</span>
                            <span className="truncate text-xs lg:text-sm">{localizeCategory(category, locale)}</span>
                          </button>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-800 text-xs text-gray-600 hidden lg:block">
                        <div>{totalProjects} {t('projects.items')}</div>
                        <div>{hiddenCount} {t('projects.hidden')}</div>
                        <div className="mt-2 text-[10px] opacity-50">{t('projects.freeSpace')}</div>
                      </div>
                    </div>
                  </div>
                </aside>

                <div className="flex-1 min-w-0">
                  <div className="mb-2 flex flex-col gap-4 justify-between items-stretch bg-[#0a0a0a] border border-gray-800 p-3 md:p-4 rounded-lg">
                    <div className="flex items-center text-gray-400 text-xs md:text-sm overflow-x-auto no-scrollbar">
                      <span className="text-green-500 font-bold shrink-0">natlee</span>
                      <span className="text-white mx-1 shrink-0">:</span>
                      <span className="text-blue-400 shrink-0">~</span>
                      <span className="text-gray-600 mx-1 md:mx-2 shrink-0">$</span>
                      <span className="shrink-0">ls -la</span>
                      <span className="hidden sm:inline shrink-0 ml-1">./projects/ --ranger-mode</span>
                    </div>
                    <div className="flex items-center bg-black border border-gray-700 px-3 py-1.5 w-full focus-within:border-secondary transition-colors rounded">
                      <span className="text-gray-500 text-xs mr-2">{t('projects.findPattern')}</span>
                      <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='"pattern"' className="bg-transparent border-none outline-none flex-1 text-white placeholder-gray-600 font-mono text-sm" autoComplete="off" aria-label={t('projects.searchAria')} />
                    </div>
                  </div>

                  <div className="mb-4 text-[11px] text-gray-600 flex flex-wrap gap-x-4 gap-y-1 font-mono">
                    <span>{t('projects.total')}: <span className="text-gray-400">{totalProjects}</span></span>
                    <span>|</span>
                    <span>{t('projects.showing')}: <span className="text-gray-400">{filteredProjects.length}</span></span>
                    <span>|</span>
                    <span>{t('projects.years')}: <span className="text-gray-400">{yearRange}</span></span>
                    <span>|</span>
                    <span>{t('projects.top')}: <span className="text-secondary">{localizeCategory(topCategory, locale)}</span></span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                      <Link href={`/projects/${project.id}`} key={project.id} className="block group relative">
                        <div className="bg-[#0a0a0a] border border-gray-800 h-64 flex flex-col relative overflow-hidden transition-all duration-300 hover:border-secondary shadow-lg hover:shadow-secondary/20 rounded-lg">
                          {(project.images?.[0] || project.thumbnail) && (
                            <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 grayscale group-hover:grayscale-0">
                              <Image src={project.thumbnail || project.images[0]} alt="" fill className="object-cover" />
                            </div>
                          )}
                          <div className="relative z-10 w-full h-full p-5 flex flex-col transition-colors group-hover:bg-black/40">
                            <div className="flex justify-between items-start mb-4 text-[10px] text-gray-500 font-mono border-b border-gray-800/50 pb-2">
                              <span>-rwxr-xr-x</span>
                              <span className="group-hover:text-secondary">{getStableSize(project.id)}</span>
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-2xl opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-md" aria-hidden="true">
                                {getCategoryEmoji(project.category)}
                              </span>
                              <h3 className="text-base font-bold text-gray-300 group-hover:text-secondary [overflow-wrap:anywhere] line-clamp-2 drop-shadow-md transition-colors">
                                {project.title.toLowerCase().replace(/\s+/g, '_')}
                                {project.language ? `.${project.language.toLowerCase()}` : '.sh'}
                              </h3>
                            </div>
                            <p className="text-gray-500 text-xs line-clamp-3 mb-4 group-hover:text-gray-300 transition-colors flex-grow leading-relaxed">{project.description}</p>
                            <div className="mt-auto border-t border-gray-800/50 pt-2 flex justify-between items-center text-[10px] text-gray-600 group-hover:text-gray-400">
                              <span>natlee:staff</span>
                              <span>{getStableDate(project.id)}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {filteredProjects.length === 0 && (
                    <div className="text-gray-500 mt-12 bg-red-900/10 border border-red-900/30 p-4 rounded inline-block">
                      {t('projects.noMatches', { term: searchTerm })}
                    </div>
                  )}
                </div>
              </div>
            </TerminalCommand>

            {commandComplete && (
              <div className="mt-12 pt-6 border-t border-gray-800 text-gray-600 text-xs text-center flex justify-between items-center px-4 animate-content-reveal">
                <span>{t('projects.totalProjects', { count: totalProjects })}</span>
                <span className="animate-pulse">_</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
