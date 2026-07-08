// 從 JSON 檔案載入專案數據
import projectsJsonData from '@/assets/data/projects.json'
import projectsZh from '@/assets/data/i18n/projects.zh.json'
import type { Locale } from '@/lib/i18n/config'
import { localizedArray, localizedField } from '@/lib/i18n/localize'

export type ProjectCategory =
  | 'AI/ML'
  | 'Web Development'
  | 'Data Science'
  | 'Computer Vision'
  | 'Backend'
  | 'Open Source'
  | 'Tool'
  | 'Tools'
  | 'DevOps'
  | 'Medical Imaging'
  | 'Utilities'
  | 'Browser Extension'
  | 'Image Processing'
  | 'Data Collection'
  | 'API/SDK'
  | 'Web Application'
  | 'Web Automation'
  | 'Productivity Tools'

export interface ProjectDetail {
  id: string
  title: string
  subtitle: string
  category: ProjectCategory
  status: 'Completed' | 'In Progress' | 'Archived'
  featured: boolean
  opensource: boolean
  thumbnail?: string
  images: string[]
  description: string
  longDescription: string
  language?: string
  githubUrl?: string
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
  }
  timeline: {
    start: string
    end?: string
    duration: string
  }
  team?: string[]
  role: string
  company?: string
}

type ProjectZhOverlay = Partial<
  Pick<
    ProjectDetail,
    'title' | 'subtitle' | 'description' | 'longDescription' | 'role' | 'features' | 'challenges' | 'solutions' | 'results'
  >
>

const projectZhMap = projectsZh as Record<string, ProjectZhOverlay>

function localizeProject(project: ProjectDetail, locale: Locale): ProjectDetail {
  if (locale !== 'zh-TW') return project

  const zh = projectZhMap[project.id]
  if (!zh) return project

  return {
    ...project,
    title: localizedField(locale, project.title, zh.title),
    subtitle: localizedField(locale, project.subtitle, zh.subtitle),
    description: localizedField(locale, project.description, zh.description),
    longDescription: localizedField(locale, project.longDescription, zh.longDescription),
    role: localizedField(locale, project.role, zh.role),
    features: localizedArray(locale, project.features, zh.features),
    challenges: localizedArray(locale, project.challenges, zh.challenges),
    solutions: localizedArray(locale, project.solutions, zh.solutions),
    results: localizedArray(locale, project.results, zh.results),
  }
}

export const allProjectsData: ProjectDetail[] = projectsJsonData.map((project) => ({
  ...project,
  thumbnail: project.images[0] || '',
  links: {
    ...project.links,
    github: project.githubUrl || project.links?.github,
  },
})) as ProjectDetail[]

export function getFeaturedProjects(locale: Locale = 'en'): ProjectDetail[] {
  return allProjectsData.filter((project) => project.featured).map((project) => localizeProject(project, locale))
}

export function getProjectById(id: string, locale: Locale = 'en'): ProjectDetail | undefined {
  const project = allProjectsData.find((item) => item.id === id)
  return project ? localizeProject(project, locale) : undefined
}

export function getProjectsByCategory(category: string, locale: Locale = 'en'): ProjectDetail[] {
  return allProjectsData
    .filter((project) => project.category === category)
    .map((project) => localizeProject(project, locale))
}

export function getAllCategories(): string[] {
  const categories = new Set(allProjectsData.map((project) => project.category))
  return Array.from(categories)
}

export function getLocalizedProjects(locale: Locale = 'en'): ProjectDetail[] {
  return allProjectsData.map((project) => localizeProject(project, locale))
}

export function getProfessionalProjects(locale: Locale = 'en'): ProjectDetail[] {
  return allProjectsData
    .filter((project) => !project.opensource)
    .map((project) => localizeProject(project, locale))
}

export function getOpenSourceProjects(locale: Locale = 'en'): ProjectDetail[] {
  return allProjectsData
    .filter((project) => project.opensource)
    .map((project) => localizeProject(project, locale))
}

export const projectsData = allProjectsData
