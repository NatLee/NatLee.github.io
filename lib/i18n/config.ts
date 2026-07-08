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

/**
 * Map a single BCP-47 language tag (e.g. "zh-Hant-TW", "en-US") to a supported
 * locale, or undefined when none of our locales cover it. Traditional Chinese is
 * the only Chinese variant we ship, so every `zh-*` tag resolves to it.
 */
export function matchLocale(tag: string): Locale | undefined {
  if (isLocale(tag)) return tag
  const primary = tag.toLowerCase().split('-')[0]
  if (primary === 'zh') return 'zh-TW'
  if (primary === 'en') return 'en'
  return undefined
}

/**
 * Detect the best supported locale from the browser's language preferences,
 * respecting the user's ordered `navigator.languages` list. Returns undefined
 * when no preference maps to a supported locale (caller falls back to default).
 */
export function detectBrowserLocale(): Locale | undefined {
  if (typeof navigator === 'undefined') return undefined
  const preferences =
    Array.isArray(navigator.languages) && navigator.languages.length > 0
      ? navigator.languages
      : navigator.language
        ? [navigator.language]
        : []
  for (const tag of preferences) {
    const matched = matchLocale(tag)
    if (matched) return matched
  }
  return undefined
}
