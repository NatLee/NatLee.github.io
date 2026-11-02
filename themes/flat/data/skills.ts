// Skill view models, read from the runtime bundle (see lib/site.ts).
import { derived, en } from '@/lib/site'

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

export const getSkills = derived<SkillCategory[]>(({ skills }) =>
  (skills ?? []).map((c) => ({
    id: c.id,
    name: en(c.name, c.id),
    skills: (c.skills ?? []).map((s) => ({
      name: s.name,
      level: s.level,
      years: s.years,
      description: en(s.description, ''),
    })),
  })),
)

/** The "specialization" category if there is one, else the last category. */
export function getSpecializations(limit: number): string[] {
  const categories = getSkills()
  const special = categories.find((c) => c.id === 'specialization') ?? categories[categories.length - 1]
  return (special?.skills ?? []).slice(0, limit).map((s) => s.name)
}
