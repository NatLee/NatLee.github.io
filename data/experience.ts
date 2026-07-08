import experienceDataJson from '@/assets/data/experience.json'
import experienceZh from '@/assets/data/i18n/experience.zh.json'
import type { Locale } from '@/lib/i18n/config'
import { localizedArray, localizedField } from '@/lib/i18n/localize'

export interface Experience {
  id: string
  title: string
  company: string
  companyId: string
  companyLogo?: string
  department: string
  location: string
  start: string
  end: string
  summary: string
  responsibilities: string[]
  techStack: string[]
  achievements?: string[]
}

type ExperienceZhOverlay = {
  title?: string
  department?: string
  summary?: string
  responsibilities?: string[]
  achievements?: string[]
}

const experienceZhMap = experienceZh as Record<string, ExperienceZhOverlay>

function localizeExperience(entry: Experience, locale: Locale): Experience {
  if (locale !== 'zh-TW') return entry

  const zh = experienceZhMap[entry.id]
  if (!zh) return entry

  return {
    ...entry,
    title: localizedField(locale, entry.title, zh.title),
    department: localizedField(locale, entry.department, zh.department),
    summary: localizedField(locale, entry.summary, zh.summary),
    responsibilities: localizedArray(locale, entry.responsibilities, zh.responsibilities),
    achievements: localizedArray(locale, entry.achievements, zh.achievements),
  }
}

const rawExperience = experienceDataJson as Experience[]

export function getExperienceData(locale: Locale = 'en'): Experience[] {
  return rawExperience.map((entry) => localizeExperience(entry, locale))
}

export const experienceData = rawExperience
