// 作品分類：清單只寫在 content/project-themes.json，這裡只負責讀它、提供型別和查詢。
// 作品自己屬於哪些分類，寫在 content/projects/<id>.json 的 themes（第一個是主分類）。
import themesJson from '@/content/project-themes.json'
import type { Project as ContractProject } from '@/lib/content/contract'
import type { Locale } from '@/lib/i18n/config'
import { pick, type Bilingual } from '@/lib/i18n/localize'

/** /content/site.json 舊欄位 theme 接受的值（舊主題只認得這五種）。 */
export type LegacyTheme = ContractProject['theme']

export interface ProjectThemeInfo {
  id: string
  label: Bilingual
  /** app/globals.css 的色票名稱，例如 plum、clip、accent-fill。 */
  color: string
  /** 圓點樣式：dot 實心、ring 空心。同色的兩個分類靠它分辨。 */
  marker: 'dot' | 'ring'
  /** 主分類是這一類時，site.json 的 theme 寫什麼。 */
  legacyTheme: LegacyTheme
}

export const projectThemes = themesJson.themes as ProjectThemeInfo[]

/** 分類 id，照清單順序；作品索引的篩選鈕就是這個順序。 */
export const PROJECT_THEMES = projectThemes.map((theme) => theme.id)

const byId = new Map(projectThemes.map((theme) => [theme.id, theme]))

export function getProjectTheme(id: string): ProjectThemeInfo | undefined {
  return byId.get(id)
}

export function themeLabel(id: string, locale: Locale): string {
  const theme = byId.get(id)
  return theme ? pick(locale, theme.label) : id
}

/** site.json 舊欄位 theme 的值：主分類（第一個）對應回五種舊值之一。 */
export function legacyThemeOf(themes: string[]): LegacyTheme {
  const primary = byId.get(themes[0])
  if (!primary) throw new Error(`Unknown project theme "${themes[0]}"; add it to content/project-themes.json`)
  return primary.legacyTheme
}
