'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getFeaturedProjects } from '@/data/projects'

export default function FeaturedProjects() {
  const router = useRouter()
  const featuredProjects = getFeaturedProjects()
  const [activeProject, setActiveProject] = useState(featuredProjects[0])
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0)

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`)
  }

  return (
    <section className="py-8 font-mono text-gray-400">
      <div className="w-full">
        <div className="flex flex-col md:flex-row overflow-hidden border border-gray-800 rounded-lg bg-[#0a0a0a]">

          {/* Left Pane: File List (Ranger-style) */}
          <div className="w-full md:w-1/2 border-r border-gray-800 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 text-xs border-b border-gray-800 bg-black/50">
              <span className="text-secondary">~/projects/</span>
              <span className="text-gray-600">{featuredProjects.length} items</span>
            </div>
            
            {/* File List */}
            <div className="flex-1 p-2">
              <div className="space-y-0.5">
                {featuredProjects.map((project, index) => (
                  <div
                    key={project.id}
                    onClick={() => handleProjectClick(project.id)}
                    onMouseEnter={() => {
                      setActiveProject(project)
                      setHoveredIndex(index)
                    }}
                    className={`
                      cursor-pointer px-3 py-2 flex items-center gap-3 transition-all duration-150 rounded
                      ${hoveredIndex === index 
                        ? 'bg-secondary text-black font-bold' 
                        : 'hover:bg-gray-800/50'}
                    `}
                  >
                    {/* Selection indicator */}
                    <span className={`text-xs w-4 ${hoveredIndex === index ? 'text-black' : 'text-gray-600'}`}>
                      {hoveredIndex === index ? '▶' : ' '}
                    </span>
                    
                    {/* Permissions */}
                    <span className={`text-xs hidden sm:inline ${hoveredIndex === index ? 'text-black/70' : 'text-gray-600'}`}>
                      drwxr-xr-x
                    </span>
                    
                    {/* Folder icon */}
                    <span className={`${hoveredIndex === index ? 'text-black' : 'text-yellow-600'}`}>
                      📁
                    </span>
                    
                    {/* Project name */}
                    <span className="text-xs md:text-sm flex-1 truncate">
                      {project.title.replace(/\s+/g, '_')}/
                    </span>
                    
                    {/* Status badge */}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      hoveredIndex === index 
                        ? 'bg-black/20 text-black' 
                        : project.status === 'Completed' 
                          ? 'bg-green-900/30 text-green-500' 
                          : project.status === 'In Progress'
                            ? 'bg-blue-900/30 text-blue-400'
                            : 'bg-gray-900/30 text-gray-500'
                    }`}>
                      {project.status === 'Completed' ? '●' : '○'}
                    </span>
                  </div>
                ))}
                
                {/* More link */}
                <Link
                  href="/projects"
                  className="group px-3 py-2 flex items-center gap-3 text-gray-600 hover:text-secondary transition-colors rounded hover:bg-gray-800/30"
                >
                  <span className="text-xs w-4 group-hover:text-secondary">→</span>
                  <span className="text-xs hidden sm:inline">----------</span>
                  <span>📂</span>
                  <span className="text-xs md:text-sm italic">... view all projects</span>
                </Link>
              </div>
            </div>
            
            {/* Footer hints */}
            <div className="px-4 py-2 text-[10px] text-gray-600 border-t border-gray-800 bg-black/30 flex justify-between">
              <span>↑↓ Navigate</span>
              <span>⏎ Open</span>
              <span>→ Preview</span>
            </div>
          </div>

          {/* Right Pane: Preview */}
          <div className="w-full md:w-1/2 flex flex-col relative bg-[#111] min-h-[400px]">
            {/* Preview Header */}
            <div className="flex items-center justify-between px-4 py-2 text-xs border-b border-gray-800 bg-black/50">
              <span className="text-gray-500">Preview</span>
              <span className="text-gray-600">{activeProject?.category}</span>
            </div>
            
            {activeProject && (
              <div key={activeProject.id} className="flex-1 p-4 flex flex-col animate-preview-fade">
                {/* Image Preview */}
                <div className="border border-gray-700 bg-black overflow-hidden rounded">
                  <div className="relative aspect-video w-full bg-gray-900 overflow-hidden">
                    {activeProject.images && activeProject.images.length > 0 ? (
                      <img
                        src={activeProject.images[0]}
                        alt={activeProject.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-secondary text-sm">
                        [NO_PREVIEW_AVAILABLE]
                      </div>
                    )}
                    
                    {/* Image overlay with quick info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                      <div className="text-white text-xs">
                        Click project to open →
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="flex-1 mt-4 space-y-3">
                  <div>
                    <h3 className="text-lg text-secondary font-bold">
                      {activeProject.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
                      <span className="px-1.5 py-0.5 bg-gray-800 rounded">{activeProject.category}</span>
                      <span>•</span>
                      <span>{activeProject.role}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 min-h-[3.75rem]">
                    {activeProject.description}
                  </p>
                  
                  {/* Tech stack preview */}
                  {activeProject.technologies && (
                    <div className="flex flex-wrap gap-1 min-h-[1.5rem]">
                      {activeProject.technologies.slice(0, 4).map((tech: string) => (
                        <span key={tech} className="text-[10px] px-1.5 py-0.5 bg-gray-800/50 text-gray-500 rounded">
                          {tech}
                        </span>
                      ))}
                      {activeProject.technologies.length > 4 && (
                        <span className="text-[10px] px-1.5 py-0.5 text-gray-600">
                          +{activeProject.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="pt-3 mt-auto border-t border-gray-800 flex items-center justify-between">
                  <div className="flex gap-2">
                    {activeProject.links?.github && (
                      <a
                        href={activeProject.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1.5 text-xs border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded transition-colors flex items-center gap-1.5"
                      >
                        <span>⌥</span> Source
                      </a>
                    )}
                    {activeProject.links?.demo && (
                      <a
                        href={activeProject.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1.5 text-xs border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded transition-colors flex items-center gap-1.5"
                      >
                        <span>⌘</span> Demo
                      </a>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleProjectClick(activeProject.id)}
                    className="px-3 py-1.5 bg-secondary text-black text-xs font-bold hover:bg-orange-500 transition-colors rounded flex items-center gap-1.5"
                  >
                    Open <span className="opacity-70">⏎</span>
                  </button>
                </div>
              </div>
            )}

            {/* Status Bar */}
            <div className="bg-gray-900 border-t border-gray-800 text-gray-500 px-4 py-1.5 text-[10px] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-secondary">{activeProject?.id}/</span>
                <span className="text-gray-600">README.md</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  activeProject?.status === 'Completed' ? 'bg-green-500' : 'bg-blue-400'
                }`}></span>
                <span>{activeProject?.status}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
