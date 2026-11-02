'use client'

import ProjectsGrid from '@/components/ProjectsGrid'
import { getPersonalInfo } from '@/data/personal'

export default function ProjectsPage() {
  return (
    <main id="main" tabIndex={-1} className="min-h-screen pointer-events-none focus:outline-none">
      <h1 className="sr-only">Projects by {getPersonalInfo().displayName}</h1>
      <ProjectsGrid />
    </main>
  )
}
