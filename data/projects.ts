// 專案資料：每個專案一個 JSON（content/projects/<id>.json），順序由 projects-list.ts 決定。
import { projectsJsonData } from './projects-list'
import projectsZh from '@/content/i18n/projects.zh.json'
import thumbnails from '@/content/_generated/thumbnails.json'
import type { Locale } from '@/lib/i18n/config'
import { localizedArray, localizedField } from '@/lib/i18n/localize'
import type { ArchitectureStep, FlowStep } from '@/lib/content/contract'
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

export type { ArchitectureKind, ArchitectureNode, ArchitectureStep, FlowLink, FlowStep } from '@/lib/content/contract'

/** 中文的流程圖：照英文的順序寫，只換字；id、kind、branch.to、to 的 id 只寫在英文。 */
type FlowStepZh = { label?: string; detail?: string; next?: string; group?: string; branch?: { when?: string }; to?: { label?: string }[] }

/** 流程圖的一條線。back 表示往回走（目標在前面），畫成虛線。 */
export interface FlowEdge {
  from: string
  to: string
  label?: string
  back: boolean
}

/**
 * 從步驟推出所有的線：有 to 就照 to；沒有就接到下一步（end 不接）；舊格式的 branch 再多一條。
 * 作品頁畫圖和 npm test 檢查都用同一套規則。
 */
export function flowEdges(steps: FlowStep[]): FlowEdge[] {
  const order = new Map(steps.map((step, index) => [step.id, index]))
  const edges: FlowEdge[] = []
  const add = (from: FlowStep, to: string, label?: string) => edges.push({ from: from.id, to, label, back: (order.get(to) ?? 0) <= (order.get(from.id) ?? 0) })
  steps.forEach((step, index) => {
    if (step.to) step.to.forEach((link) => add(step, link.id, link.label))
    else if (step.kind !== 'end' && index < steps.length - 1) add(step, steps[index + 1].id, step.next)
    if (step.branch) add(step, step.branch.to, step.branch.when)
  })
  return edges
}

/** 流程圖「跑一遍」走過的路：path 是依序經過的步驟，via[i] 是從 path[i] 走到 path[i + 1] 用的線（flowEdges 的索引）。 */
export interface FlowWalk {
  path: string[]
  via: number[]
}

/**
 * 從開始那一步（沒有就用第一步）沿著線走，走到沒有路為止。
 * 有好幾條路時，第 play 次播放選第 play 條（除以路數取餘數），所以每按一次就換條路走。
 * 同一條線一趟只走一次，迴圈最多繞一圈；再保險一點，最多走步數的兩倍。
 */
export function walkFlow(steps: FlowStep[], edges: FlowEdge[], play: number): FlowWalk {
  const start = steps.find((step) => step.kind === 'start') ?? steps[0]
  const taken = new Set<number>()
  const walk: FlowWalk = { path: [start.id], via: [] }
  while (walk.path.length <= steps.length * 2) {
    const here = walk.path[walk.path.length - 1]
    const outs = edges.flatMap((edge, index) => (edge.from === here && !taken.has(index) ? [index] : []))
    if (!outs.length) break
    const pick = outs[play % outs.length]
    taken.add(pick)
    walk.via.push(pick)
    walk.path.push(edges[pick].to)
  }
  return walk
}

/** 把中文的流程圖疊到英文上：步數不一樣就用英文（npm test 會擋下這種情況）。作品頁和 site.json 共用。 */
export function localizeFlow(en: FlowStep[], zh?: FlowStepZh[]): FlowStep[] {
  if (!zh || zh.length !== en.length) return en
  return en.map((step, index) => {
    const z = zh[index]
    return {
      ...step,
      label: z.label || step.label,
      ...(step.detail ? { detail: z.detail || step.detail } : {}),
      ...(step.next ? { next: z.next || step.next } : {}),
      ...(step.branch ? { branch: { ...step.branch, when: z.branch?.when || step.branch.when } } : {}),
      ...(step.group ? { group: z.group || step.group } : {}),
      ...(step.to ? { to: step.to.map((link, i) => ({ ...link, ...(link.label ? { label: z.to?.[i]?.label || link.label } : {}) })) } : {}),
    }
  })
}

/** 中文的一個節點：照英文的順序寫，只換字；id、kind、core、to 只寫在英文。 */
interface ArchitectureTextZh {
  title?: string
  items?: string[]
}
type ArchitectureStepZh = ArchitectureTextZh & { next?: string; nodes?: ArchitectureTextZh[] }

/** 把一個節點的中文疊上去（沒寫的欄位用英文）。 */
function localizeText<T extends { title: string; items: string[] }>(en: T, zh?: ArchitectureTextZh): T {
  return { ...en, title: zh?.title || en.title, items: zh?.items?.length ? zh.items : en.items }
}

/**
 * 把中文的架構圖疊到英文上：層數或節點數不一樣就用英文（npm test 會擋下這種情況）。
 * 作品頁和 site.json 都用它，兩邊的結果才會一樣。
 */
export function localizeArchitecture(en: ArchitectureStep[], zh?: ArchitectureStepZh[]): ArchitectureStep[] {
  if (!zh || zh.length !== en.length) return en
  return en.map((step, index) => {
    const z = zh[index]
    const nodes = step.nodes && z.nodes?.length === step.nodes.length ? step.nodes.map((node, i) => localizeText(node, z.nodes![i])) : step.nodes
    return {
      ...localizeText(step, z),
      next: step.next === undefined ? undefined : z.next || step.next,
      ...(nodes ? { nodes } : {}),
    }
  })
}

/** flagship = Telepy（首頁獨立區塊）；selected = 精選卡片；archive = 其他（列表）。 */
export type ProjectTier = 'flagship' | 'selected' | 'archive'

export interface ProjectDetail {
  id: string
  title: string
  subtitle: string
  category: ProjectCategory
  /** 所屬分類（content/project-themes.json 的 id），第一個是主分類。 */
  themes: string[]
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
  /** 為什麼做這個作品（作品頁「為什麼做這個」）。 */
  why?: string
  /** 簡單的架構圖（作品頁「架構」）。 */
  architecture?: ArchitectureStep[]
  /** 能帶來什麼（作品頁「能帶來什麼」）。 */
  gains?: string
  /** 學到什麼，1–3 點（作品頁「學到什麼」）。 */
  lessons?: string[]
  /** 流程圖（作品頁「流程」）。 */
  flow?: FlowStep[]
  /** 每張圖的說明，順序和 images 一樣；封面通常是空字串。 */
  imageCaptions?: string[]
}

export type ProjectZhOverlay = Partial<
  Pick<
    ProjectDetail,
    'title' | 'subtitle' | 'description' | 'longDescription' | 'role' | 'features' | 'challenges' | 'solutions' | 'results' | 'why' | 'gains' | 'lessons' | 'imageCaptions'
  >
> & { architecture?: ArchitectureStepZh[]; flow?: FlowStepZh[] }

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
    why: project.why && localizedField(locale, project.why, zh.why),
    architecture: project.architecture && localizeArchitecture(project.architecture, zh.architecture),
    gains: project.gains && localizedField(locale, project.gains, zh.gains),
    lessons: project.lessons && localizedArray(locale, project.lessons, zh.lessons),
    flow: project.flow && localizeFlow(project.flow, zh.flow),
    imageCaptions: project.imageCaptions && localizedArray(locale, project.imageCaptions, zh.imageCaptions),
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

/** 和這個作品同分類的其他作品：共同分類多的優先，再來是精選優先。 */
export function getRelatedProjects(project: ProjectDetail, locale: Locale = 'en', limit = 3): ProjectDetail[] {
  const tierRank: Record<ProjectTier, number> = { flagship: 0, selected: 1, archive: 2 }
  const shared = (item: ProjectDetail) => item.themes.filter((theme) => project.themes.includes(theme)).length
  return getLocalizedProjects(locale)
    .filter((item) => item.id !== project.id && shared(item) > 0)
    .sort((a, b) => shared(b) - shared(a) || tierRank[a.tier] - tierRank[b.tier])
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
