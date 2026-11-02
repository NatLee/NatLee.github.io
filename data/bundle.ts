// 把 content/ 組成 /content/site.json（格式見 lib/content/contract.ts）。
// app/content/site.json/route.ts 在 build 時輸出成靜態檔，英靈殿的各主題在瀏覽器裡讀它。
import experienceJson from '@/content/experience.json'
import educationJson from '@/content/education.json'
import skillsJson from '@/content/skills.json'
import mascotsJson from '@/content/mascots.json'
import projectsZh from '@/content/i18n/projects.zh.json'
import experienceZh from '@/content/i18n/experience.zh.json'
import educationZh from '@/content/i18n/education.zh.json'
import skillsZh from '@/content/i18n/skills.zh.json'
import { SCHEMA_VERSION, type Localized, type Mascot, type SiteBundle } from '@/lib/content/contract'
import { opensource, writing } from './content'
import { getRepoStats } from './github'
import { personalInfo } from './personal'
import { allProjectsData, getProjectStars } from './projects'

const SITE_URL = 'https://natlee.github.io'

function loc<T>(en: T, zh?: T): Localized<T> {
  return zh === undefined || (Array.isArray(zh) && zh.length === 0) || zh === '' ? { en } : { en, zh }
}

type Overlay = Record<string, Record<string, unknown>>

export function buildSiteBundle(): SiteBundle {
  const me = personalInfo
  const pz = projectsZh as Overlay
  const ez = experienceZh as Overlay
  const dz = educationZh as Overlay
  const sz = skillsZh as Record<string, { name?: string; skills?: Record<string, string> }>
  const { $schema: _schema, ...mascots } = mascotsJson as Record<string, unknown>

  return {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    siteUrl: SITE_URL,
    profile: {
      name: me.nameEn,
      fullName: me.name,
      headline: loc(me.title, me.titleZh),
      location: loc(me.location, me.locationZh),
      email: me.email,
      avatar: me.avatar,
      careerStartYear: me.careerStartYear,
      tagline: loc(me.tagline, me.taglineZh),
      description: loc(me.description, me.descriptionZh),
      now: loc(me.now, me.nowZh),
      story: loc(me.story, me.storyZh),
      howIWork: loc(me.howIWork, me.howIWorkZh),
      tools: me.tools,
      eras: me.eras.map((era) => ({ period: era.period, title: loc(era.title, era.titleZh), note: loc(era.note, era.noteZh) })),
      languages: me.languages.map((l) => ({ name: loc(l.name, l.nameZh), level: loc(l.level, l.levelZh), note: loc(l.description ?? '', l.descriptionZh) })),
      socials: me.socialLinks,
    },
    projects: allProjectsData.map((p) => {
      const zh = (pz[p.id] ?? {}) as Record<string, string & string[]>
      return {
        id: p.id,
        url: `${SITE_URL}/projects/${p.id}/`,
        title: loc(p.title, zh.title),
        subtitle: loc(p.subtitle, zh.subtitle),
        description: loc(p.description, zh.description),
        longDescription: loc(p.longDescription, zh.longDescription),
        theme: p.theme,
        tier: p.tier,
        category: p.category,
        status: p.status,
        role: loc(p.role, zh.role),
        start: p.timeline.start,
        end: p.timeline.end,
        language: p.language,
        technologies: p.technologies,
        features: loc(p.features, zh.features),
        challenges: loc(p.challenges, zh.challenges),
        solutions: loc(p.solutions, zh.solutions),
        results: loc(p.results, zh.results),
        images: p.images,
        thumbnail: p.thumbnail,
        links: p.links,
        stars: getProjectStars(p),
      }
    }),
    experience: (experienceJson as Record<string, any>[]).map((r) => {
      const zh = (ez[r.id] ?? {}) as Record<string, any>
      return {
        id: r.id,
        title: loc(r.title, zh.title),
        company: r.company,
        group: r.group,
        parentCompany: r.parentCompany,
        roleType: r.roleType,
        department: loc(r.department ?? '', zh.department),
        location: r.location,
        assignment: r.assignment && {
          location: loc(r.assignment.location, zh.assignment?.location),
          start: r.assignment.start,
          end: r.assignment.end,
          note: loc(r.assignment.note ?? '', zh.assignment?.note),
        },
        start: r.start,
        end: r.end,
        summary: loc(r.summary, zh.summary),
        responsibilities: loc(r.responsibilities ?? [], zh.responsibilities),
        achievements: loc(r.achievements ?? [], zh.achievements),
        techStack: r.techStack ?? [],
      }
    }),
    education: (educationJson as Record<string, any>[]).map((e) => {
      const zh = (dz[e.id] ?? {}) as Record<string, string>
      return {
        id: e.id,
        school: loc(e.schoolEn, e.school),
        degree: loc(e.degree, zh.degree),
        major: loc(e.major, zh.major),
        minor: e.minor ? loc(e.minor, zh.minor) : undefined,
        start: e.startYear,
        end: e.endYear,
      }
    }),
    skills: (skillsJson as { id: string; name: string; skills: { name: string; level: string; years?: number; description?: string }[] }[]).map((c) => ({
      id: c.id,
      name: loc(c.name, sz[c.id]?.name),
      skills: c.skills.map((s) => ({ name: s.name, level: s.level, years: s.years, description: loc(s.description ?? '', sz[c.id]?.skills?.[s.name]) })),
    })),
    opensource: {
      upstream: opensource.upstream,
      packages: opensource.packages.map((pkg) => ({ ...pkg, stars: getRepoStats(pkg.repo)?.stars })),
    },
    writing,
    mascots: mascots as Record<string, Mascot>,
  }
}
