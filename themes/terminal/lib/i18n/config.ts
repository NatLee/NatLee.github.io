export const locales = ['en', 'zh-TW'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  'zh-TW': '中文',
}

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}
