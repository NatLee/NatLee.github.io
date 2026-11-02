import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/JsonLd'
import ProjectPage from '@/components/projects/ProjectPage'
import TelepyCaseStudy from '@/components/projects/TelepyCaseStudy'
import { allProjectsData, getProjectById } from '@/data/projects'

const siteUrl = 'https://natlee.github.io'

interface Props {
  params: { id: string }
}

export function generateStaticParams() {
  return allProjectsData.map((project) => ({ id: project.id }))
}

export function generateMetadata({ params }: Props) {
  const project = getProjectById(params.id)
  if (!project) return { title: 'Project not found' }

  const canonicalPath = `/projects/${project.id}/`
  const image = project.images[0]
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: 'article',
      url: `${siteUrl}${canonicalPath}`,
      title: `${project.title} | Nat Lee`,
      description: project.description,
      images: image ? [{ url: image, alt: project.title }] : [{ url: '/og.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | Nat Lee`,
      description: project.description,
      images: [image ?? '/og.png'],
    },
  }
}

export default function ProjectDetailPage({ params }: Props) {
  const project = getProjectById(params.id)
  if (!project) notFound()

  return (
    <main id="main" tabIndex={-1} className="focus:outline-none">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareSourceCode',
          name: project.title,
          description: project.description,
          url: `${siteUrl}/projects/${project.id}/`,
          ...(project.links.github ? { codeRepository: project.links.github } : {}),
          programmingLanguage: project.language,
          author: { '@type': 'Person', name: 'Nat Lee', url: siteUrl },
        }}
      />
      {project.id === 'telepy' ? <TelepyCaseStudy /> : <ProjectPage id={project.id} />}
    </main>
  )
}
