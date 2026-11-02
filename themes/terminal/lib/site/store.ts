// Runtime content store. The whole theme reads its content from /content/site.json
// (fetched once at startup by SiteDataGate); nothing personal is baked into the build.
import type { Locale } from '@/lib/i18n/config'
import { pick, type Localized, type SiteBundle } from './contract'

/** Always the site root, never under this theme's basePath. */
export const SITE_BUNDLE_URL = '/content/site.json'

let bundle: SiteBundle | null = null
let pending: Promise<SiteBundle> | null = null

/** Fetch the bundle once; concurrent and repeated callers share one request. */
export function loadSiteBundle(): Promise<SiteBundle> {
  if (bundle) return Promise.resolve(bundle)
  if (!pending) {
    pending = fetch(SITE_BUNDLE_URL, { cache: 'no-cache' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<SiteBundle>
      })
      .then((data) => {
        if (!data || typeof data !== 'object' || !data.profile || !Array.isArray(data.projects)) {
          throw new Error('malformed bundle')
        }
        bundle = data
        return data
      })
      .catch((error: unknown) => {
        pending = null // allow a retry
        throw error
      })
  }
  return pending
}

export function isSiteLoaded(): boolean {
  return bundle !== null
}

/** Synchronous access for components rendered behind SiteDataGate. */
export function getSite(): SiteBundle {
  if (!bundle) throw new Error('Site bundle not loaded yet: render inside <SiteDataGate>.')
  return bundle
}

/** The UI locale `zh-TW` reads the bundle's `zh` values. */
export function contentLocale(locale: Locale): 'en' | 'zh' {
  return locale === 'zh-TW' ? 'zh' : 'en'
}

export function text(value: Localized | undefined, locale: Locale): string {
  return pick(value, contentLocale(locale)) ?? ''
}

export function list(value: Localized<string[]> | undefined, locale: Locale): string[] {
  const picked = pick(value, contentLocale(locale))
  return picked && picked.length ? picked : value?.en ?? []
}
