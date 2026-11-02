// Education accessors over the runtime bundle (see lib/site/store.ts).
import type { Locale } from '@/lib/i18n/config'
import { getSite, text } from '@/lib/site/store'

export interface Education {
  id: string
  /** School name in the current locale. */
  school: string
  /** School name in English (the card title always shows this one). */
  schoolEn: string
  degree: string
  major: string
  minor?: string
  startYear: string
  endYear: string
}

export function getEducationData(locale: Locale = 'en'): Education[] {
  return getSite().education.map((entry) => ({
    id: entry.id,
    school: text(entry.school, locale),
    schoolEn: entry.school.en,
    degree: text(entry.degree, locale),
    major: text(entry.major, locale),
    minor: entry.minor ? text(entry.minor, locale) : undefined,
    startYear: entry.start,
    endYear: entry.end,
  }))
}
