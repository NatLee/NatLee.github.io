import type { MetadataRoute } from 'next'
import { allProjectsData } from '@/data/projects'

const siteUrl = 'https://natlee.github.io'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', 'about', 'experience', 'projects'].map((path) => ({
    url: path ? `${siteUrl}/${path}/` : `${siteUrl}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.8,
  }))

  const projectRoutes = allProjectsData.map((project) => ({
    url: `${siteUrl}/projects/${project.id}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: project.featured ? 0.9 : 0.7,
  }))

  return [...staticRoutes, ...projectRoutes]
}
