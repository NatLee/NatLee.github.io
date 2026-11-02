// Skills view model, adapted from the runtime bundle (/content/site.json).
import { pick, type SkillCategory as BundleSkillCategory } from '@/lib/site-contract'

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

export function toSkillCategory(category: BundleSkillCategory): SkillCategory {
  return {
    id: category.id,
    name: pick(category.name) ?? '',
    skills: (category.skills ?? []).map((s) => ({
      name: s.name,
      level: s.level,
      years: s.years,
      description: pick(s.description),
    })),
  }
}
