// 從 JSON 檔案載入個人資料
import personalData from '@/assets/data/personal.json'

export interface PersonalInfo {
  name: string
  nameEn: string
  title: string
  email: string
  location: string
  bio: string
  avatar: string
  languages: Language[]
  socialLinks: SocialLink[]
  interests: string[]
}

export interface Language {
  name: string
  level: string
  description?: string
}

export interface SocialLink {
  name: string
  url: string
  icon: string
  description?: string
}

export const personalInfo: PersonalInfo = personalData as PersonalInfo