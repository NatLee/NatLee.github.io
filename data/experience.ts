import experienceDataJson from '@/assets/data/experience.json'
import experienceZh from '@/assets/data/i18n/experience.zh.json'
import type { Locale } from '@/lib/i18n/config'
import { localizedArray, localizedField } from '@/lib/i18n/localize'

/** Temporary posting away from the role's home office (e.g. an overseas stint). */
export interface ExperienceAssignment {
  location: string
  start: string
  end: string
  note?: string
}

export interface Experience {
  id: string
  title: string
  company: string
  companyId: string
  companyLogo?: string
  /** Corporate group used to merge roles across legal entities into one timeline. */
  group?: string
  /** Parent company shown when this role sits inside a subsidiary. */
  parentCompany?: string
  /** Career transition into this role — drives the timeline badge. */
  roleType?: 'join' | 'promotion' | 'transfer'
  department: string
  location: string
  /** Overseas/on-site posting held while in this role. */
  assignment?: ExperienceAssignment
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
  assignment?: { location?: string; note?: string }
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
    assignment: entry.assignment && {
      ...entry.assignment,
      location: localizedField(locale, entry.assignment.location, zh.assignment?.location),
      note: entry.assignment.note
        ? localizedField(locale, entry.assignment.note, zh.assignment?.note)
        : undefined,
    },
  }
}

const rawExperience = experienceDataJson as Experience[]

export function getExperienceData(locale: Locale = 'en'): Experience[] {
  return rawExperience.map((entry) => localizeExperience(entry, locale))
}

export const experienceData = rawExperience
