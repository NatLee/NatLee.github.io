// 從 JSON 檔案載入教育資料
import educationJson from '@/assets/data/education.json'

export interface Education {
  id: string
  school: string
  schoolEn: string
  schoolAbbr: string
  degree: string
  major: string
  minor?: string
  location: string
  startYear: string
  endYear: string
  logo: string
  achievements?: string[]
}

export const educationData: Education[] = educationJson as Education[]