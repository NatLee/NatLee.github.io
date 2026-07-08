import { notFound } from 'next/navigation'
import { getProjectById, allProjectsData } from '@/data/projects'
import ProjectDetail from '@/components/ProjectDetail'

const siteUrl = 'https://natlee.github.io'

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
    // The root layout template appends " | Nat Lee".
    return {
      title: 'Project Not Found',
    }
  }

  const canonicalPath = `/projects/${project.id}/`
  const image = project.thumbnail || project.images?.[0]

  return {
    // Bare title — the root layout's title.template adds the " | Nat Lee" suffix
    // exactly once (returning the full string here double-suffixed every page).
    title: project.title,
    description: project.description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: 'article',
      url: `${siteUrl}${canonicalPath}`,
      title: `${project.title} | Nat Lee`,
      description: project.description,
      ...(image ? { images: [{ url: image, alt: project.title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | Nat Lee`,
      description: project.description,
      ...(image ? { images: [image] } : {}),
    },
  }
}

export default function ProjectDetailPage({ params }: Props) {
  const project = getProjectById(params.id)

  if (!project) {
    notFound()
  }

  return (
    <main id="main" tabIndex={-1} className="min-h-screen pointer-events-none focus:outline-none">
      <ProjectDetail project={project} />
    </main>
  )
}
