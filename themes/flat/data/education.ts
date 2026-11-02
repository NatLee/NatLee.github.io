// Education view models, read from the runtime bundle (see lib/site.ts).
import { derived, en } from '@/lib/site'

export interface Education {
  id: string
  /** Native-language school name, shown as a sub-line when the bundle has one. */
  school: string
  schoolEn: string
  schoolAbbr: string
  degree: string
  major: string
  minor?: string
  location?: string
  startYear: string
  endYear: string
}

// "Example Institute of Technology" → "EIT" (capitalised words only, so "of" / "and" drop out).
function abbreviate(name: string): string {
  return name
    .split(/\s+/)
    .filter((word) => /^[A-Z]/.test(word))
    .map((word) => word[0])
    .join('')
}

export const getEducation = derived<Education[]>(({ education }) =>
  (education ?? []).map((e) => {
    const schoolEn = en(e.school, '')
    const zh = e.school?.zh
    return {
      id: e.id,
      school: zh && zh !== schoolEn ? zh : '',
      schoolEn,
      schoolAbbr: abbreviate(schoolEn),
      degree: en(e.degree, ''),
      major: en(e.major, ''),
      minor: e.minor ? en(e.minor, '') : undefined,
      startYear: e.start,
      endYear: e.end,
    }
  }),
)
