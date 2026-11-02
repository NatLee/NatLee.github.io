// Experience view models, read from the runtime bundle (see lib/site.ts).
import { derived, en } from '@/lib/site'

export interface Experience {
  id: string
  title: string
  company: string
  /** Roles sharing a companyId render as one grouped card (the bundle's `group`, else the company). */
  companyId: string
  /** Display name for the grouped card header. */
  groupName: string
  roleType?: 'join' | 'promotion' | 'transfer'
  department: string
  location: string
  /** "MMM YYYY" or "Present". */
  start: string
  end: string
  summary: string
  responsibilities: string[]
  techStack: string[]
  achievements?: string[]
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Bundle dates are "YYYY.MM" (or "YYYY", or "Present"); this theme shows "MMM YYYY". */
function formatDate(value: string): string {
  const m = /^(\d{4})(?:[.-](\d{1,2}))?$/.exec((value ?? '').trim())
  if (!m) return value
  return m[2] ? `${MONTHS[Number(m[2]) - 1] ?? ''} ${m[1]}`.trim() : m[1]
}

export const getExperience = derived<Experience[]>(({ experience }) =>
  (experience ?? []).map((r) => {
    const groupName = r.group || r.company
    return {
      id: r.id,
      title: en(r.title, ''),
      company: r.company,
      companyId: groupName.toLowerCase(),
      groupName,
      roleType: r.roleType,
      department: en(r.department, ''),
      location: r.location,
      start: formatDate(r.start),
      end: formatDate(r.end),
      summary: en(r.summary, ''),
      responsibilities: en(r.responsibilities, []),
      techStack: r.techStack ?? [],
      achievements: en(r.achievements, []),
    }
  }),
)

export function getCompanyCount(): number {
  return new Set(getExperience().map((e) => e.company)).size
}

export function getExperienceTechCount(): number {
  return new Set(getExperience().flatMap((e) => e.techStack)).size
}
