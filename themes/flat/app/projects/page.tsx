import Navigation from '@/components/Navigation'
import ProjectsGrid from '@/components/ProjectsGrid'

export default function ProjectsPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-16">
        <ProjectsGrid />
      </main>
    </>
  )
}
