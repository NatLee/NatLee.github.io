// Project view models, read from the runtime bundle (see lib/site.ts).
import { derived, en } from '@/lib/site'
import type { Project } from '@/lib/site-contract'

export interface ProjectDetail {
  id: string
  title: string
  subtitle: string
  category: string
  theme: Project['theme']
  status: 'Completed' | 'In Progress' | 'Archived'
  /** Flagship and selected projects; archive entries are not featured. */
  featured: boolean
  /** Has a public repository. */
  opensource: boolean
  /** Card image: the local thumbnail, else the first screenshot, else '' (cards draw a placeholder). */
  thumbnail: string
  images: string[]
  description: string
  longDescription: string
  language?: string
  technologies: string[]
  features: string[]
  challenges: string[]
  solutions: string[]
  results: string[]
  links: Partial<Record<'demo' | 'github' | 'pypi' | 'documentation' | 'article', string>>
  timeline: {
    start: string
    end?: string
    duration: string
  }
  team?: string[]
  role: string
  company?: string
}

// "2024-02" | "2024" → months since year 0; undefined if unparseable.
function toMonths(value: string): number | undefined {
  const m = /^(\d{4})(?:[-.](\d{1,2}))?/.exec(value.trim())
  if (!m) return undefined
  return Number(m[1]) * 12 + (m[2] ? Number(m[2]) - 1 : 0)
}

function durationOf(start: string, end?: string): string {
  if (!end || end === 'Present') return 'Ongoing'
  const a = toMonths(start)
  const b = toMonths(end)
  if (a === undefined || b === undefined || b < a) return ''
  const total = b - a
  if (total === 0) return '1 month'
  const years = Math.floor(total / 12)
  const months = total % 12
  const parts: string[] = []
  if (years) parts.push(`${years} year${years > 1 ? 's' : ''}`)
  if (months) parts.push(`${months} month${months > 1 ? 's' : ''}`)
  return parts.join(' ')
}

function toView(p: Project): ProjectDetail {
  const links: ProjectDetail['links'] = {}
  for (const [key, url] of Object.entries(p.links ?? {})) if (url) links[key as keyof ProjectDetail['links']] = url
  const images = p.images ?? []
  return {
    id: p.id,
    title: en(p.title, p.id),
    subtitle: en(p.subtitle, ''),
    category: p.category,
    theme: p.theme,
    status: p.status,
    featured: p.tier !== 'archive',
    opensource: Boolean(links.github),
    thumbnail: p.thumbnail || images[0] || '',
    images,
    description: en(p.description, ''),
    longDescription: en(p.longDescription, ''),
    language: p.language,
    technologies: p.technologies ?? [],
    features: en(p.features, []),
    challenges: en(p.challenges, []),
    solutions: en(p.solutions, []),
    results: en(p.results, []),
    links,
    timeline: { start: p.start, end: p.end, duration: durationOf(p.start, p.end) },
    role: en(p.role, ''),
  }
}

export const getAllProjects = derived(({ projects }) => (projects ?? []).map(toView))

export function getFeaturedProjects(): ProjectDetail[] {
  return getAllProjects().filter((project) => project.featured)
}

export function getProjectById(id: string): ProjectDetail | undefined {
  return getAllProjects().find((project) => project.id === id)
}

export function getProjectsByCategory(category: string): ProjectDetail[] {
  return getAllProjects().filter((project) => project.category === category)
}

export function getAllCategories(): string[] {
  return Array.from(new Set(getAllProjects().map((project) => project.category)))
}

/** Categories ordered by how many of the given projects use them. */
export function topCategories(projects: ProjectDetail[], limit: number): string[] {
  const counts = new Map<string, number>()
  for (const p of projects) counts.set(p.category, (counts.get(p.category) ?? 0) + 1)
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([category]) => category)
}

export function getProfessionalProjects(): ProjectDetail[] {
  return getAllProjects().filter((project) => !project.opensource)
}

export function getOpenSourceProjects(): ProjectDetail[] {
  return getAllProjects().filter((project) => project.opensource)
}

/** Link to the single static detail page. */
export function projectHref(id: string): string {
  return `/projects/view/?id=${encodeURIComponent(id)}`
}
