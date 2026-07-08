import type { Locale } from './config'

export function localizedField(
  locale: Locale,
  en: string | undefined,
  zh?: string
): string {
  if (locale === 'zh-TW' && zh) return zh
  return en ?? ''
}

export function localizedArray(
  locale: Locale,
  en: string[] | undefined,
  zh?: string[]
): string[] {
  if (locale === 'zh-TW' && zh?.length) return zh
  return en ?? []
}
