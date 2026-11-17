'use client'

// 作品的出處徽章：在公司做的（鎖頭，柿色）或從那段工作長出來的開源 repo（分支，青綠）。
// 卡片和清單整列都是連結，所以徽章本身不放連結；作品頁另外在側欄連到 /work。
import Icon from '@/components/Icon'
import { useLanguage } from '@/contexts/LanguageContext'
import { getProjectOrigin } from '@/data/work'

const TONE = {
  work: 'bg-accent-soft text-accent',
  spinoff: 'bg-clip-soft text-clip',
} as const

export default function OriginBadge({ projectId, className = '' }: { projectId: string; className?: string }) {
  const { t } = useLanguage()
  const origin = getProjectOrigin(projectId)
  if (!origin) return null
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[11px] font-medium leading-none ${TONE[origin.kind]} ${className}`}>
      <Icon name={origin.kind === 'work' ? 'lock' : 'branch'} size={12} />
      {t(`origin.${origin.kind}`, { name: origin.name })}
    </span>
  )
}
