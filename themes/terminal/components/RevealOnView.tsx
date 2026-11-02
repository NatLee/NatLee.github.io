'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  style?: CSSProperties
  /**
   * hold: render children immediately but keep their entrance animation paused
   * (via .anim-hold) until the wrapper scrolls into view. Layout is stable —
   * the reveal keyframes hold opacity 0 while paused. Use for grid/list items.
   *
   * Default (mount mode): keep children unmounted until visible, so JS-driven
   * sequences like command typing don't start while off-screen.
   */
  hold?: boolean
}

/**
 * Defers an entrance until the user can actually see it. Entrance animations
 * that fire on mount play to completion below the fold, so by the time the
 * visitor scrolls there the show is already over. This wrapper is the
 * visibility gate: nothing it guards starts before it enters the viewport.
 */
export default function RevealOnView({ children, className = '', style, hold = false }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (inView) return
    const el = ref.current
    if (!el) return
    // Ancient browser without IntersectionObserver: reveal immediately.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true)
          observer.disconnect()
        }
      },
      // Fire slightly before the edge crosses the fold, so the entrance is
      // already in motion as the user's scroll arrives at it.
      { rootMargin: '0px 0px 96px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [inView])

  if (hold) {
    return (
      <div ref={ref} style={style} className={`${className}${inView ? '' : ' anim-hold'}`}>
        {children}
      </div>
    )
  }

  return (
    <div ref={ref} style={style} className={className}>
      {inView ? children : null}
    </div>
  )
}
