// 從 JSON 檔案載入技能資料
import skillsJson from '@/assets/data/skills.json'

export interface SkillCategory {
  id: string
  name: string
  skills: Skill[]
}

export interface Skill {
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  years?: number
  description?: string
}

export const skillsData: SkillCategory[] = skillsJson as SkillCategory[]