// Project ("asset") view model, adapted from the runtime bundle (/content/site.json).
import { pick, type Project } from '@/lib/site-contract'
import { parseYearMonth } from './experience'

export interface ProjectDetail {
  id: string
  title: string
  subtitle: string
  category: string
  status: 'Completed' | 'In Progress' | 'Archived'
  /** tier !== 'archive' */
  featured: boolean
  /** Has a public repository. */
  opensource: boolean
  thumbnail?: string
  images: string[]
  description: string
  longDescription: string
  language?: string
  technologies: string[]
  features: string[]
  challenges: string[]
  solutions: string[]
  results: string[]
  links: {
    demo?: string
    github?: string
    article?: string
    documentation?: string
    pypi?: string
  }
  timeline: {
    start: string
    end?: string
    duration: string
  }
  team?: string[]
  role: string
  company?: string
  stars?: number
}

function isOngoing(end: string | undefined): boolean {
  return !end || /present|now|ongoing/i.test(end)
}

/** "2021-12" → "2023-04" becomes "1 year 4 months"; open-ended becomes "Ongoing". */
export function holdingPeriod(start: string | undefined, end: string | undefined): string {
  if (isOngoing(end)) return 'Ongoing'
  const from = parseYearMonth(start)
  const to = parseYearMonth(end)
  if (!from || !to) return 'N/A'
  const months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())
  if (months <= 0) return '< 1 month'
  const years = Math.floor(months / 12)
  const rest = months % 12
  const parts: string[] = []
  if (years) parts.push(`${years} year${years > 1 ? 's' : ''}`)
  if (rest) parts.push(`${rest} month${rest > 1 ? 's' : ''}`)
  return parts.join(' ')
}

export function toProject(p: Project): ProjectDetail {
  const links = p.links ?? {}
  return {
    id: p.id,
    title: pick(p.title) ?? p.id,
    subtitle: pick(p.subtitle) ?? '',
    category: p.category ?? 'Other',
    status: p.status ?? 'Completed',
    featured: p.tier !== 'archive',
    opensource: Boolean(links.github),
    thumbnail: p.thumbnail,
    images: p.images ?? [],
    description: pick(p.description) ?? '',
    longDescription: pick(p.longDescription) ?? pick(p.description) ?? '',
    language: p.language,
    technologies: p.technologies ?? [],
    features: pick(p.features) ?? [],
    challenges: pick(p.challenges) ?? [],
    solutions: pick(p.solutions) ?? [],
    results: pick(p.results) ?? [],
    links,
    timeline: {
      start: p.start ?? '',
      end: p.end || undefined,
      duration: holdingPeriod(p.start, p.end),
    },
    role: pick(p.role) ?? '',
    stars: p.stars,
  }
}

export function getAllCategories(projects: ProjectDetail[]): string[] {
  return Array.from(new Set(projects.map((project) => project.category)))
}
