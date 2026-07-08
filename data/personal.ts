// 從 JSON 檔案載入個人資料
import personalData from '@/assets/data/personal.json'
import type { Locale } from '@/lib/i18n/config'
import { localizedArray, localizedField } from '@/lib/i18n/localize'

export interface PersonalInfo {
  name: string
  nameEn: string
  title: string
  titleZh?: string
  email: string
  location: string
  locationZh?: string
  bio: string
  bioZh?: string
  avatar: string
  languages: Language[]
  socialLinks: SocialLink[]
  interests: string[]
  interestsZh?: string[]
}

export interface Language {
  name: string
  nameZh?: string
  level: string
  levelZh?: string
  description?: string
  descriptionZh?: string
}

export interface SocialLink {
  name: string
  url: string
  icon: string
  description?: string
}

const personalInfo: PersonalInfo = personalData as PersonalInfo

export function getPersonalInfo(locale: Locale = 'en') {
  return {
    ...personalInfo,
    displayName: personalInfo.nameEn,
    title: localizedField(locale, personalInfo.title, personalInfo.titleZh),
    location: localizedField(locale, personalInfo.location, personalInfo.locationZh),
    bio: localizedField(locale, personalInfo.bio, personalInfo.bioZh),
    interests: localizedArray(locale, personalInfo.interests, personalInfo.interestsZh),
    languages: personalInfo.languages.map((language) => ({
      ...language,
      name: localizedField(locale, language.name, language.nameZh),
      level: localizedField(locale, language.level, language.levelZh),
      description: localizedField(locale, language.description, language.descriptionZh),
    })),
  }
}

export { personalInfo }

export const CAREER_START_YEAR = 2018

export function getYearsOfExperience(fromYear: number = CAREER_START_YEAR): number {
  return Math.max(1, new Date().getFullYear() - fromYear)
}
