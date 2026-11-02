import type { Locale } from './config'

export function localizedField(locale: Locale, en: string | undefined, zh?: string): string {
  if (locale === 'zh-TW' && zh) return zh
  return en ?? ''
}

export function localizedArray(locale: Locale, en: string[] | undefined, zh?: string[]): string[] {
  if (locale === 'zh-TW' && zh && zh.length) return zh
  return en ?? []
}

/** 資料檔裡的雙語欄位 `{ en, zh }`。 */
export interface Bilingual<T = string> {
  en: T
  zh?: T
}

export function pick<T>(locale: Locale, value: Bilingual<T>): T {
  if (locale === 'zh-TW' && value.zh !== undefined && value.zh !== '') return value.zh
  return value.en
}
