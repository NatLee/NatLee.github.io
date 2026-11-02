'use client'

// Tapi：Telepy 的吉祥物（像素格與換裝規則在 lib/tapi/mascot.ts，原封不動取自 Telepy）。
// 在這個網站是來作客的嚮導，只出現在固定位置：Telepy 區塊與案例頁、頁尾、404、英靈殿。
// 節日換裝（Telepy 生日 2/18、農曆新年、萬聖節）依瀏覽器日期，掛載後才算，避免伺服器與瀏覽器畫面不一致。
// 尺寸請用 26 的倍數（52、78、104、130），像素才會銳利。
import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { CLIP_COLORS, MASCOT_POSES, dressTapi, mirrored, pixelRuns, spriteSize, type MascotPose, type TapiFestival } from '@/lib/tapi/mascot'
import { festivalOn } from '@/lib/tapi/festivals'

export type { MascotPose }

interface TapiProps {
  pose?: MascotPose
  /** 寬度（px）；高度依比例。 */
  size?: number
  flip?: boolean
  /** 十字髮夾顏色，預設青綠。 */
  clip?: string
  /** 給螢幕閱讀器的名字；不給就當裝飾。 */
  label?: string
  className?: string
  style?: CSSProperties
}

export const DEFAULT_CLIP = CLIP_COLORS[0][1]

export function useFestival(): TapiFestival {
  const [festival, setFestival] = useState<TapiFestival>(null)
  useEffect(() => {
    setFestival(festivalOn(new Date())?.kind ?? null)
  }, [])
  return festival
}

export default function Tapi({ pose = 'idle', size = 78, flip = false, clip = DEFAULT_CLIP, label, className, style }: TapiProps) {
  const festival = useFestival()
  const { runs, w, h } = useMemo(() => {
    const dressed = dressTapi(MASCOT_POSES[pose], { clip, festival })
    const sprite = flip ? mirrored(dressed.sprite) : dressed.sprite
    return { runs: pixelRuns(sprite, dressed.palette), ...spriteSize(sprite) }
  }, [pose, flip, clip, festival])

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      width={size}
      height={Math.round((size * h) / w)}
      className={className}
      style={style}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {runs.map((run) => (
        <rect key={`${run.x}-${run.y}`} x={run.x} y={run.y} width={run.w} height={1} fill={run.fill} />
      ))}
    </svg>
  )
}
