// 工作專案（/work）：在公司做的作品依公司分章，加上從那段時期長出來的開源 repo。
// 章節文字、衍生 repo 和它們的來源在 content/work.json（雙語）。章節裡有哪些工作專案不另外列：
// 作品的 company 欄位對到章節涵蓋的經歷（companyIds）的公司或集團名稱，就屬於那一章。
// 衍生 repo 預設來自那間公司；同時期的碩士論文、外包案等其他來源寫在章節的 sources，衍生 repo 用 source 指過去。
import workJson from '@/content/work.json'
import type { Locale } from '@/lib/i18n/config'
import { pick, type Bilingual } from '@/lib/i18n/localize'
import { educationData } from './education'
import { experienceData, getExperienceData, type Experience } from './experience'
import { allProjectsData, getLocalizedProjects, type ProjectDetail } from './projects'

/** 衍生 repo 的來源種類：公司（預設）、學校研究、外包案。 */
export type SourceKind = 'company' | 'study' | 'contract'

interface SourceEntry {
  id: string
  kind: Exclude<SourceKind, 'company'>
  label: Bilingual
  note?: Bilingual
  /** study：對到 education.json 的 id，期間從學歷資料來。 */
  educationId?: string
}

interface SpinoffEntry {
  id: string
  /** 從另一個衍生 repo 延續下來（後繼版本），就寫那個 repo 的 id。 */
  from?: string
  /** 不是來自公司時，寫 sources 裡的 id。 */
  source?: string
  note: Bilingual
}

interface ChapterEntry {
  id: string
  name: string
  companyIds: string[]
  /** 對應首頁「Where I've been」的時期（personal.json eras 的 period）。 */
  era: string
  title: Bilingual
  summary: Bilingual<string[]>
  sources?: SourceEntry[]
  spinoffs: SpinoffEntry[]
}

const chapterEntries = (workJson as { chapters: ChapterEntry[] }).chapters

/** 建置當月（next.config.js 注入），讓靜態 HTML 和瀏覽器算出一樣的位置。 */
const BUILD_YEAR = (() => {
  const month = process.env.NEXT_PUBLIC_BUILD_MONTH ?? new Date().toISOString().slice(0, 7)
  const [year, m] = month.split('-').map(Number)
  return year + (m - 1) / 12
})()

export const buildYear = BUILD_YEAR

/** "2023.04"、"2024-12"、"2024" 換成帶小數的年份；Present 或空白是建置當月。 */
export function yearValue(value: string | undefined): number {
  if (!value || value === 'Present') return BUILD_YEAR
  const [year, month] = value.split(/[.-]/).map(Number)
  return year + ((month || 1) - 1) / 12
}

function rolesOf(entry: ChapterEntry, roles: Experience[]) {
  return roles.filter((role) => entry.companyIds.includes(role.companyId))
}

/** 章節涵蓋的公司與集團名稱，用來對作品的 company 欄位。 */
function companyNames(entry: ChapterEntry) {
  const names = new Set<string>()
  for (const role of rolesOf(entry, experienceData)) {
    names.add(role.company)
    if (role.group) names.add(role.group)
  }
  return names
}

function sourceOf(entry: ChapterEntry, id?: string) {
  return id ? entry.sources?.find((source) => source.id === id) : undefined
}

export interface ProjectOrigin {
  /** work：在公司做的；spinoff：從那段時期長出來的開源 repo。 */
  kind: 'work' | 'spinoff'
  chapterId: string
  /** 顯示用的出處：公司名稱，或碩士論文、外包案這類來源。 */
  label: Bilingual
}

const origins = new Map<string, ProjectOrigin>()
for (const entry of chapterEntries) {
  const names = companyNames(entry)
  for (const project of allProjectsData) {
    if (project.company && names.has(project.company)) origins.set(project.id, { kind: 'work', chapterId: entry.id, label: { en: entry.name } })
  }
  for (const spinoff of entry.spinoffs) {
    const source = sourceOf(entry, spinoff.source)
    origins.set(spinoff.id, { kind: 'spinoff', chapterId: entry.id, label: source?.label ?? { en: entry.name } })
  }
}

export function getProjectOrigin(id: string): ProjectOrigin | undefined {
  return origins.get(id)
}

export function isWorkProject(project: Pick<ProjectDetail, 'id'>): boolean {
  return origins.get(project.id)?.kind === 'work'
}

/** 經歷頁和首頁用：這間公司（companyId）有沒有一章。 */
export function chapterIdForCompany(companyId: string): string | undefined {
  return chapterEntries.find((entry) => entry.companyIds.includes(companyId))?.id
}

export interface WorkSpinoff {
  project: ProjectDetail
  /** 延續自哪個衍生 repo（同一章裡的作品）。 */
  from?: ProjectDetail
  note: string
}

/** 分支圖的一條主幹：公司，或同時期的學校研究、外包案，以及從它長出來的 repo。 */
export interface SpinoffGroup {
  kind: SourceKind
  label: string
  /** 學校研究加上學校縮寫；公司沒有。 */
  detail?: string
  note?: string
  /** 期間（經歷或學歷資料的格式）；外包案沒有資料就不畫。 */
  start?: string
  end?: string
  spinoffs: WorkSpinoff[]
}

export interface WorkChapter {
  id: string
  name: string
  era: string
  title: string
  summary: string[]
  /** 經歷資料的格式："2019.10"；還在職是 "Present"。 */
  start: string
  end: string
  /** 舊到新。 */
  roles: Experience[]
  projects: ProjectDetail[]
  /** 公司那一組在最前面，其他來源照 work.json 的順序；沒有 repo 的來源也保留，因為它可能有說明。 */
  spinoffGroups: SpinoffGroup[]
  spinoffCount: number
}

export function getWorkChapters(locale: Locale = 'en'): WorkChapter[] {
  const roles = getExperienceData(locale)
  const projects = getLocalizedProjects(locale)
  const byId = new Map(projects.map((project) => [project.id, project]))
  return chapterEntries.map((entry) => {
    const chapterRoles = rolesOf(entry, roles).sort((a, b) => yearValue(a.start) - yearValue(b.start))
    const ends = chapterRoles.map((role) => role.end)
    const start = chapterRoles[0]?.start ?? ''
    const end = ends.includes('Present') ? 'Present' : ends.sort((a, b) => yearValue(b) - yearValue(a))[0] ?? ''

    const spinoffsOf = (sourceId?: string): WorkSpinoff[] =>
      entry.spinoffs
        .filter((spinoff) => spinoff.source === sourceId)
        .flatMap((spinoff) => {
          const project = byId.get(spinoff.id)
          if (!project) return []
          return [{ project, from: spinoff.from ? byId.get(spinoff.from) : undefined, note: pick(locale, spinoff.note) }]
        })

    const companyGroup: SpinoffGroup = { kind: 'company', label: entry.name, start, end, spinoffs: spinoffsOf(undefined) }
    const otherGroups = (entry.sources ?? []).map((source): SpinoffGroup => {
      const school = source.educationId ? educationData.find((item) => item.id === source.educationId) : undefined
      return {
        kind: source.kind,
        label: pick(locale, source.label),
        detail: school?.schoolAbbr,
        note: source.note ? pick(locale, source.note) : undefined,
        start: school?.startYear,
        end: school?.endYear,
        spinoffs: spinoffsOf(source.id),
      }
    })
    const spinoffGroups = [companyGroup, ...otherGroups].filter((group) => group.spinoffs.length > 0 || group.note)

    return {
      id: entry.id,
      name: entry.name,
      era: entry.era,
      title: pick(locale, entry.title),
      summary: pick(locale, entry.summary),
      start,
      end,
      roles: chapterRoles,
      // 新到舊，和章節的順序一致：最上面是那段工作最近做的東西。
      projects: projects
        .filter((project) => origins.get(project.id)?.kind === 'work' && origins.get(project.id)?.chapterId === entry.id)
        .sort((a, b) => yearValue(b.timeline.start) - yearValue(a.timeline.start)),
      spinoffGroups,
      spinoffCount: entry.spinoffs.filter((spinoff) => byId.has(spinoff.id)).length,
    }
  })
}
