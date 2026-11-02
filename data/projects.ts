// 專案資料：每個專案一個 JSON（content/projects/<id>.json），順序由 projects-list.ts 決定。
import { projectsJsonData } from './projects-list'
import projectsZh from '@/content/i18n/projects.zh.json'
import thumbnails from '@/content/_generated/thumbnails.json'
import type { Locale } from '@/lib/i18n/config'
import { localizedArray, localizedField } from '@/lib/i18n/localize'
import { getRepoStats } from './github'

export type ProjectCategory =
  | 'AI/ML'
  | 'Web Development'
  | 'Data Science'
  | 'Computer Vision'
  | 'Backend'
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

/** 五個主題，作品索引用來篩選。顯示名稱在 messages 的 projects.themes.*。 */
export const PROJECT_THEMES = ['energy', 'infra', 'ai', 'libraries', 'web'] as const
export type ProjectTheme = (typeof PROJECT_THEMES)[number]

/** flagship = Telepy（首頁獨立區塊）；selected = 精選卡片；archive = 其他（列表）。 */
export type ProjectTier = 'flagship' | 'selected' | 'archive'

export interface ProjectDetail {
  id: string
  title: string
  subtitle: string
  category: ProjectCategory
  theme: ProjectTheme
  tier: ProjectTier
  status: 'Completed' | 'In Progress' | 'Archived'
  opensource?: boolean
  /** 本地縮圖（scripts/make-thumbs.mjs 產生），沒有就是 undefined。 */
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
    pypi?: string
    article?: string
    documentation?: string
  }
  timeline: {
    start: string
    end?: string
    duration?: string
  }
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
const thumbnailMap = thumbnails as Record<string, string>

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

// 舊專案的 JSON 不一定每個陣列欄位都有，在這裡補成空陣列，元件就不必處處檢查。
export const allProjectsData: ProjectDetail[] = projectsJsonData.map((project) => ({
  ...project,
  images: project.images ?? [],
  technologies: project.technologies ?? [],
  features: project.features ?? [],
  challenges: project.challenges ?? [],
  solutions: project.solutions ?? [],
  results: project.results ?? [],
  timeline: project.timeline ?? { start: '' },
  thumbnail: thumbnailMap[project.id],
  links: {
    ...project.links,
    github: project.githubUrl || project.links?.github,
  },
})) as ProjectDetail[]

export function getLocalizedProjects(locale: Locale = 'en'): ProjectDetail[] {
  return allProjectsData.map((project) => localizeProject(project, locale))
}

export function getProjectById(id: string, locale: Locale = 'en'): ProjectDetail | undefined {
  const project = allProjectsData.find((item) => item.id === id)
  return project ? localizeProject(project, locale) : undefined
}

export function getProjectsByTier(tier: ProjectTier, locale: Locale = 'en'): ProjectDetail[] {
  return getLocalizedProjects(locale).filter((project) => project.tier === tier)
}

/** 同主題的其他專案，精選優先。 */
export function getRelatedProjects(project: ProjectDetail, locale: Locale = 'en', limit = 3): ProjectDetail[] {
  const tierRank: Record<ProjectTier, number> = { flagship: 0, selected: 1, archive: 2 }
  return getLocalizedProjects(locale)
    .filter((item) => item.id !== project.id && item.theme === project.theme)
    .sort((a, b) => tierRank[a.tier] - tierRank[b.tier])
    .slice(0, limit)
}

/** GitHub 的 owner/repo，從 githubUrl 解析。 */
export function repoOf(project: Pick<ProjectDetail, 'githubUrl' | 'links'>): string | undefined {
  const url = project.githubUrl || project.links?.github
  const match = url?.match(/github\.com\/([^/]+\/[^/#?]+)/i)
  return match ? match[1].replace(/\.git$/, '') : undefined
}

export function getProjectStars(project: Pick<ProjectDetail, 'githubUrl' | 'links'>): number | undefined {
  const repo = repoOf(project)
  return repo ? getRepoStats(repo)?.stars : undefined
}

/** 起始年份（timeline.start 是 "2024-02" 或 "2024"）。 */
export function projectYear(project: ProjectDetail): string {
  return project.timeline?.start?.slice(0, 4) ?? ''
}

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
  'Utilities': '公用程式',
  'Productivity Tools': '生產力工具',
}

export function localizeCategory(category: string, locale: Locale = 'en'): string {
  if (locale !== 'zh-TW') return category
  return categoryLabelsZh[category] ?? category
}
