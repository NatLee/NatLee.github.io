'use client'

// 作品的出處徽章：在公司做的（鎖頭，柿色）或從那段時期長出來的開源 repo（分支，青綠）。
// 衍生 repo 可以有好幾個出處（例如碩士論文 + Big Data），依時間排、用「+」連起來。
// 卡片和清單整列都是連結，所以徽章本身不放連結；作品頁另外在側欄連到 /work。
import Icon from '@/components/Icon'
import { useLanguage } from '@/contexts/LanguageContext'
import { getProjectOrigins } from '@/data/work'
import { pick } from '@/lib/i18n/localize'

const TONE = {
  work: 'bg-accent-soft text-accent',
  spinoff: 'bg-clip-soft text-clip',
} as const

export default function OriginBadge({ projectId, className = '' }: { projectId: string; className?: string }) {
  const { locale, t } = useLanguage()
  const origins = getProjectOrigins(projectId)
  if (!origins.length) return null
  const work = origins.find((origin) => origin.kind === 'work')
  const kind = work ? 'work' : 'spinoff'
  const names = [...new Set((work ? [work] : origins).map((origin) => pick(locale, origin.label)))]
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[11px] font-medium leading-none ${TONE[kind]} ${className}`}>
      <Icon name={work ? 'lock' : 'branch'} size={12} />
      {t(`origin.${kind}`, { name: names.join(' + ') })}
    </span>
  )
}
