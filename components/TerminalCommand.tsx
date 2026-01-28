'use client'

import React, { useState, useEffect } from 'react'
import { useTerminalTyping } from '@/hooks/useTerminalTyping'

export interface TerminalCommandProps {
  /** The prompt text (e.g., "natlee@mainframe") */
  prompt?: string
  /** The path text (e.g., "~" or "~/projects") */
  path?: string
  /** The command to type (e.g., "./intro.sh") */
  command: string
  /** Typing speed in ms per character (default: 50) */
  typingSpeed?: number
  /** Delay before typing starts in ms (default: 0) */
  startDelay?: number
  /** Callback when typing completes */
  onComplete?: () => void
  /** Whether the animation is enabled (default: true) */
  enabled?: boolean
  /** Content to show after command completes */
  children?: React.ReactNode
  /** Additional className for the container */
  className?: string
  /** Whether to show the content immediately without waiting for typing to complete */
  showContentImmediately?: boolean
}

export function TerminalCommand({
  prompt = 'natlee@mainframe',
  path = '~',
  command,
  typingSpeed = 50,
  startDelay = 0,
  onComplete,
  enabled = true,
  children,
  className = '',
  showContentImmediately = false,
}: TerminalCommandProps) {
  const [showContent, setShowContent] = useState(showContentImmediately)

  const { displayedCommand, isComplete, showCursor, isTyping } = useTerminalTyping({
    command,
    typingSpeed,
    startDelay,
    onComplete: () => {
      setShowContent(true)
      onComplete?.()
    },
    enabled,
  })

  // Reset showContent when enabled changes from false to true
  useEffect(() => {
    if (!enabled) {
      setShowContent(showContentImmediately)
    }
  }, [enabled, showContentImmediately])

  return (
    <div className={className}>
      {/* Command Line */}
      <div className="mb-2">
        <div className="flex flex-wrap items-baseline text-sm md:text-base">
          {/* Mobile: shorter prompt */}
          <span className="text-secondary font-bold hidden sm:inline">{prompt}</span>
          <span className="text-secondary font-bold sm:hidden">natlee</span>
          <span className="text-white">:</span>
          <span className="text-blue-500">{path}</span>
          <span className="text-white">$ </span>
          <span className="text-gray-300">{displayedCommand}</span>
          {/* Blinking cursor - show while typing or when complete */}
          <span
            className={`inline-block w-2 h-4 bg-secondary ml-0.5 align-middle transition-opacity duration-100 ${
              showCursor ? 'opacity-100' : 'opacity-0'
            } ${isComplete && !isTyping ? 'hidden' : ''}`}
          />
        </div>
      </div>

      {/* Content - shown after typing completes with animation */}
      {showContent && children && (
        <div className="animate-content-reveal">
          {children}
        </div>
      )}
    </div>
  )
}

export default TerminalCommand
