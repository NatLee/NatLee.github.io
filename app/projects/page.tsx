import Navigation from '@/components/Navigation'
import ProjectsGrid from '@/components/ProjectsGrid'

export const metadata = {
  title: 'Open Source Projects | Nat Lee',
  description: 'Collection of open source projects, tools, and experiments by Nat Lee',
}

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
