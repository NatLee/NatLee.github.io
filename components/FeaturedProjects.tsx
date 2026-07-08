'use client'

import React, { useCallback, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getFeaturedProjects } from '@/data/projects'
import { useLanguage } from '@/contexts/LanguageContext'

export default function FeaturedProjects() {
  const router = useRouter()
  const { locale, t } = useLanguage()
  const featuredProjects = useMemo(() => getFeaturedProjects(locale), [locale])
  const [activeIndex, setActiveIndex] = useState(0)
  const activeProject = featuredProjects[activeIndex]

  const handleProjectClick = useCallback(
    (projectId: string) => {
      router.push(`/projects/${projectId}`)
    },
    [router]
  )

  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])

  // Roving focus scoped to the listbox. Arrow keys only act while an option is
  // focused (the handler lives on the container, not window), and Enter/Space
  // fall through to the option button's native activation — so the rest of the
  // page keeps normal keyboard behaviour.
  const focusOption = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, featuredProjects.length - 1))
      setActiveIndex(clamped)
      optionRefs.current[clamped]?.focus()
    },
    [featuredProjects.length]
  )

  const handleListKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        focusOption(activeIndex + 1)
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        focusOption(activeIndex - 1)
      }
    },
    [activeIndex, focusOption]
  )

  const statusLabel = (status: string) => t(`status.${status}` as 'status.Completed')

  return (
    <section className="py-8 font-mono text-gray-400">
      <div className="w-full">
        <div className="flex flex-col md:flex-row overflow-hidden border border-gray-800 rounded-lg bg-[#0a0a0a]">
          <div className="w-full md:w-1/2 border-r border-gray-800 flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 text-xs border-b border-gray-800 bg-black/50">
              <span className="text-secondary">~/projects/</span>
              <span className="text-gray-600">{featuredProjects.length} {t('projects.featured.items')}</span>
            </div>

            <div className="flex-1 p-2" role="listbox" aria-label="Featured projects" onKeyDown={handleListKeyDown}>
              <div className="space-y-0.5">
                {featuredProjects.map((project, index) => (
                  <button
                    key={project.id}
                    ref={(el) => { optionRefs.current[index] = el }}
                    type="button"
                    role="option"
                    aria-selected={activeIndex === index}
                    onClick={() => handleProjectClick(project.id)}
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    className={`w-full text-left cursor-pointer px-3 py-2 flex items-center gap-3 transition-all duration-150 rounded ${
                      activeIndex === index ? 'bg-secondary text-black font-bold' : 'hover:bg-gray-800/50'
                    }`}
                  >
                    <span className={`text-xs w-4 ${activeIndex === index ? 'text-black' : 'text-gray-600'}`}>
                      {activeIndex === index ? '▶' : ' '}
                    </span>
                    <span className={`text-xs hidden sm:inline ${activeIndex === index ? 'text-black/70' : 'text-gray-600'}`}>drwxr-xr-x</span>
                    <span className={activeIndex === index ? 'text-black' : 'text-yellow-600'}>📁</span>
                    <span className="text-xs md:text-sm flex-1 truncate">{project.title.replace(/\s+/g, '_')}/</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      activeIndex === index
                        ? 'bg-black/20 text-black'
                        : project.status === 'Completed'
                          ? 'bg-green-900/30 text-green-500'
                          : project.status === 'In Progress'
                            ? 'bg-blue-900/30 text-blue-400'
                            : 'bg-gray-900/30 text-gray-500'
                    }`}>
                      {project.status === 'Completed' ? '●' : '○'}
                    </span>
                  </button>
                ))}

                <Link href="/projects" className="group px-3 py-2 flex items-center gap-3 text-gray-600 hover:text-secondary transition-colors rounded hover:bg-gray-800/30">
                  <span className="text-xs w-4 group-hover:text-secondary">→</span>
                  <span className="text-xs hidden sm:inline">----------</span>
                  <span>📂</span>
                  <span className="text-xs md:text-sm italic">{t('projects.featured.viewAll')}</span>
                </Link>
              </div>
            </div>

            <div className="px-4 py-2 text-[10px] text-gray-600 border-t border-gray-800 bg-black/30 flex justify-between">
              <span>{t('projects.featured.navigate')}</span>
              <span>{t('projects.featured.open')}</span>
              <span>{t('projects.featured.preview')}</span>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col relative bg-[#111] min-h-[400px]">
            <div className="flex items-center justify-between px-4 py-2 text-xs border-b border-gray-800 bg-black/50">
              <span className="text-gray-500">{t('projects.featured.previewLabel')}</span>
              <span className="text-gray-600">{activeProject?.category}</span>
            </div>

            {activeProject && (
              <div key={activeProject.id} className="flex-1 p-4 flex flex-col animate-preview-fade">
                <div className="border border-gray-700 bg-black overflow-hidden rounded">
                  <div className="relative aspect-video w-full bg-gray-900 overflow-hidden">
                    {activeProject.images?.length ? (
                      <Image src={activeProject.images[0]} alt={activeProject.title} fill className="object-cover transition-transform duration-300 hover:scale-105" unoptimized />
                    ) : (
                      <div className="flex items-center justify-center h-full text-secondary text-sm">{t('projects.featured.noPreview')}</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                      <div className="text-white text-xs">{t('projects.featured.clickToOpen')}</div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 mt-4 space-y-3">
                  <div>
                    <h3 className="text-lg text-secondary font-bold">{activeProject.title}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
                      <span className="px-1.5 py-0.5 bg-gray-800 rounded">{activeProject.category}</span>
                      <span>•</span>
                      <span>{activeProject.role}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 min-h-[3.75rem]">{activeProject.description}</p>
                  {activeProject.technologies && (
                    <div className="flex flex-wrap gap-1 min-h-[1.5rem]">
                      {activeProject.technologies.slice(0, 4).map((tech) => (
                        <span key={tech} className="text-[10px] px-1.5 py-0.5 bg-gray-800/50 text-gray-500 rounded">{tech}</span>
                      ))}
                      {activeProject.technologies.length > 4 && (
                        <span className="text-[10px] px-1.5 py-0.5 text-gray-600">+{activeProject.technologies.length - 4}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-auto border-t border-gray-800 flex items-center justify-between">
                  <div className="flex gap-2">
                    {activeProject.links?.github && (
                      <a href={activeProject.links.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="px-3 py-1.5 text-xs border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded transition-colors flex items-center gap-1.5">
                        <span>⌥</span> {t('projects.featured.source')}
                      </a>
                    )}
                    {activeProject.links?.demo && (
                      <a href={activeProject.links.demo} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="px-3 py-1.5 text-xs border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded transition-colors flex items-center gap-1.5">
                        <span>⌘</span> {t('projects.featured.demo')}
                      </a>
                    )}
                  </div>
                  <button type="button" onClick={() => handleProjectClick(activeProject.id)} className="px-3 py-1.5 bg-secondary text-black text-xs font-bold hover:bg-orange-500 transition-colors rounded flex items-center gap-1.5">
                    {t('projects.featured.openBtn')} <span className="opacity-70">⏎</span>
                  </button>
                </div>
              </div>
            )}

            <div className="bg-gray-900 border-t border-gray-800 text-gray-500 px-4 py-1.5 text-[10px] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-secondary">{activeProject?.id}/</span>
                <span className="text-gray-600">README.md</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${activeProject?.status === 'Completed' ? 'bg-green-500' : 'bg-blue-400'}`} />
                <span>{activeProject ? statusLabel(activeProject.status) : ''}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
