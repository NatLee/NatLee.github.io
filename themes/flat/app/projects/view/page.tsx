'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Navigation from '@/components/Navigation'
import ProjectDetail from '@/components/ProjectDetail'
import Icon from '@/components/Icon'
import { getProjectById } from '@/data/projects'

// One static page for every project: /projects/view/?id=<id>
function ProjectView() {
  const id = useSearchParams().get('id') ?? ''
  const project = id ? getProjectById(id) : undefined

  if (!project) {
    return (
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-dark-900 px-4">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-secondary to-accent bg-clip-text text-transparent">
              Project Not Found
            </span>
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            {id ? <>No project with the id <span className="font-mono text-secondary">{id}</span>.</> : 'No project was selected.'}
          </p>
          <Link
            href="/projects/"
            className="inline-flex items-center gap-2 text-secondary hover:text-neon-blue transition-colors"
          >
            <Icon name="arrow-left" className="w-5 h-5" />
            Back to Projects
          </Link>
        </div>
      </section>
    )
  }

  return <ProjectDetail key={project.id} project={project} />
}

export default function ProjectViewPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-16">
        <Suspense fallback={<div className="min-h-screen bg-dark-900" />}>
          <ProjectView />
        </Suspense>
      </main>
    </>
  )
}
