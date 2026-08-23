'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export interface UseTerminalTypingOptions {
  command: string
  typingSpeed?: number      // mean ms per character; omit to auto-fit a ~1.8s scene
  startDelay?: number       // delay before typing starts (default: 0)
  cursorBlinkSpeed?: number // cursor blink interval (default: 500)
  completeHoldMs?: number   // pause on the finished command before onComplete (default: 600)
  onComplete?: () => void
  enabled?: boolean         // whether to start the animation (default: true)
}

export interface UseTerminalTypingReturn {
  displayedCommand: string
  isTyping: boolean
  isComplete: boolean
  showCursor: boolean
}

// Mean per-character delay when the caller doesn't pin one. Real command-line
// typing sits around 60-90 WPM (150-250ms a character); the previous "snappy"
// 55-60ms cadence measured out to ~160 WPM, which the eye reads as the command
// simply appearing. Short commands take the slow end and long ones compress,
// so every command scene lands in roughly the same 1.5-2.5s window regardless
// of string length — a 10-char command can finally read as typing at all.
function meanCharDelay(length: number): number {
  return Math.round(Math.min(150, Math.max(70, 1800 / Math.max(length, 1))))
}

// A fixed interval reads as a progress bar filling, not as someone at a
// keyboard — every character landing on the exact same beat is the tell. Vary
// each keystroke and rest longer on the boundaries a typist actually pauses
// at; that also stretches a short command without making a long one drag.
function keystrokeDelay(base: number, char: string): number {
  const jitter = 0.55 + Math.random() * 1.15 // 0.55x - 1.7x
  const boundary = char === ' ' ? 2 : '.-_/'.includes(char) ? 1.45 : 1
  return Math.round(base * jitter * boundary)
}

export function useTerminalTyping({
  command,
  typingSpeed,
  startDelay = 0,
  cursorBlinkSpeed = 500,
  completeHoldMs = 600,
  onComplete,
  enabled = true,
}: UseTerminalTypingOptions): UseTerminalTypingReturn {
  const [displayedCommand, setDisplayedCommand] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const cursorIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const startDelayTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const onCompleteRef = useRef(onComplete)

  // Keep onComplete ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Cleanup function
  const cleanup = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current)
      holdTimeoutRef.current = null
    }
    if (cursorIntervalRef.current) {
      clearInterval(cursorIntervalRef.current)
      cursorIntervalRef.current = null
    }
    if (startDelayTimeoutRef.current) {
      clearTimeout(startDelayTimeoutRef.current)
      startDelayTimeoutRef.current = null
    }
  }, [])

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false

  useEffect(() => {
    if (!enabled) {
      return
    }

    // If user prefers reduced motion, show everything immediately
    if (prefersReducedMotion) {
      setDisplayedCommand(command)
      setIsComplete(true)
      setIsTyping(false)
      onCompleteRef.current?.()
      return
    }

    // Reset state when command changes
    setDisplayedCommand('')
    setIsComplete(false)
    setIsTyping(false)

    const base = typingSpeed ?? meanCharDelay(command.length)

    // Start typing after delay
    startDelayTimeoutRef.current = setTimeout(() => {
      setIsTyping(true)
      let index = 0

      // Chained timeouts rather than one interval, so every keystroke can carry
      // its own delay.
      const typeNext = () => {
        if (index < command.length) {
          const char = command[index]
          index++
          setDisplayedCommand(command.slice(0, index))
          typingTimeoutRef.current = setTimeout(typeNext, keystrokeDelay(base, char))
          return
        }

        // Typing finished. Hold on the completed command with the cursor still
        // blinking before releasing the output, the way a real shell sits for a
        // moment between Enter and its first line. Without this beat the output
        // lands on the same frame as the last character and the whole command
        // reads as one instant event.
        setIsTyping(false)
        holdTimeoutRef.current = setTimeout(() => {
          setIsComplete(true)
          onCompleteRef.current?.()
        }, completeHoldMs)
      }

      typeNext()
    }, startDelay)

    return cleanup
  }, [command, typingSpeed, startDelay, completeHoldMs, enabled, prefersReducedMotion, cleanup])

  // Cursor blinking effect
  useEffect(() => {
    if (!enabled) return

    cursorIntervalRef.current = setInterval(() => {
      setShowCursor(prev => !prev)
    }, cursorBlinkSpeed)

    return () => {
      if (cursorIntervalRef.current) {
        clearInterval(cursorIntervalRef.current)
        cursorIntervalRef.current = null
      }
    }
  }, [cursorBlinkSpeed, enabled])

  return {
    displayedCommand,
    isTyping,
    isComplete,
    showCursor,
  }
}

export default useTerminalTyping
