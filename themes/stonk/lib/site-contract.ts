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
  theme: 'energy' | 'infra' | 'ai' | 'libraries' | 'web'
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
