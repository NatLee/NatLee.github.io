'use client'

import Link from 'next/link'
import { StarCount, ThemeLabel } from '@/components/site/ui'
import { useLanguage } from '@/contexts/LanguageContext'
import { getProjectStars, projectYear, type ProjectDetail } from '@/data/projects'

const placeholderTone: Record<string, string> = {
  energy: 'bg-accent-soft text-accent',
  infra: 'bg-clip-soft text-clip',
  ai: 'bg-paper text-plum',
  libraries: 'bg-paper text-ink',
  web: 'bg-paper text-muted',
}

/** 沒有截圖的作品（未公開或純命令列）用字當封面。 */
function TypePlaceholder({ project }: { project: ProjectDetail }) {
  return (
    <div className={`flex h-full flex-col justify-between p-5 ${placeholderTone[project.theme] ?? 'bg-paper text-ink'}`}>
      <span className="font-mono text-xs opacity-80">{project.technologies.slice(0, 3).join(' · ')}</span>
      <span className="max-w-[18ch] font-display text-2xl font-bold leading-tight tracking-tight">{project.subtitle || project.title}</span>
    </div>
  )
}

export function StatusTag({ status }: { status: ProjectDetail['status'] }) {
  const { t } = useLanguage()
  const live = status === 'In Progress'
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted">
      <span className={`h-1.5 w-1.5 rounded-full ${live ? 'bg-clip' : 'bg-line'}`} aria-hidden="true" />
      {t(`projects.status.${status}`)}
    </span>
  )
}

export default function ProjectCard({ project }: { project: ProjectDetail }) {
  return (
    <article className="group relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-ink/30 focus-within:ring-2 focus-within:ring-accent">
      <div className="aspect-[16/10] overflow-hidden border-b border-line bg-paper">
        {project.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.thumbnail}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <TypePlaceholder project={project} />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <ThemeLabel theme={project.theme} />
          <StarCount stars={getProjectStars(project)} />
        </div>
        <h3 className="break-words font-display text-xl font-bold leading-snug">
          <Link href={`/projects/${project.id}/`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-focus-within:underline">
            {project.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm text-muted">{project.description}</p>
        <div className="mt-auto flex items-center gap-4 pt-1 font-mono text-xs text-muted">
          <span className="tabular">{projectYear(project)}</span>
          <StatusTag status={project.status} />
        </div>
      </div>
    </article>
  )
}
