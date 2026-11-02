// Experience accessors over the runtime bundle (see lib/site/store.ts).
import type { Locale } from '@/lib/i18n/config'
import { getSite, list, text } from '@/lib/site/store'

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

export function getExperienceData(locale: Locale = 'en'): Experience[] {
  return getSite().experience.map((role) => ({
    id: role.id,
    title: text(role.title, locale),
    company: role.company,
    group: role.group,
    parentCompany: role.parentCompany,
    roleType: role.roleType,
    department: text(role.department, locale),
    location: role.location,
    assignment: role.assignment && {
      location: text(role.assignment.location, locale),
      start: role.assignment.start,
      end: role.assignment.end,
      note: text(role.assignment.note, locale) || undefined,
    },
    start: role.start,
    end: role.end,
    summary: text(role.summary, locale),
    responsibilities: list(role.responsibilities, locale),
    techStack: role.techStack ?? [],
    achievements: list(role.achievements, locale),
  }))
}
