// Project accessors over the runtime bundle (see lib/site/store.ts).
// Display order = bundle order.
import type { Locale } from '@/lib/i18n/config'
import type { Project } from '@/lib/site/contract'
import { getSite, list, text } from '@/lib/site/store'

/** Canonical English category string from the bundle (filtering uses it as-is). */
export type ProjectCategory = string

export interface ProjectDetail {
  id: string
  title: string
  subtitle: string
  category: ProjectCategory
  status: 'Completed' | 'In Progress' | 'Archived'
  tier: Project['tier']
  /** Shown on the home page ranger list: every tier except the archive. */
  featured: boolean
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
  }
  role: string
  stars?: number
}

/** Internal link to a project page (one static page reading `?id=`). */
export function projectHref(id: string): string {
  return `/projects/view/?id=${encodeURIComponent(id)}`
}

function toProjectDetail(project: Project, locale: Locale): ProjectDetail {
  const images = project.images ?? []
  return {
    id: project.id,
    title: text(project.title, locale),
    subtitle: text(project.subtitle, locale),
    category: project.category,
    status: project.status,
    tier: project.tier,
    featured: project.tier !== 'archive',
    thumbnail: project.thumbnail || images[0] || '',
    images,
    description: text(project.description, locale),
    longDescription: text(project.longDescription, locale),
    language: project.language,
    technologies: project.technologies ?? [],
    features: list(project.features, locale),
    challenges: list(project.challenges, locale),
    solutions: list(project.solutions, locale),
    results: list(project.results, locale),
    links: { ...(project.links ?? {}) },
    timeline: { start: project.start, end: project.end },
    role: text(project.role, locale),
    stars: project.stars,
  }
}

const cache = new Map<Locale, ProjectDetail[]>()

export function getLocalizedProjects(locale: Locale = 'en'): ProjectDetail[] {
  let projects = cache.get(locale)
  if (!projects) {
    projects = getSite().projects.map((project) => toProjectDetail(project, locale))
    cache.set(locale, projects)
  }
  return projects
}

export function getFeaturedProjects(locale: Locale = 'en'): ProjectDetail[] {
  return getLocalizedProjects(locale).filter((project) => project.featured)
}

export function getProjectById(id: string, locale: Locale = 'en'): ProjectDetail | undefined {
  return getLocalizedProjects(locale).find((project) => project.id === id)
}

export function getProjectsByCategory(category: string, locale: Locale = 'en'): ProjectDetail[] {
  return getLocalizedProjects(locale).filter((project) => project.category === category)
}

export function getAllCategories(): string[] {
  return Array.from(new Set(getSite().projects.map((project) => project.category)))
}

// Display-only category labels. Filtering always uses the canonical (English)
// category value; this maps that value to a localized label for rendering.
const categoryLabelsZh: Record<string, string> = {
  'AI/ML': '人工智慧／機器學習',
  'Web Development': '網頁開發',
  'Web Application': '網頁應用',
  'Web Automation': '網頁自動化',
  'DevOps': 'DevOps',
  'Computer Vision': '電腦視覺',
  'Data Science': '資料科學',
  'Data Collection': '資料蒐集',
  'Image Processing': '影像處理',
  'Medical Imaging': '醫療影像',
  'Backend': '後端',
  'API/SDK': 'API/SDK',
  'Browser Extension': '瀏覽器擴充功能',
  'Open Source': '開源',
  'Utilities': '公用程式',
  'Tool': '工具',
  'Tools': '工具',
  'Productivity Tools': '生產力工具',
}

export function localizeCategory(category: string, locale: Locale = 'en'): string {
  if (locale !== 'zh-TW') return category
  return categoryLabelsZh[category] ?? category
}
