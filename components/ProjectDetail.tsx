'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ProjectDetail as ProjectDetailType } from '@/data/projects'
import Image from 'next/image'

interface Props {
  project: ProjectDetailType
}

type Tab = 'README.md' | 'config.ts' | 'spec.json'

// Simulated terminal logs
const LOG_DELAY = 150
const BOOT_SEQUENCE = [
  { text: '>Initializing development environment...', type: 'info' },
  { text: '>Loading project configuration...', type: 'info' },
  { text: '>Resolving dependencies...', type: 'info' },
  { text: '>Linking workspace...', type: 'info' },
  { text: '✓ Environment ready', type: 'success' },
  { text: '>Starting development server...', type: 'warning' },
  { text: '>Compiled successfully', type: 'success' },
  { text: '>Waiting for client connection...', type: 'info' },
]

export default function ProjectDetail({ project }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('README.md')
  const [logs, setLogs] = useState<{ text: string; type: string }[]>([])
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Reset logs when project changes
    setLogs([])
    let currentIndex = 0

    const interval = setInterval(() => {
      if (currentIndex >= BOOT_SEQUENCE.length) {
        clearInterval(interval)
        return
      }

      const log = BOOT_SEQUENCE[currentIndex]
      // Add dynamic project-specific logs
      if (currentIndex === 1) log.text = `>Loading ${project.id} configuration...`

      setLogs(prev => [...prev, log])
      currentIndex++

      // Auto-scroll to bottom
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
      }
    }, LOG_DELAY)

    return () => clearInterval(interval)
  }, [project.id])

  // Vim-like line generation helper
  const renderLine = (num: number, content: React.ReactNode) => (
    <div className="flex group" key={num}>
      <span className="text-gray-600 select-none mr-4 w-8 text-right font-mono text-sm opacity-50 group-hover:opacity-100">{num}</span>
      <div className="text-gray-300 font-mono text-sm whitespace-pre-wrap break-words flex-1">{content}</div>
    </div>
  )

  const renderConfigTab = () => {
    let lineIdx = 0
    const next = () => ++lineIdx
    return (
      <div className="space-y-1">
        {renderLine(next(), <span className="text-gray-500">/**</span>)}
        {renderLine(next(), <span className="text-gray-500"> * <span className="text-secondary font-bold">Project Configuration</span></span>)}
        {renderLine(next(), <span className="text-gray-500"> * @module {project.id}</span>)}
        {renderLine(next(), <span className="text-gray-500"> */</span>)}
        {renderLine(next(), '')}
        {renderLine(next(), <span><span className="text-purple-400">export const</span> <span className="text-blue-400">project_config</span> = <span className="text-yellow-300">{'{'}</span></span>)}
        {renderLine(next(), <span>  <span className="text-red-300">id</span>: <span className="text-green-300">"{project.id}"</span>,</span>)}
        {renderLine(next(), <span>  <span className="text-red-300">name</span>: <span className="text-green-300">"{project.title}"</span>,</span>)}
        {renderLine(next(), <span>  <span className="text-red-300">category</span>: <span className="text-green-300">"{project.category}"</span>,</span>)}
        {renderLine(next(), <span>  <span className="text-red-300">role</span>: <span className="text-green-300">"{project.role}"</span>,</span>)}
        {renderLine(next(), <span>  <span className="text-red-300">stack</span>: [</span>)}
        {project.technologies?.map((tech, i) =>
          renderLine(next(), <span className="pl-4"><span className="text-green-300">"{tech}"</span>{i < (project.technologies?.length || 0) - 1 ? ',' : ''}</span>)
        )}
        {renderLine(next(), <span>  ],</span>)}
        {renderLine(next(), <span>  <span className="text-red-300">deployment</span>: <span className="text-yellow-300">{'{'}</span></span>)}
        {project.links && Object.entries(project.links).map(([key, url]) => (
          url && renderLine(next(), (
            <span className="pl-4">
              <span className="text-red-300">{key}</span>: <a href={url} target="_blank" className="text-blue-400 underline decoration-blue-900/50 hover:text-blue-300">"{url}"</a>,
            </span>
          ))
        ))}
        {renderLine(next(), <span>  <span className="text-yellow-300">{'}'}</span></span>)}
        {renderLine(next(), <span className="text-yellow-300">{'}'}</span>)}
        {renderLine(next(), '')}
        {renderLine(next(), <span><span className="text-purple-400">export default</span> <span className="text-blue-400">project_config</span>;</span>)}
      </div>
    )
  }

  const renderREADME = () => {
    let lineIdx = 0
    const next = () => ++lineIdx
    return (
      <div className="space-y-1">
        {renderLine(next(), <h1 className="text-secondary font-bold text-2xl mb-4"># {project.title}</h1>)}
        {renderLine(next(), <p className="text-gray-400 italic mb-6">{project.subtitle}</p>)}
        {renderLine(next(), <h2 className="text-blue-400 font-bold text-lg mt-6 mb-2">## Project Overview</h2>)}
        {project.longDescription.split('\n').map((para, i) => para && renderLine(next(), <p className="mb-4">{para}</p>))}
        {renderLine(next(), '')}
        {renderLine(next(), <h2 className="text-blue-400 font-bold text-lg mt-6 mb-2">## Core Features</h2>)}
        {project.features?.map(feat => renderLine(next(), <li className="list-none flex gap-2"><span className="text-secondary">-</span> {feat}</li>))}
        {renderLine(next(), '')}
        {renderLine(next(), <h2 className="text-blue-400 font-bold text-lg mt-6 mb-2">## Key Technologies</h2>)}
        {renderLine(next(), <span>{project.technologies?.join(' • ')}</span>)}
      </div>
    )
  }

  const renderSpec = () => {
    let lineIdx = 0
    const next = () => ++lineIdx
    return (
      <div className="space-y-1">
        {renderLine(next(), <span className="text-yellow-400">{'{'}</span>)}
        {renderLine(next(), <span>  <span className="text-blue-300">"specification"</span>: <span className="text-yellow-400">{'{'}</span></span>)}
        {project.timeline && renderLine(next(), <span>    <span className="text-blue-300">"timeline"</span>: <span className="text-green-300">"{project.timeline.start} to {project.timeline.end || 'Present'}"</span>,</span>)}
        {renderLine(next(), <span>    <span className="text-blue-300">"role"</span>: <span className="text-green-300">"{project.role}"</span>,</span>)}
        {renderLine(next(), <span>    <span className="text-blue-300">"organization"</span>: <span className="text-green-300">"{project.company || 'Personal'}"</span>,</span>)}
        {renderLine(next(), <span>    <span className="text-blue-300">"impact_metrics"</span>: [</span>)}
        {project.results?.map((res, i) => renderLine(next(), <span className="pl-6"><span className="text-green-300">"{res}"</span>{i < (project.results?.length || 0) - 1 ? ',' : ''}</span>))}
        {renderLine(next(), <span>    ]</span>)}
        {renderLine(next(), <span>  <span className="text-yellow-400">{'}'}</span></span>)}
        {renderLine(next(), <span className="text-yellow-400">{'}'}</span>)}
      </div>
    )
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    if (!project.images) return
    setCurrentImageIndex((prev) => (prev + 1) % project.images!.length)
  }

  const prevImage = () => {
    if (!project.images) return
    setCurrentImageIndex((prev) => (prev - 1 + project.images!.length) % project.images!.length)
  }

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[calc(100vh-8rem)] max-w-[100rem] mx-auto border-x border-gray-800 bg-black/60 backdrop-blur-md rounded-lg overflow-hidden shadow-2xl pointer-events-none">

      {/* Left Column: Code Editor & Terminal */}
      <div className="flex-1 flex flex-col md:w-1/2 lg:border-r border-gray-800">

        {/* Top: Vim Editor */}
        <div className="flex flex-col h-[60%] lg:h-[65%] border-b border-gray-800 bg-black/20 pointer-events-auto">

          {/* Tab Bar */}
          <div className="flex bg-black/40 border-b border-gray-800 px-4 pt-2 gap-1 overflow-x-auto select-none no-scrollbar">
            {(['README.md', 'config.ts', 'spec.json'] as Tab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-4 py-2 text-xs font-mono rounded-t transition-colors whitespace-nowrap
                  ${activeTab === tab
                    ? 'bg-black/20 text-secondary border-t border-x border-gray-800 font-bold'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                  }
                `}
              >
                <span className="mr-2">{tab === 'README.md' ? '📘' : tab === 'config.ts' ? '⚙️' : '📋'}</span>
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 p-4 lg:p-8 overflow-y-auto custom-scrollbar relative">
            {/* Breadcrumbs / Vim Header */}
            <div className="mb-6 text-gray-500 font-mono text-xs flex justify-between items-center opacity-70">
              <div className="flex items-center gap-2">
                <Link href="/projects" className="hover:text-secondary hover:underline text-blue-400">
                  ~/projects
                </Link>
                <span>/</span>
                <span className="text-gray-300">{project.id}</span>
                <span>/</span>
                <span className="text-secondary">{activeTab}</span>
              </div>
              <span>vim 8.2</span>
            </div>

            <div className="font-mono">
              {activeTab === 'README.md' && renderREADME()}
              {activeTab === 'config.ts' && renderConfigTab()}
              {activeTab === 'spec.json' && renderSpec()}
            </div>
          </div>

          {/* Status Bar */}
          <div className="bg-black/40 border-t border-gray-800 p-1 px-4 flex justify-between items-center text-[10px] font-mono select-none">
            <div className="flex items-center gap-4">
              <span className="bg-secondary text-black px-2 py-0.5 font-bold">NORMAL</span>
              <span className="text-gray-500 uppercase tracking-widest">{activeTab}</span>
            </div>
            <div className="flex gap-4 text-gray-600">
              <span>utf-8</span>
              <span>Ln 1, Col 1</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Bottom: Terminal Panel */}
        <div className="flex-1 bg-[#111] flex flex-col min-h-0 pointer-events-auto">
          {/* Terminal Tabs */}
          <div className="flex border-b border-gray-800 text-[10px] font-mono select-none bg-[#0a0a0a]">
            <div className="px-4 py-1.5 text-gray-300 border-r border-gray-800 border-t-2 border-t-secondary bg-[#1a1a1a]">TERMINAL</div>
            <div className="px-4 py-1.5 text-gray-600 border-r border-gray-800 hover:text-gray-400 cursor-not-allowed">OUTPUT</div>
            <div className="px-4 py-1.5 text-gray-600 border-r border-gray-800 hover:text-gray-400 cursor-not-allowed">DEBUG CONSOLE</div>
            <div className="px-4 py-1.5 text-gray-600 border-r border-gray-800 hover:text-gray-400 cursor-not-allowed">PROBLEMS</div>
            <div className="flex-1 text-right px-4 py-1.5 text-gray-700">zsh</div>
          </div>

          {/* Terminal Content */}
          <div
            ref={terminalRef}
            className="flex-1 p-3 overflow-y-auto font-mono text-xs custom-scrollbar space-y-1"
          >
            {logs.map((log, i) => (
              <div key={i} className={`
                ${log.type === 'error' ? 'text-red-400' :
                  log.type === 'success' ? 'text-green-400' :
                    log.type === 'warning' ? 'text-yellow-400' : 'text-gray-400'}
              `}>
                <span className="opacity-50 mr-2">{new Date().toLocaleTimeString()}</span>
                {log.text}
              </div>
            ))}
            <div className="flex items-center text-gray-400">
              <span className="text-green-500 font-bold mr-2">➜</span>
              <span className="text-blue-400 mr-2">~/projects/{project.id}</span>
              <span className="text-gray-500 bg-gray-500/50 w-2 h-4 animate-pulse"></span>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: Preview / Images ("Browser" or "Second Monitor") */}
      <div className="lg:w-1/2 bg-black/40 flex flex-col shadow-inner border-l border-gray-800 pointer-events-auto">

        {/* Fake Browser Toolbar */}
        <div className="bg-black/60 border-b border-gray-800 p-2.5 flex items-center gap-4">
          <div className="flex gap-1.5 ml-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
          <div className="flex-1 bg-black rounded p-1.5 px-3 text-[10px] text-gray-500 font-mono flex justify-between items-center border border-gray-800">
            <span className="truncate opacity-60">
              {project.links?.demo || project.links?.github || `localhost:3000/projects/${project.id}`}
            </span>
            <div className="flex gap-2">
              <span className="text-gray-600 hover:text-white cursor-pointer transition-colors">↻</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-black/20 relative overflow-hidden">
          {project.images && project.images.length > 0 ? (
            <div className="relative w-full h-full flex flex-col">

              {/* Image Container */}
              <div className="flex-1 relative flex items-center justify-center p-8">
                {/* Navigation Buttons */}
                {project.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 z-20 p-2 bg-black/50 hover:bg-secondary text-white rounded-full border border-gray-700 hover:border-secondary transition-all"
                    >
                      <span className="text-xl">←</span>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 z-20 p-2 bg-black/50 hover:bg-secondary text-white rounded-full border border-gray-700 hover:border-secondary transition-all"
                    >
                      <span className="text-xl">→</span>
                    </button>
                  </>
                )}

                <div className="relative w-full h-full">
                  <Image
                    src={project.images[currentImageIndex]}
                    alt={`Preview ${currentImageIndex}`}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Caption / Image Counter */}
              <div className="bg-[#111] border-t border-gray-800 p-3 flex justify-between items-center text-xs font-mono text-gray-500">
                <span>RENDER_OUTPUT_{currentImageIndex + 1}.PNG</span>
                <div className="flex items-center gap-2">
                  <span>{currentImageIndex + 1} / {project.images.length}</span>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-700 font-mono space-y-6">
              <div className="text-8xl opacity-10 select-none">404</div>
              <div className="text-center space-y-2">
                <div className="text-xs font-bold text-red-900/50 flex items-center gap-2 justify-center">
                  <span className="animate-ping w-2 h-2 bg-red-900 rounded-full"></span>
                  NO_ASSETS_FOUND
                </div>
                <p className="text-[10px] opacity-40 max-w-[200px] mx-auto text-center leading-relaxed">
                  Module visual buffers are currently null or disconnected for ID: {project.id}
                </p>
              </div>
            </div>
          )}

          {/* Scanline Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_2px,3px_100%] pointer-events-none z-10"></div>
        </div>

      </div>

    </div>
  )
}
