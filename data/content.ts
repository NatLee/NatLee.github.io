// 首頁與各頁共用的小型內容檔：上游貢獻與 PyPI 套件、文章、英靈殿、Telepy 案例。
import opensourceJson from '@/content/opensource.json'
import writingJson from '@/content/writing.json'
import valhallaJson from '@/content/valhalla.json'
import telepyCaseJson from '@/content/case-studies/telepy.json'
import type { Bilingual } from '@/lib/i18n/localize'

export interface UpstreamContribution {
  repo: string
  url: string
  count: number
  summary: Bilingual
}

export interface PypiPackage {
  name: string
  repo: string
  project?: string
  url: string
  summary: Bilingual
}

export const opensource = opensourceJson as { upstream: UpstreamContribution[]; packages: PypiPackage[] }

export interface WritingItem {
  title: Bilingual
  description: Bilingual
  source: string
  url: string
}

export const writing = writingJson as WritingItem[]

/** 英靈殿裡的一個主題（同一份內容的另一種外觀）。 */
export interface ValhallaEntry {
  id: string
  name: string
  /** 這個外觀第一次出現的年份。 */
  since: string
  stack: string
  cover: string
  side?: boolean
  thesis: Bilingual
  note: Bilingual
}

export const valhalla = valhallaJson as ValhallaEntry[]

export interface TelepyCaseStudy {
  tagline: Bilingual
  banner: string
  stats: { value: string; label: Bilingual }[]
  problem: Bilingual<string[]>
  architecture: {
    browser: Bilingual
    server: Bilingual
    parts: { name: string; note: Bilingual }[]
    tunnel: Bilingual
    device: Bilingual
    lan: Bilingual
  }
  featureGroups: { title: Bilingual; image: string; items: Bilingual[] }[]
  benchmark: {
    intro: Bilingual
    rows: { metric: Bilingual; before: string; after: string; change: string }[]
    source: string
  }
  reading: { title: Bilingual; url: string }[]
}

export const telepyCase = telepyCaseJson as TelepyCaseStudy
