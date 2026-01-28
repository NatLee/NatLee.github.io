import { notFound } from 'next/navigation'
import { getProjectById, allProjectsData } from '@/data/projects'
import ProjectDetail from '@/components/ProjectDetail'
import Navigation from '@/components/Navigation'

interface Props {
  params: {
    id: string
  }
}

export function generateStaticParams() {
  return allProjectsData.map((project) => ({
    id: project.id,
  }))
}

export function generateMetadata({ params }: Props) {
  const project = getProjectById(params.id)

  if (!project) {
    return {
      title: 'Project Not Found | Nat Lee',
    }
  }

  return {
    title: `${project.title} | Nat Lee`,
    description: project.description,
  }
}

export default function ProjectDetailPage({ params }: Props) {
  const project = getProjectById(params.id)

  if (!project) {
    notFound()
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen pointer-events-none">
        <ProjectDetail project={project} />
      </main>
    </>
  )
}
