'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export interface UseTerminalTypingOptions {
  command: string
  typingSpeed?: number      // ms per character (default: 50)
  startDelay?: number       // delay before typing starts (default: 0)
  cursorBlinkSpeed?: number // cursor blink interval (default: 530)
  onComplete?: () => void
  enabled?: boolean         // whether to start the animation (default: true)
}

export interface UseTerminalTypingReturn {
  displayedCommand: string
  isTyping: boolean
  isComplete: boolean
  showCursor: boolean
}

export function useTerminalTyping({
  command,
  typingSpeed = 50,
  startDelay = 0,
  cursorBlinkSpeed = 530,
  onComplete,
  enabled = true,
}: UseTerminalTypingOptions): UseTerminalTypingReturn {
  const [displayedCommand, setDisplayedCommand] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const cursorIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const startDelayTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const onCompleteRef = useRef(onComplete)

  // Keep onComplete ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Cleanup function
  const cleanup = useCallback(() => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current)
      typingIntervalRef.current = null
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

    // Start typing after delay
    startDelayTimeoutRef.current = setTimeout(() => {
      setIsTyping(true)
      let index = 0

      typingIntervalRef.current = setInterval(() => {
        if (index < command.length) {
          setDisplayedCommand(command.slice(0, index + 1))
          index++
        } else {
          // Typing complete
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current)
            typingIntervalRef.current = null
          }
          setIsTyping(false)
          setIsComplete(true)
          onCompleteRef.current?.()
        }
      }, typingSpeed)
    }, startDelay)

    return cleanup
  }, [command, typingSpeed, startDelay, enabled, prefersReducedMotion, cleanup])

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
