import type { MetadataRoute } from 'next'
import { allProjectsData } from '@/data/projects'

const siteUrl = 'https://natlee.github.io'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number][] = [
    ['', 1],
    ['projects', 0.9],
    ['about', 0.8],
    ['experience', 0.8],
    ['valhalla', 0.4],
  ]
  const staticRoutes = pages.map(([path, priority]) => ({
    url: path ? `${siteUrl}/${path}/` : `${siteUrl}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority,
  }))

  const tierPriority = { flagship: 0.9, selected: 0.8, archive: 0.6 } as const
  const projectRoutes = allProjectsData.map((project) => ({
    url: `${siteUrl}/projects/${project.id}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: tierPriority[project.tier],
  }))

  return [...staticRoutes, ...projectRoutes]
}
