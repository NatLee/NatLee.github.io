// Runtime content store. The bundle is fetched once from the site root by <SiteProvider>;
// after that gate, every accessor in data/*.ts reads it synchronously through getSite().
import { pick, type Localized, type SiteBundle } from './site-contract'

/** Absolute on purpose: the bundle lives at the site root, not under this theme's basePath. */
export const SITE_URL = '/content/site.json'

let bundle: SiteBundle | null = null
let pending: Promise<SiteBundle> | null = null

export function loadSite(): Promise<SiteBundle> {
  if (bundle) return Promise.resolve(bundle)
  if (!pending) {
    pending = fetch(SITE_URL, { cache: 'no-cache' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} while fetching ${SITE_URL}`)
        return res.json() as Promise<SiteBundle>
      })
      .then((data) => {
        if (!data || typeof data !== 'object' || !data.profile) throw new Error('site.json is missing its profile')
        bundle = data
        return data
      })
      .catch((err) => {
        pending = null // allow a retry
        throw err
      })
  }
  return pending
}

export function getSite(): SiteBundle {
  if (!bundle) throw new Error('Site content read before it was loaded')
  return bundle
}

/** The theme has no language switch, so it always shows the English side. */
export function en<T>(value: Localized<T> | undefined, fallback: T): T {
  return pick(value, 'en') ?? fallback
}

/** Memoise a derived view of the bundle; recomputed only if the bundle object changes. */
export function derived<T>(build: (site: SiteBundle) => T): () => T {
  let source: SiteBundle | null = null
  let value: T
  return () => {
    const site = getSite()
    if (site !== source) {
      value = build(site)
      source = site
    }
    return value
  }
}

/** "a", "a and b", "a, b, and c" */
export function joinList(items: string[]): string {
  if (items.length <= 1) return items.join('')
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}
