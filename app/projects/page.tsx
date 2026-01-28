import Navigation from '@/components/Navigation'
import ProjectsGrid from '@/components/ProjectsGrid'

export const metadata = {
  title: 'Projects | Nat Lee',
  description: 'Collection of projects, tools, and experiments by Nat Lee',
}

export default function ProjectsPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pointer-events-none">
        <ProjectsGrid />
      </main>
    </>
  )
}
