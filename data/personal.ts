// 個人資料：content/personal.json（中文欄位以 Zh 結尾，放在同一個檔案）。
import personalData from '@/content/personal.json'
import type { Locale } from '@/lib/i18n/config'
import { localizedArray, localizedField } from '@/lib/i18n/localize'

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
}

export interface Era {
  period: string
  title: string
  titleZh?: string
  note: string
  noteZh?: string
}

interface Tagline {
  /** 用 **雙星號** 標出要強調的片語。 */
  lead: string
  sub: string
}

export interface PersonalInfo {
  name: string
  nameEn: string
  title: string
  titleZh?: string
  email: string
  location: string
  locationZh?: string
  careerStartYear: number
  avatar: string
  description: string
  descriptionZh?: string
  tagline: Tagline
  taglineZh?: Tagline
  now: string
  nowZh?: string
  bio: string
  bioZh?: string
  story: string[]
  storyZh?: string[]
  howIWork: string
  howIWorkZh?: string
  tools: string[]
  eras: Era[]
  languages: Language[]
  socialLinks: SocialLink[]
}

export const personalInfo = personalData as PersonalInfo

export function getPersonalInfo(locale: Locale = 'en') {
  const zh = locale === 'zh-TW'
  return {
    ...personalInfo,
    displayName: personalInfo.nameEn,
    title: localizedField(locale, personalInfo.title, personalInfo.titleZh),
    location: localizedField(locale, personalInfo.location, personalInfo.locationZh),
    description: localizedField(locale, personalInfo.description, personalInfo.descriptionZh),
    tagline: zh && personalInfo.taglineZh ? personalInfo.taglineZh : personalInfo.tagline,
    now: localizedField(locale, personalInfo.now, personalInfo.nowZh),
    bio: localizedField(locale, personalInfo.bio, personalInfo.bioZh),
    story: localizedArray(locale, personalInfo.story, personalInfo.storyZh),
    howIWork: localizedField(locale, personalInfo.howIWork, personalInfo.howIWorkZh),
    eras: personalInfo.eras.map((era) => ({
      period: era.period,
      title: localizedField(locale, era.title, era.titleZh),
      note: localizedField(locale, era.note, era.noteZh),
    })),
    languages: personalInfo.languages.map((language) => ({
      ...language,
      name: localizedField(locale, language.name, language.nameZh),
      level: localizedField(locale, language.level, language.levelZh),
      description: localizedField(locale, language.description, language.descriptionZh),
    })),
  }
}

export function getYearsOfExperience(fromYear: number = personalInfo.careerStartYear): number {
  return Math.max(1, new Date().getFullYear() - fromYear)
}
