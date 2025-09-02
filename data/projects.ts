// 從 JSON 檔案載入專案數據
import projectsJsonData from '@/assets/data/projects.json'
import imageConfigData from '@/assets/data/image-config.json'

export interface ProjectDetail {
  id: string
  title: string
  subtitle: string
  category: 'AI/ML' | 'Web Development' | 'Data Science' | 'Computer Vision' | 'Backend' | 'Open Source' | 'Tool' | 'DevOps' | 'Tools'
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

// 載入所有專案數據
export const allProjectsData: ProjectDetail[] = projectsJsonData.map(project => ({
  ...project,
  thumbnail: project.images[0] || imageConfigData.placeholders.project,
  links: {
    github: project.githubUrl || project.links?.github
  }
})) as ProjectDetail[]

// Helper functions
export function getFeaturedProjects(): ProjectDetail[] {
  return allProjectsData.filter(project => project.featured)
}

export function getProjectById(id: string): ProjectDetail | undefined {
  return allProjectsData.find(project => project.id === id)
}

export function getProjectsByCategory(category: string): ProjectDetail[] {
  return allProjectsData.filter(project => project.category === category)
}

export function getAllCategories(): string[] {
  const categories = new Set(allProjectsData.map(project => project.category))
  return Array.from(categories)
}

// 按類型獲取專案
export function getProfessionalProjects(): ProjectDetail[] {
  return allProjectsData.filter(project => !project.opensource)
}

export function getOpenSourceProjects(): ProjectDetail[] {
  return allProjectsData.filter(project => project.opensource)
}

// 語言顏色輔助函數
export function getLanguageColor(language?: string): string {
  if (!language) return '#6b7280'
  const languageColors = imageConfigData.languageColors as Record<string, string>
  return languageColors[language.toLowerCase()] || '#6b7280'
}

// 向後兼容性
export const projectsData = allProjectsData