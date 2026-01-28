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
      <main className="min-h-screen font-mono relative overflow-hidden pt-20 pb-16 pointer-events-none">

        <div className="relative z-10 container mx-auto px-4 max-w-[100rem] pointer-events-auto">
          {/* Terminal Top Bar */}
          <div className="w-full bg-[#1a1a1a] rounded-t-lg border border-gray-700 p-3 flex items-center gap-2 sticky top-14 z-20 shadow-xl">
            <div className="flex gap-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex-1 text-center text-sm text-gray-500 font-bold select-none">
              natlee@mainframe:~/projects/{project.id} (vim README.md)
            </div>
          </div>

          {/* Terminal Content */}
          <div className="bg-black/60 backdrop-blur-sm border-x border-b border-gray-700 rounded-b-lg shadow-2xl p-4 md:p-6 min-h-[600px]">
            <ProjectDetail project={project} />
          </div>
        </div>
      </main>
    </>
  )
}
