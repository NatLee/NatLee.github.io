// Experience view model, adapted from the runtime bundle (/content/site.json).
import { pick, type Role } from '@/lib/site-contract'

export interface Experience {
  id: string
  title: string
  company: string
  companyLogo: string
  department: string
  location: string
  /** Display dates, e.g. "May 2026" / "Present". */
  start: string
  end: string
  /** Parsed start date, for the career chart. */
  startDate: Date
  summary: string
  responsibilities: string[]
  techStack: string[]
  achievements?: string[]
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "2026.05" / "2024-02" / "2019" → Date (mid-month, so UTC conversion never shifts the month). */
export function parseYearMonth(value: string | undefined): Date | null {
  const m = /^(\d{4})(?:[.\-/](\d{1,2}))?/.exec((value ?? '').trim())
  if (!m) return null
  return new Date(Number(m[1]), m[2] ? Number(m[2]) - 1 : 0, 15)
}

/** "2026.05" → "May 2026"; "2019" → "2019"; anything else (e.g. "Present") as-is. */
export function formatYearMonth(value: string | undefined): string {
  const v = (value ?? '').trim()
  const m = /^(\d{4})(?:[.\-/](\d{1,2}))?$/.exec(v)
  if (!m) return v
  return m[2] ? `${MONTHS[Number(m[2]) - 1] ?? m[2]} ${m[1]}` : m[1]
}

export function toExperience(role: Role): Experience {
  const achievements = pick(role.achievements) ?? []
  return {
    id: role.id,
    title: pick(role.title) ?? '',
    company: role.company ?? '',
    companyLogo: '',
    department: pick(role.department) ?? '',
    location: role.location ?? '',
    start: formatYearMonth(role.start),
    end: formatYearMonth(role.end) || 'Present',
    startDate: parseYearMonth(role.start) ?? new Date(),
    summary: pick(role.summary) ?? '',
    responsibilities: pick(role.responsibilities) ?? [],
    techStack: role.techStack ?? [],
    achievements: achievements.length ? achievements : undefined,
  }
}
