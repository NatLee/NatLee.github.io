'use client'

// 架構圖和流程圖共用：量容器裡每個標了 data-box 的元素相對於容器的位置，交給 compute 算出要畫的線。
// 版面寬度、字型載入、節點換行都會改變位置，所以容器和每個 data-box 元素都用 ResizeObserver 看著。
import { useLayoutEffect, useRef, useState, type DependencyList } from 'react'

export interface Box {
  left: number
  right: number
  top: number
  bottom: number
  cx: number
  cy: number
}

/** 在容器裡放一個暫時的元素量文字大小（和實際標籤同樣的 class），量完就拿掉。 */
export function measureText(container: HTMLElement, text: string, className: string, maxWidth: number) {
  const probe = document.createElement('span')
  probe.className = `${className} invisible absolute left-0 top-0`
  probe.style.maxWidth = `${maxWidth}px`
  probe.textContent = text
  container.appendChild(probe)
  // offsetWidth 會捨去小數；照它設寬度，文字可能多折一行變高，所以無條件進位再多留 1px。
  const rect = probe.getBoundingClientRect()
  const size = { width: Math.ceil(rect.width) + 1, height: Math.ceil(rect.height) }
  probe.remove()
  return size
}

export function useMeasuredBoxes<T>(compute: (boxes: Map<string, Box>, base: DOMRect, container: HTMLDivElement) => T, deps: DependencyList) {
  const root = useRef<HTMLDivElement>(null)
  const [result, setResult] = useState<T | null>(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const measure = () => {
      const base = el.getBoundingClientRect()
      const boxes = new Map<string, Box>()
      for (const target of el.querySelectorAll('[data-box]')) {
        const r = target.getBoundingClientRect()
        const left = r.left - base.left
        const top = r.top - base.top
        boxes.set(target.getAttribute('data-box')!, { left, right: left + r.width, top, bottom: top + r.height, cx: left + r.width / 2, cy: top + r.height / 2 })
      }
      setResult(compute(boxes, base, el))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    el.querySelectorAll('[data-box]').forEach((target) => observer.observe(target))
    document.fonts?.ready.then(measure).catch(() => {})
    return () => observer.disconnect()
    // compute 由呼叫端依 deps 決定什麼時候重算。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return [root, result] as const
}
