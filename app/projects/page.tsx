import ProjectsIndex from '@/components/projects/ProjectsIndex'

export const metadata = {
  title: 'Projects',
  description: 'Telepy, power-trading systems, developer infrastructure, computer vision and open-source tools by Nat Lee.',
  alternates: { canonical: '/projects/' },
}

export default function ProjectsPage() {
  return (
    <main id="main" tabIndex={-1} className="focus:outline-none">
      <ProjectsIndex />
    </main>
  )
}
