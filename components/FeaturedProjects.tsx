'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { getFeaturedProjects } from '@/data/projects'
import Icon from './Icon'

export default function FeaturedProjects() {
  const featuredProjects = getFeaturedProjects()
  const [activeProject, setActiveProject] = useState(featuredProjects[0])

  return (
    <section className="py-20 bg-[#0a0a0a] font-mono text-gray-400">
      <div className="container mx-auto px-4 w-full max-w-6xl">
        <div className="flex flex-col md:flex-row overflow-hidden border border-gray-700 rounded-lg">

          {/* Left Pane: File List */}
          <div className="w-full md:w-1/2 border-r border-gray-800 p-4">
            <div className="mb-4 text-xs text-secondary border-b border-gray-800 pb-2">
              ~/projects/
            </div>
            <div className="space-y-1">
              {featuredProjects.map((project, index) => (
                <div
                  key={project.id}
                  onMouseEnter={() => setActiveProject(project)}
                  className={`
                                cursor-pointer p-2 flex items-center gap-3 transition-colors
                                ${activeProject.id === project.id ? 'bg-secondary text-black font-bold' : 'hover:bg-gray-800'}
                            `}
                >
                  <span className="text-xs w-6">{index + 1}</span>
                  <span className="text-xs md:text-sm">drwxr-xr-x</span>
                  <span className="text-xs md:text-sm">{project.title.replace(/\s+/g, '_')}</span>
                </div>
              ))}
              <div className="p-2 text-gray-600 italic text-sm">
                ... (more)
              </div>
            </div>
            <div className="mt-8 text-xs text-gray-500">
              <p>Hint: Hover to preview</p>
            </div>
          </div>

          {/* Right Pane: Preview */}
          <div className="w-full md:w-1/2 p-6 flex flex-col relative bg-[#111]">
            {activeProject && (
              <div className="animate-fade-in space-y-6">
                <div className="border border-gray-700 p-1 bg-black">
                  {/* Image Placeholder or Actual Image */}
                  <div className="relative aspect-video w-full bg-gray-800 overflow-hidden">
                    {activeProject.images && activeProject.images.length > 0 ? (
                      <img
                        src={activeProject.images[0]}
                        alt={activeProject.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-secondary">
                        [NO IMAGE DATA]
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-secondary font-bold mb-2">
                    {activeProject.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <span>{activeProject.category}</span>
                    <span>|</span>
                    <span>{activeProject.status}</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {activeProject.description}
                  </p>
                </div>

                <div className="pt-6 mt-auto border-t border-gray-800 flex gap-4">
                  <Link
                    href={`/projects/${activeProject.id}`}
                    className="px-4 py-2 bg-secondary text-black text-sm font-bold hover:bg-orange-600 transition-colors"
                  >
                    Open
                  </Link>
                  {activeProject.links?.github && (
                    <a
                      href={activeProject.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-gray-600 text-gray-400 text-sm hover:text-white hover:border-gray-400"
                    >
                      View Source
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Status Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-secondary text-black px-4 py-1 text-xs flex justify-between">
              <span>{activeProject.id}</span>
              <span>READ-ONLY</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index }: { project: any, index: number }) {
  return null;
}
