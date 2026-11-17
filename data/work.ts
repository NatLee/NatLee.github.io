// 工作專案（/work）：在公司做的作品依公司分章，加上從那段時期長出來的開源 repo。
// 章節文字、衍生 repo 和它們的來源在 content/work.json（雙語）。章節裡有哪些工作專案不另外列：
// 作品的 company 欄位對到章節涵蓋的經歷（companyIds）的公司或集團名稱，就屬於那一章。
// 衍生 repo 預設來自那間公司；同時期的碩士論文、外包案等其他來源寫在章節的 sources，衍生 repo 用 source 指過去。
// 同一個 repo 可以出現在好幾個章節或來源（例如同時是碩士論文和工作的副產物）。
import workJson from '@/content/work.json'
import type { Locale } from '@/lib/i18n/config'
import { pick, type Bilingual } from '@/lib/i18n/localize'
import { educationData } from './education'
import { experienceData, getExperienceData, type Experience } from './experience'
import { getPinnedRepos } from './github'
import { allProjectsData, getLocalizedProjects, repoOf, type ProjectDetail } from './projects'

/** 衍生 repo 的來源種類：公司（預設）、學校研究、外包案。 */
export type SourceKind = 'company' | 'study' | 'contract'

interface SourceEntry {
  id: string
  kind: Exclude<SourceKind, 'company'>
  label: Bilingual
  note?: Bilingual
  /** study：對到 education.json 的 id，期間從學歷資料來。 */
  educationId?: string
  /** 沒有學歷或經歷資料可推的來源（外包案）才直接寫期間。 */
  start?: string
  end?: string
  /** 期間是大約的（使用者只記得「那時候」）。 */
  approximate?: boolean
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

/** 結束時間只寫年份（"2021"）時算到那年年底，不然一年的東西會畫成零長度。 */
export function endValue(value: string | undefined): number {
  return value && /^\d{4}$/.test(value) ? Number(value) + 11 / 12 : yearValue(value)
}

function rolesOf(entry: ChapterEntry, roles: Experience[]) {
  return roles.filter((role) => entry.companyIds.includes(role.companyId))
}

function periodOf(roles: Experience[]) {
  const starts = roles.map((role) => role.start).sort((a, b) => yearValue(a) - yearValue(b))
  const ends = roles.map((role) => role.end)
  return {
    start: starts[0] ?? '',
    end: ends.includes('Present') ? 'Present' : ends.sort((a, b) => yearValue(b) - yearValue(a))[0] ?? '',
  }
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

/** 來源的期間：學校研究看學歷資料，其他看 work.json 自己寫的。 */
function sourcePeriod(source: SourceEntry) {
  const school = source.educationId ? educationData.find((item) => item.id === source.educationId) : undefined
  return { start: school?.startYear ?? source.start, end: school?.endYear ?? source.end, school }
}

export interface ProjectOrigin {
  /** work：在公司做的；spinoff：從那段時期長出來的開源 repo。 */
  kind: 'work' | 'spinoff'
  chapterId: string
  /** 顯示用的出處：公司名稱，或碩士論文、外包案這類來源。 */
  label: Bilingual
  /** 排序用：出處開始的時間，早的在前。 */
  since: number
}

const origins = new Map<string, ProjectOrigin[]>()
function addOrigin(id: string, origin: ProjectOrigin) {
  const list = origins.get(id) ?? []
  if (!list.some((item) => item.chapterId === origin.chapterId && item.label.en === origin.label.en)) list.push(origin)
  origins.set(id, list.sort((a, b) => a.since - b.since))
}
for (const entry of chapterEntries) {
  const names = companyNames(entry)
  const since = yearValue(periodOf(rolesOf(entry, experienceData)).start)
  for (const project of allProjectsData) {
    if (project.company && names.has(project.company)) addOrigin(project.id, { kind: 'work', chapterId: entry.id, label: { en: entry.name }, since })
  }
  for (const spinoff of entry.spinoffs) {
    const source = spinoff.source ? entry.sources?.find((item) => item.id === spinoff.source) : undefined
    const sourceSince = source ? yearValue(sourcePeriod(source).start) : since
    addOrigin(spinoff.id, { kind: 'spinoff', chapterId: entry.id, label: source?.label ?? { en: entry.name }, since: Number.isFinite(sourceSince) ? sourceSince : since })
  }
}

/** 一個作品的出處，早的在前；在公司做的作品只會有一個 work。 */
export function getProjectOrigins(id: string): ProjectOrigin[] {
  return origins.get(id) ?? []
}

export function isWorkProject(project: Pick<ProjectDetail, 'id'>): boolean {
  return getProjectOrigins(project.id).some((origin) => origin.kind === 'work')
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
  /** 期間（經歷或學歷資料的格式）；沒有資料就不畫。 */
  start?: string
  end?: string
  approximate?: boolean
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
  /** 公司那一組在最前面，其他來源照 work.json 的順序；沒有 repo 但有說明的來源也保留。 */
  spinoffGroups: SpinoffGroup[]
  /** 不重複的衍生 repo 數（同一個 repo 在兩個來源只算一次）。 */
  spinoffCount: number
}

export function getWorkChapters(locale: Locale = 'en'): WorkChapter[] {
  const roles = getExperienceData(locale)
  const projects = getLocalizedProjects(locale)
  const byId = new Map(projects.map((project) => [project.id, project]))
  return chapterEntries.map((entry) => {
    const chapterRoles = rolesOf(entry, roles).sort((a, b) => yearValue(a.start) - yearValue(b.start))
    const { start, end } = periodOf(chapterRoles)

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
      const period = sourcePeriod(source)
      return {
        kind: source.kind,
        label: pick(locale, source.label),
        detail: period.school?.schoolAbbr,
        note: source.note ? pick(locale, source.note) : undefined,
        start: period.start,
        end: period.end,
        approximate: source.approximate,
        spinoffs: spinoffsOf(source.id),
      }
    })

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
        .filter((project) => getProjectOrigins(project.id).some((origin) => origin.kind === 'work' && origin.chapterId === entry.id))
        .sort((a, b) => yearValue(b.timeline.start) - yearValue(a.timeline.start)),
      spinoffGroups: [companyGroup, ...otherGroups].filter((group) => group.spinoffs.length > 0 || group.note),
      spinoffCount: new Set(entry.spinoffs.filter((spinoff) => byId.has(spinoff.id)).map((spinoff) => spinoff.id)).size,
    }
  })
}

/**
 * 代表性的 side project：個人頁置頂、又不是工作專案或衍生專案的作品。
 * flagship 等級的（Telepy）永遠排第一，其餘照置頂順序。
 */
export function getSideProjects(locale: Locale = 'en'): ProjectDetail[] {
  const pinned = getPinnedRepos().map((repo) => repo.toLowerCase())
  const rank = (project: ProjectDetail) => pinned.indexOf(repoOf(project)?.toLowerCase() ?? '')
  return getLocalizedProjects(locale)
    .filter((project) => rank(project) >= 0 && getProjectOrigins(project.id).length === 0)
    .sort((a, b) => Number(b.tier === 'flagship') - Number(a.tier === 'flagship') || rank(a) - rank(b))
}

/** 某段期間開始的代表作（/work 各章的「同時期」），最多 limit 個。 */
export function sideProjectsBetween(start: string, end: string, locale: Locale = 'en', limit = 2): ProjectDetail[] {
  return getSideProjects(locale)
    .filter((project) => {
      const at = yearValue(project.timeline.start)
      return at >= yearValue(start) && at <= endValue(end)
    })
    .slice(0, limit)
}

export interface CareerBar {
  label: string
  start: string
  end: string
  /** 有章節的工作才有，點了跳到那一章。 */
  chapterId?: string
  current?: boolean
  approximate?: boolean
}

export interface CareerLane {
  kind: 'work' | 'study' | 'contract'
  bars: CareerBar[]
}

export interface CareerDot {
  project: ProjectDetail
  /** 出處（公司、碩士論文……），依時間排。 */
  labels: string[]
}

export interface CareerMap {
  lanes: CareerLane[]
  dots: CareerDot[]
  /** 代表性的 side project（個人頁置頂），flagship 在前。 */
  sides: ProjectDetail[]
  /** 時間軸起訖（帶小數的年份）。 */
  start: number
  end: number
  /** 沒有工作、學業或外包的空檔（帶小數的年份），畫的時候壓縮。 */
  gaps: [number, number][]
}

/** 空檔短於這個長度（年）就照實畫，不壓縮。 */
const MIN_GAP = 0.25

/** /work 最上面的多軌時間軸：工作、學業、外包各一軌，衍生 repo 以點標出開始的時間。 */
export function getCareerMap(locale: Locale = 'en'): CareerMap {
  const chapters = getWorkChapters(locale)
  const work: CareerBar[] = [...chapters]
    .sort((a, b) => yearValue(a.start) - yearValue(b.start))
    .map((chapter) => ({ label: chapter.name, start: chapter.start, end: chapter.end, chapterId: chapter.id, current: chapter.end === 'Present' }))

  // 學業和外包：從各章的來源收集，同一個來源只畫一次。
  const seen = new Set<string>()
  const study: CareerBar[] = []
  const contract: CareerBar[] = []
  for (const chapter of chapters) {
    for (const group of chapter.spinoffGroups) {
      if (group.kind === 'company' || !group.start) continue
      const key = `${group.kind}:${group.label}`
      if (seen.has(key)) continue
      seen.add(key)
      const bar = { label: [group.label, group.detail].filter(Boolean).join(' · '), start: group.start, end: group.end ?? group.start, approximate: group.approximate }
      ;(group.kind === 'study' ? study : contract).push(bar)
    }
  }
  const lanes: CareerLane[] = [
    { kind: 'work' as const, bars: work },
    { kind: 'study' as const, bars: study },
    { kind: 'contract' as const, bars: contract },
  ].filter((lane) => lane.bars.length > 0)

  const dotsById = new Map<string, CareerDot>()
  for (const chapter of chapters) {
    for (const group of chapter.spinoffGroups) {
      for (const row of group.spinoffs) {
        const labels = getProjectOrigins(row.project.id).map((origin) => pick(locale, origin.label))
        dotsById.set(row.project.id, { project: row.project, labels })
      }
    }
  }
  const dots = [...dotsById.values()].sort((a, b) => yearValue(a.project.timeline.start) - yearValue(b.project.timeline.start))

  const sides = getSideProjects(locale)

  // 有東西的期間合併起來，中間超過 MIN_GAP 的空白就是空檔。衍生 repo 和 side project 開始的時間點也算「有東西」，
  // 所以落在空檔裡的點會把空檔切開，不會被壓進斷軸。
  const points = [...dots.map((dot) => dot.project), ...sides].map((project): [number, number] => {
    const at = yearValue(project.timeline.start)
    return [at, at]
  })
  const spans = [...lanes.flatMap((lane) => lane.bars.map((bar): [number, number] => [yearValue(bar.start), endValue(bar.end)])), ...points].sort(
    (a, b) => a[0] - b[0]
  )
  const gaps: [number, number][] = []
  let reach = spans[0]?.[1] ?? BUILD_YEAR
  for (const [from, to] of spans.slice(1)) {
    if (from - reach > MIN_GAP) gaps.push([reach, from])
    reach = Math.max(reach, to)
  }
  const start = Math.floor(Math.min(...spans.map((span) => span[0])))
  return { lanes, dots, sides, start, end: BUILD_YEAR, gaps }
}
