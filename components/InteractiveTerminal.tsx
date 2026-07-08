'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getPersonalInfo } from '@/data/personal'
import { useLanguage } from '@/contexts/LanguageContext'

type Tone = 'default' | 'error' | 'muted' | 'accent'

interface Line {
  id: number
  kind: 'input' | 'output'
  text: string
  tone?: Tone
  href?: string
}

const ROUTES: Record<string, string> = {
  about: '/about',
  projects: '/projects',
  experience: '/experience',
}

const toneClass: Record<Tone, string> = {
  default: 'text-gray-300',
  error: 'text-red-400',
  muted: 'text-gray-500',
  accent: 'text-secondary',
}

/**
 * A real, keyboard-driven shell for the home page: type commands, get output,
 * navigate the site. Replaces the previously-static blinking prompt.
 */
export default function InteractiveTerminal() {
  const router = useRouter()
  const { locale, t } = useLanguage()
  const personal = useMemo(() => getPersonalInfo(locale), [locale])

  const [lines, setLines] = useState<Line[]>([])
  const [value, setValue] = useState('')
  const [recall, setRecall] = useState<string[]>([])
  const [recallIndex, setRecallIndex] = useState(-1)

  const idRef = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const nextId = () => ++idRef.current

  // Keep the newest line in view within the terminal (not the page).
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [lines])

  const focusInput = useCallback(() => {
    inputRef.current?.focus({ preventScroll: true })
  }, [])

  const run = useCallback(
    (raw: string) => {
      const input = raw.trim()
      const echo: Line = { id: nextId(), kind: 'input', text: raw }
      const out: Line[] = []
      const add = (text: string, tone: Tone = 'default', href?: string) =>
        out.push({ id: nextId(), kind: 'output', text, tone, href })

      if (!input) {
        setLines((prev) => [...prev, echo])
        return
      }

      const [cmd, ...args] = input.split(/\s+/)
      const c = cmd.toLowerCase()

      switch (c) {
        case 'help': {
          add(t('home.shell.helpHeader'), 'accent')
          const cmds: Array<[string, string]> = [
            ['help', t('home.shell.cmd.help')],
            ['whoami', t('home.shell.cmd.whoami')],
            ['ls', t('home.shell.cmd.ls')],
            ['about', t('home.shell.cmd.about')],
            ['projects', t('home.shell.cmd.projects')],
            ['experience', t('home.shell.cmd.experience')],
            ['social', t('home.shell.cmd.social')],
            ['email', t('home.shell.cmd.email')],
            ['date', t('home.shell.cmd.date')],
            ['clear', t('home.shell.cmd.clear')],
          ]
          cmds.forEach(([name, desc]) => add(`  ${name.padEnd(12)} ${desc}`, 'muted'))
          break
        }
        case 'whoami':
          add(`${personal.displayName} — ${personal.title}`)
          break
        case 'ls':
          add('about/   experience/   projects/', 'accent')
          break
        case 'pwd':
          add('/home/natlee')
          break
        case 'date':
          add(new Date().toLocaleString(locale === 'zh-TW' ? 'zh-TW' : 'en-US'))
          break
        case 'echo':
          add(args.join(' '))
          break
        case 'email':
          add(personal.email, 'default', `mailto:${personal.email}`)
          break
        case 'social':
        case 'links':
          personal.socialLinks.forEach((link) => add(`${link.name.padEnd(14)} ${link.url}`, 'default', link.url))
          break
        case 'sudo':
          add(t('home.shell.sudo'), 'error')
          break
        case 'clear':
          setLines([])
          setValue('')
          return
        case 'home':
          setLines([])
          setValue('')
          return
        case 'cd': {
          const target = (args[0] || '').replace(/^[/~]+/, '').replace(/\/$/, '').toLowerCase()
          if (target === '' || target === '~') {
            setLines([])
            setValue('')
            return
          }
          if (ROUTES[target]) {
            add(t('home.shell.opening', { target }), 'muted')
            setLines((prev) => [...prev, echo, ...out])
            setValue('')
            router.push(ROUTES[target])
            return
          }
          add(t('home.shell.notFound', { cmd: `cd ${args[0] ?? ''}`.trim() }), 'error')
          break
        }
        case 'about':
        case 'projects':
        case 'experience':
          add(t('home.shell.opening', { target: c }), 'muted')
          setLines((prev) => [...prev, echo, ...out])
          setValue('')
          router.push(ROUTES[c])
          return
        default:
          add(t('home.shell.notFound', { cmd }), 'error')
      }

      setLines((prev) => [...prev, echo, ...out])
      setValue('')
    },
    [locale, personal, router, t]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const entry = value.trim()
      if (entry) setRecall((prev) => [...prev, entry])
      setRecallIndex(-1)
      run(value)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!recall.length) return
      const nextIdx = recallIndex === -1 ? recall.length - 1 : Math.max(0, recallIndex - 1)
      setRecallIndex(nextIdx)
      setValue(recall[nextIdx])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (recallIndex === -1) return
      const nextIdx = recallIndex + 1
      if (nextIdx >= recall.length) {
        setRecallIndex(-1)
        setValue('')
      } else {
        setRecallIndex(nextIdx)
        setValue(recall[nextIdx])
      }
    }
  }

  const Prompt = () => (
    <>
      <span className="text-secondary font-bold">natlee@mainframe</span>
      <span className="text-white">:</span>
      <span className="text-blue-500">~</span>
      <span className="text-white">$ </span>
    </>
  )

  return (
    <div
      className="mt-8 border-t border-gray-800 pt-4 font-mono text-sm"
      onClick={focusInput}
    >
      <div
        ref={scrollRef}
        className="max-h-72 overflow-y-auto custom-scrollbar space-y-1 pr-1"
        role="log"
        aria-live="polite"
        aria-label={t('home.shell.ariaLabel')}
      >
        <div className="text-gray-500 mb-2">{t('home.shell.welcome')}</div>

        {lines.map((line) =>
          line.kind === 'input' ? (
            <div key={line.id} className="flex flex-wrap items-baseline break-all">
              <Prompt />
              <span className="text-gray-300">{line.text}</span>
            </div>
          ) : line.href ? (
            <div key={line.id} className="whitespace-pre-wrap break-words">
              <a
                href={line.href}
                target={line.href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline decoration-blue-500/30"
                onClick={(e) => e.stopPropagation()}
              >
                {line.text}
              </a>
            </div>
          ) : (
            <div key={line.id} className={`whitespace-pre-wrap break-words ${toneClass[line.tone ?? 'default']}`}>
              {line.text}
            </div>
          )
        )}

        {/* Active input row */}
        <div className="flex flex-wrap items-baseline">
          <Prompt />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-[6ch] bg-transparent outline-none text-gray-300 caret-secondary"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label={t('home.shell.ariaLabel')}
          />
        </div>
      </div>
    </div>
  )
}
