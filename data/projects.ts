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
