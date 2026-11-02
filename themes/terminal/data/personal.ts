// Profile accessors over the runtime bundle (see lib/site/store.ts).
import type { Locale } from '@/lib/i18n/config'
import { pick } from '@/lib/site/contract'
import { contentLocale, getSite, list, text } from '@/lib/site/store'

export interface Language {
  name: string
  level: string
  description?: string
}

export interface SocialLink {
  name: string
  url: string
  icon: string
}

export function getPersonalInfo(locale: Locale = 'en') {
  const profile = getSite().profile
  const tagline = pick(profile.tagline, contentLocale(locale))

  return {
    name: profile.fullName || profile.name,
    displayName: profile.name,
    /** The bundle's headline replaces the old job title. */
    title: text(profile.headline, locale),
    email: profile.email,
    location: text(profile.location, locale),
    /** Short self-description (the old bio). */
    bio: text(profile.description, locale),
    /** Hero copy: lead + sub; `**` in the lead marks the emphasised phrase. */
    tagline: [tagline?.lead, tagline?.sub].filter(Boolean).join(' '),
    story: list(profile.story, locale),
    avatar: profile.avatar,
    tools: profile.tools ?? [],
    languages: (profile.languages ?? []).map<Language>((language) => ({
      name: text(language.name, locale),
      level: text(language.level, locale),
      description: text(language.note, locale),
    })),
    socialLinks: (profile.socials ?? []) as SocialLink[],
  }
}

export function getCareerStartYear(): number {
  return getSite().profile.careerStartYear ?? new Date().getFullYear()
}

export function getYearsOfExperience(fromYear: number = getCareerStartYear()): number {
  return Math.max(1, new Date().getFullYear() - fromYear)
}

/** Shell user name derived from the profile name, e.g. "Jane Doe" → "janedoe". */
export function getUserHandle(): string {
  const handle = getSite().profile.name.toLowerCase().replace(/[^a-z0-9]/g, '')
  return handle || 'guest'
}
