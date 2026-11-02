// Skill accessors over the runtime bundle (see lib/site/store.ts).
import type { Locale } from '@/lib/i18n/config'
import { getSite, text } from '@/lib/site/store'

export interface SkillCategory {
  id: string
  name: string
  skills: Skill[]
}

export interface Skill {
  name: string
  level: string
  years?: number
  description?: string
}

export function getSkillsData(locale: Locale = 'en'): SkillCategory[] {
  return getSite().skills.map((category) => ({
    id: category.id,
    name: text(category.name, locale),
    skills: category.skills.map((skill) => ({
      name: skill.name,
      level: skill.level,
      years: skill.years,
      description: text(skill.description, locale),
    })),
  }))
}
