// Profile view model, adapted from the runtime bundle (/content/site.json).
import { pick, type Profile } from '@/lib/site-contract'

export interface PersonalInfo {
  name: string
  fullName: string
  title: string
  email: string
  location: string
  bio: string
  avatar: string
  careerStartYear: number
  languages: Language[]
  socialLinks: SocialLink[]
  /** Initials of profile.name ("Jane Doe" → "JD"): the house brand ("JD.TECH"). */
  initials: string
  /** profile.name without spaces ("Jane Doe" → "JANEDOE"): the stock symbol in the trading terminal. */
  ticker: string
  /** First word of profile.name ("Jane Doe" → "JANE"): the chart symbol ("CAREER.JANE"). */
  firstName: string
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
}

export function toPersonal(profile: Profile): PersonalInfo {
  const name = profile.name ?? ''
  const words = name.split(/\s+/).filter(Boolean)
  return {
    name,
    fullName: profile.fullName ?? name,
    title: pick(profile.headline) ?? '',
    email: profile.email ?? '',
    location: pick(profile.location) ?? '',
    bio: pick(profile.description) ?? '',
    avatar: profile.avatar ?? '',
    careerStartYear: profile.careerStartYear ?? new Date().getFullYear(),
    languages: (profile.languages ?? []).map((l) => ({
      name: pick(l.name) ?? '',
      level: pick(l.level) ?? '',
      description: pick(l.note),
    })),
    socialLinks: profile.socials ?? [],
    initials: words.map((w) => w[0]).join('').toUpperCase() || 'ME',
    ticker: name.replace(/[^A-Za-z0-9]/g, '').toUpperCase() || 'TICKER',
    firstName: (words[0] ?? 'ME').toUpperCase(),
  }
}
