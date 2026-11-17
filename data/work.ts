// 工作專案（/work）：在公司做的作品依公司分章，加上從那段工作長出來的開源 repo。
// 章節文字與衍生 repo 在 content/work.json（雙語）。章節裡有哪些工作專案不另外列：
// 作品的 company 欄位對到章節涵蓋的經歷（companyIds）的公司或集團名稱，就屬於那一章。
import workJson from '@/content/work.json'
import type { Locale } from '@/lib/i18n/config'
import { pick, type Bilingual } from '@/lib/i18n/localize'
import { experienceData, getExperienceData, groupRoles, type Experience } from './experience'
import { allProjectsData, getLocalizedProjects, type ProjectDetail } from './projects'

interface SpinoffEntry {
  id: string
  /** 從另一個衍生 repo 延續下來（後繼版本），就寫那個 repo 的 id。 */
  from?: string
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

export interface ProjectOrigin {
  /** work：在公司做的；spinoff：從那段工作長出來的開源 repo。 */
  kind: 'work' | 'spinoff'
  chapterId: string
  name: string
}

const origins = new Map<string, ProjectOrigin>()
for (const entry of chapterEntries) {
  const names = companyNames(entry)
  for (const project of allProjectsData) {
    if (project.company && names.has(project.company)) origins.set(project.id, { kind: 'work', chapterId: entry.id, name: entry.name })
  }
  for (const spinoff of entry.spinoffs) origins.set(spinoff.id, { kind: 'spinoff', chapterId: entry.id, name: entry.name })
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
  spinoffs: WorkSpinoff[]
}

export function getWorkChapters(locale: Locale = 'en'): WorkChapter[] {
  const roles = getExperienceData(locale)
  const projects = getLocalizedProjects(locale)
  const byId = new Map(projects.map((project) => [project.id, project]))
  return chapterEntries.map((entry) => {
    const chapterRoles = rolesOf(entry, roles).sort((a, b) => yearValue(a.start) - yearValue(b.start))
    const ends = chapterRoles.map((role) => role.end)
    return {
      id: entry.id,
      name: entry.name,
      era: entry.era,
      title: pick(locale, entry.title),
      summary: pick(locale, entry.summary),
      start: chapterRoles[0]?.start ?? '',
      end: ends.includes('Present') ? 'Present' : ends.sort((a, b) => yearValue(b) - yearValue(a))[0] ?? '',
      roles: chapterRoles,
      // 新到舊，和章節的順序一致：最上面是那段工作最近做的東西。
      projects: projects
        .filter((project) => origins.get(project.id)?.kind === 'work' && origins.get(project.id)?.chapterId === entry.id)
        .sort((a, b) => yearValue(b.timeline.start) - yearValue(a.timeline.start)),
      spinoffs: entry.spinoffs.flatMap((spinoff) => {
        const project = byId.get(spinoff.id)
        if (!project) return []
        return [{ project, from: spinoff.from ? byId.get(spinoff.from) : undefined, note: pick(locale, spinoff.note) }]
      }),
    }
  })
}

export interface CareerSpan {
  name: string
  start: string
  end: string
  chapterId?: string
}

/** 職涯時間帶：每個公司（集團）一段，有章節的可以點。 */
export function getCareerSpans(): CareerSpan[] {
  return groupRoles(experienceData).map((group) => {
    const starts = group.roles.map((role) => role.start).sort((a, b) => yearValue(a) - yearValue(b))
    const ends = group.roles.map((role) => role.end)
    return {
      name: group.name,
      start: starts[0],
      end: ends.includes('Present') ? 'Present' : ends.sort((a, b) => yearValue(b) - yearValue(a))[0],
      chapterId: group.roles.map((role) => chapterIdForCompany(role.companyId)).find(Boolean),
    }
  })
}

/** 首頁時期對應的章節（用 era 的 period 字串對）。 */
export function chapterForEra(period: string, locale: Locale = 'en'): WorkChapter | undefined {
  return getWorkChapters(locale).find((chapter) => chapter.era === period)
}
