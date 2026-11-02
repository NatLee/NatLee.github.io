'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { getProjectById } from '@/data/projects'
import ProjectDetail from '@/components/ProjectDetail'
import NotFoundScreen from '@/components/NotFoundScreen'

// One static page for every project (`/projects/view/?id=<id>`), so a project
// added to the content shows up without rebuilding the theme.
function ProjectView() {
  const id = useSearchParams().get('id') ?? ''
  const project = id ? getProjectById(id) : undefined

  if (!project) return <NotFoundScreen path={`/projects/${id || '?'}`} />

  return (
    <main id="main" tabIndex={-1} className="min-h-screen pointer-events-none focus:outline-none">
      {/* Keyed so switching ?id= replays the tab-open entrance like a fresh route. */}
      <ProjectDetail key={project.id} project={project} />
    </main>
  )
}

export default function ProjectViewPage() {
  return (
    <Suspense fallback={null}>
      <ProjectView />
    </Suspense>
  )
}
