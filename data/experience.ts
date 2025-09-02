// 從 JSON 檔案載入經驗資料
import experienceJson from '@/assets/data/experience.json'

export interface Experience {
  id: string
  title: string
  company: string
  companyId: string
  companyLogo: string
  department: string
  location: string
  start: string
  end: string
  summary: string
  responsibilities: string[]
  techStack: string[]
  achievements?: string[]
}

export const experienceData: Experience[] = experienceJson as Experience[]