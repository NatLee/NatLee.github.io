// /content/site.json 的格式：所有主題（Persimmon 以外的英靈殿主題）在瀏覽器裡讀這份資料。
// The contract for /content/site.json. Every theme reads this file at runtime.
//
// 規則 / Rules
// - 只加欄位，不改名、不刪、不改型別。舊主題的程式是凍結的，改了它們就壞。
//   Additive changes only: never rename, remove or retype a field.
// - 這個檔案會被複製到 themes/<name>/ 裡；改了這裡要同步那些副本。
//   Copied into themes/<name>/; keep the copies in sync.

export const SCHEMA_VERSION = 1

/** 雙語文字；zh 沒有就退回 en。 */
export interface Localized<T = string> {
  en: T
  zh?: T
}

export interface SiteBundle {
  schemaVersion: 1
  generatedAt: string
  siteUrl: string
  profile: Profile
  projects: Project[]
  /** 作品分類清單，照網站上的順序。Project.themes 裡的 id 都在這裡。（2026-11 新增） */
  projectThemes?: ProjectTheme[]
  experience: Role[]
  education: Education[]
  skills: SkillCategory[]
  opensource: {
    upstream: { repo: string; url: string; count: number; summary: Localized }[]
    packages: { name: string; repo: string; url: string; project?: string; stars?: number; summary: Localized }[]
  }
  writing: { title: Localized; description: Localized; source: string; url: string }[]
  mascots: Record<string, Mascot>
}

/**
 * 流程圖的一步。步驟照順序由上到下；判斷（decision）一定有 branch，
 * 從旁邊走到另一個步驟：往前是重來，往後是略過。（2026-11 新增）
 */
export interface FlowStep {
  id: string
  label: string
  /** start、end 是起點和終點，decision 是判斷；沒寫就是一般步驟。 */
  kind?: 'start' | 'end' | 'decision'
  detail?: string
  /** 往下一步的箭頭上寫的字。 */
  next?: string
  /** 判斷往旁邊走的那條路：when 是條件，to 是要去的步驟 id。 */
  branch?: { when: string; to: string }
}

/** 架構圖節點的種類，決定圖示。（2026-11 新增） */
export type ArchitectureKind = 'user' | 'screen' | 'app' | 'server' | 'data' | 'external' | 'device' | 'model' | 'file'

/** 架構圖的一個節點。（2026-11 新增） */
export interface ArchitectureNode {
  id: string
  title: string
  items: string[]
  kind?: ArchitectureKind
  core?: boolean
  /** 只連到下一層的哪幾個節點（id）；沒寫就全部都連。 */
  to?: string[]
}

/**
 * 架構圖的一層。只有一個節點時，title、items、kind 就是那個節點；
 * 有 nodes 時，這一層有好幾個並排的節點，title 是這一層的標題。
 * 相鄰兩層預設全部互連；core 標出這個作品本身（節點或整層）。
 */
export interface ArchitectureStep {
  title: string
  items: string[]
  /** 往下一層的箭頭上寫的字；最後一層沒有。 */
  next?: string
  /** 這一層（或這個節點）就是這個作品本身。 */
  core?: boolean
  /** 只有一個節點時的圖示種類。（2026-11 新增） */
  kind?: ArchitectureKind
  /** 只有一個節點時的 id，給上一層的 to 用。（2026-11 新增） */
  id?: string
  /** 只有一個節點時，只連到下一層的哪幾個節點。（2026-11 新增） */
  to?: string[]
  /** 這一層並排的節點。（2026-11 新增） */
  nodes?: ArchitectureNode[]
}

export interface ProjectTheme {
  id: string
  label: Localized
}

export interface Profile {
  /** 顯示用名字，例如 "Nat Lee"。 */
  name: string
  fullName: string
  headline: Localized
  location: Localized
  email: string
  avatar: string
  careerStartYear: number
  /** lead 裡用 **雙星號** 標出強調的片語。 */
  tagline: Localized<{ lead: string; sub: string }>
  description: Localized
  now: Localized
  story: Localized<string[]>
  howIWork: Localized
  tools: string[]
  eras: { period: string; title: Localized; note: Localized }[]
  languages: { name: Localized; level: Localized; note: Localized }[]
  socials: { name: string; url: string; icon: string }[]
}

export interface Project {
  id: string
  /** Persimmon 上的完整頁面。 */
  url: string
  title: Localized
  subtitle: Localized
  description: Localized
  longDescription: Localized
  /** 主分類對應到的舊分類（只有這五種）。要完整分類請讀 themes。 */
  theme: 'energy' | 'infra' | 'ai' | 'libraries' | 'web'
  /** 作品所屬的分類 id，第一個是主分類；名稱在 SiteBundle.projectThemes。（2026-11 新增） */
  themes?: string[]
  tier: 'flagship' | 'selected' | 'archive'
  category: string
  status: 'Completed' | 'In Progress' | 'Archived'
  role: Localized
  start: string
  end?: string
  language?: string
  technologies: string[]
  features: Localized<string[]>
  challenges: Localized<string[]>
  solutions: Localized<string[]>
  results: Localized<string[]>
  /** 為什麼做這個作品。（2026-11 新增） */
  why?: Localized
  /** 簡單的架構圖：由左到右的幾步，中英文步數相同。（2026-11 新增） */
  architecture?: Localized<ArchitectureStep[]>
  /** 能帶來什麼：幫了誰、省了什麼。（2026-11 新增） */
  gains?: Localized
  /** 學到什麼，1–3 點，中英文點數相同。（2026-11 新增） */
  lessons?: Localized<string[]>
  /** 流程圖：由上到下的步驟，中英文步數相同。（2026-11 新增） */
  flow?: Localized<FlowStep[]>
  images: string[]
  /** 本地縮圖（/images/projects/<id>.webp），沒有就不給。 */
  thumbnail?: string
  links: { github?: string; demo?: string; pypi?: string; documentation?: string; article?: string }
  stars?: number
}

export interface Role {
  id: string
  title: Localized
  company: string
  group?: string
  parentCompany?: string
  roleType?: 'join' | 'promotion' | 'transfer'
  department: Localized
  location: string
  assignment?: { location: Localized; start: string; end: string; note: Localized }
  start: string
  end: string
  summary: Localized
  responsibilities: Localized<string[]>
  achievements: Localized<string[]>
  techStack: string[]
}

export interface Education {
  id: string
  school: Localized
  degree: Localized
  major: Localized
  minor?: Localized
  start: string
  end: string
}

export interface SkillCategory {
  id: string
  name: Localized
  skills: { name: string; level: string; years?: number; description: Localized }[]
}

export interface Mascot {
  name: Localized
  kind: 'sprite' | 'images'
  about: Localized
  /** kind = images 時的表情圖（網站根目錄的絕對路徑）。 */
  images?: string[]
  /** 台詞；某個語言沒有就用另一個。 */
  lines: { en?: string[]; zh?: string[] }
}

/** 主題用的小工具：依語言取值，zh 沒有就退回 en。 */
export function pick<T>(value: Localized<T> | undefined, locale: 'en' | 'zh' = 'en'): T | undefined {
  if (!value) return undefined
  return locale === 'zh' && value.zh !== undefined ? value.zh : value.en
}
