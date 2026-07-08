import educationDataJson from '@/assets/data/education.json'
import educationZh from '@/assets/data/i18n/education.zh.json'
import type { Locale } from '@/lib/i18n/config'
import { localizedField } from '@/lib/i18n/localize'

export interface Education {
  id: string
  school: string
  schoolEn: string
  degree: string
  major: string
  minor?: string
  startYear: string
  endYear: string
  logo?: string
  achievements?: string[]
}

type EducationZhOverlay = {
  degree?: string
  major?: string
  minor?: string
}

const educationZhMap = educationZh as Record<string, EducationZhOverlay>

function localizeEducation(entry: Education, locale: Locale): Education {
  if (locale !== 'zh-TW') return entry

  const zh = educationZhMap[entry.id]
  if (!zh) return entry

  return {
    ...entry,
    degree: localizedField(locale, entry.degree, zh.degree),
    major: localizedField(locale, entry.major, zh.major),
    minor: localizedField(locale, entry.minor, zh.minor),
  }
}

const rawEducation = educationDataJson as Education[]

export function getEducationData(locale: Locale = 'en'): Education[] {
  return rawEducation.map((entry) => localizeEducation(entry, locale))
}

export const educationData = rawEducation
