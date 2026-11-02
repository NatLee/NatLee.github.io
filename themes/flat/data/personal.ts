// Profile view model, read from the runtime bundle (see lib/site.ts).
import { derived, en } from '@/lib/site'

export interface PersonalInfo {
  /** Big hero name. */
  name: string
  /** Short display name (hero sub-line, nav logo, alt text). */
  nameEn: string
  title: string
  email: string
  location: string
  bio: string
  story: string[]
  avatar: string
  careerStartYear: number
  languages: Language[]
  socialLinks: SocialLink[]
  tools: string[]
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

export const getPersonalInfo = derived<PersonalInfo>(({ profile }) => {
  const bio = en(profile.description, '')
  const story = en(profile.story, []).filter(Boolean)
  return {
    name: profile.fullName || profile.name,
    nameEn: profile.name,
    title: en(profile.headline, ''),
    email: profile.email,
    location: en(profile.location, ''),
    bio,
    story: story.length > 0 ? story : bio ? [bio] : [],
    avatar: profile.avatar,
    careerStartYear: profile.careerStartYear,
    languages: (profile.languages ?? []).map((l) => ({
      name: en(l.name, ''),
      level: en(l.level, ''),
      description: en(l.note, ''),
    })),
    socialLinks: (profile.socials ?? []).map((s) => ({ name: s.name, url: s.url, icon: s.icon, description: s.name })),
    tools: profile.tools ?? [],
  }
})

/** Whole years since the career started, for the "N+ Years Experience" stats. */
export function getYearsOfExperience(): number {
  const start = getPersonalInfo().careerStartYear
  return start ? Math.max(0, new Date().getFullYear() - start) : 0
}

export function findSocial(key: string): SocialLink | undefined {
  const k = key.toLowerCase()
  return getPersonalInfo().socialLinks.find((l) => l.icon.toLowerCase() === k || l.name.toLowerCase() === k)
}
