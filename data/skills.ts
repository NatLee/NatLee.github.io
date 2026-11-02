// 技能：content/skills.json；中文在 content/i18n/skills.zh.json（分類名稱 + 每項技能的說明）。
import skillsJson from '@/content/skills.json'
import skillsZh from '@/content/i18n/skills.zh.json'
import type { Locale } from '@/lib/i18n/config'
import { allProjectsData, type ProjectDetail } from './projects'

export interface Skill {
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  years?: number
  description?: string
}

export interface SkillCategory {
  id: string
  name: string
  skills: Skill[]
}

type SkillsZh = Record<string, { name?: string; skills?: Record<string, string> }>

const rawSkills = skillsJson as SkillCategory[]
const zhMap = skillsZh as SkillsZh

export function getSkills(locale: Locale = 'en'): SkillCategory[] {
  if (locale !== 'zh-TW') return rawSkills
  return rawSkills.map((category) => {
    const zh = zhMap[category.id]
    return {
      ...category,
      name: zh?.name || category.name,
      skills: category.skills.map((skill) => ({
        ...skill,
        description: zh?.skills?.[skill.name] || skill.description,
      })),
    }
  })
}

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9+#]/g, '')

/** 技術名稱出現在哪些專案的 technologies 裡（不分大小寫、忽略標點）。 */
export function projectsUsingSkill(skillName: string, limit = 3): ProjectDetail[] {
  const key = normalize(skillName)
  if (!key) return []
  return allProjectsData
    .filter((project) => project.technologies.some((tech) => normalize(tech) === key))
    .slice(0, limit)
}
