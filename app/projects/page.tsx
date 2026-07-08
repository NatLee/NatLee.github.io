import ProjectsGrid from '@/components/ProjectsGrid'

export const metadata = {
  // Bare title — the root layout's title.template appends " | Nat Lee" once.
  title: 'Projects',
  description: 'Collection of projects, tools, and experiments by Nat Lee',
  alternates: {
    canonical: '/projects/',
  },
}

export default function ProjectsPage() {
  return (
    <main id="main" tabIndex={-1} className="min-h-screen pointer-events-none focus:outline-none">
      <h1 className="sr-only">Projects by Nat Lee</h1>
      <ProjectsGrid />
    </main>
  )
}
