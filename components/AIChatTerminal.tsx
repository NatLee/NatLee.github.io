'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface Message {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  isStreaming?: boolean
}

interface Props {
  projectId: string
  projectTitle: string
  technologies?: string[]
  isCollapsed: boolean
  onToggleCollapse: () => void
}

// Escape HTML before we run the lightweight markdown regexes, so user-typed
// input (e.g. an unrecognized command) can never inject live markup via
// dangerouslySetInnerHTML.
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export default function AIChatTerminal({ projectId, projectTitle, technologies = [], isCollapsed, onToggleCollapse }: Props) {
  const { t } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [currentStreamingId, setCurrentStreamingId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([])
  const panelId = `ai-terminal-${projectId}`

  const helpContent = useMemo(
    () =>
      [
        `**${t('projectDetail.terminal.availableCommands')}**`,
        '',
        `- \`info\` - ${t('projectDetail.terminal.cmdInfo')}`,
        `- \`stack\` - ${t('projectDetail.terminal.cmdStack')}`,
        `- \`links\` - ${t('projectDetail.terminal.cmdLinks')}`,
        `- \`clear\` - ${t('projectDetail.terminal.cmdClear')}`,
        `- \`help\` - ${t('projectDetail.terminal.cmdHelp')}`,
      ].join('\n'),
    [t]
  )

  // Stream text effect with ref tracking
  const streamTextWithRef = (text: string, msgId: string) => {
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        setMessages(prev => prev.map(msg =>
          msg.id === msgId
            ? { ...msg, content: text.slice(0, index + 1) }
            : msg
        ))
        index++
      } else {
        clearInterval(interval)
        setMessages(prev => prev.map(msg =>
          msg.id === msgId
            ? { ...msg, isStreaming: false }
            : msg
        ))
        setCurrentStreamingId(null)
      }
    }, 15)

    intervalsRef.current.push(interval)
  }

  // Boot sequence effect
  useEffect(() => {
    // Clear any existing timeouts/intervals
    timeoutsRef.current.forEach(clearTimeout)
    intervalsRef.current.forEach(clearInterval)
    timeoutsRef.current = []
    intervalsRef.current = []

    setMessages([])
    setCurrentStreamingId(null)

    const bootSequence = [
      { type: 'system' as const, content: t('projectDetail.terminal.initializing', { title: projectTitle }), delay: 0 },
      { type: 'user' as const, content: 'help', delay: 300 },
      { type: 'assistant' as const, content: helpContent, delay: 600 },
    ]

    bootSequence.forEach((msg, index) => {
      const timeout = setTimeout(() => {
        const isLastAssistant = msg.type === 'assistant' && index === bootSequence.length - 1
        const newMsg: Message = {
          id: `boot-${index}`,
          type: msg.type,
          content: isLastAssistant ? '' : msg.content,
          timestamp: new Date(),
          isStreaming: isLastAssistant
        }

        // Add message first
        setMessages(prev => [...prev, newMsg])

        // Then start streaming if needed (with a small delay to ensure state is updated)
        if (isLastAssistant) {
          setCurrentStreamingId(newMsg.id)
          const streamTimeout = setTimeout(() => {
            streamTextWithRef(msg.content, newMsg.id)
          }, 50)
          timeoutsRef.current.push(streamTimeout)
        }
      }, msg.delay)

      timeoutsRef.current.push(timeout)
    })

    return () => {
      timeoutsRef.current.forEach(clearTimeout)
      intervalsRef.current.forEach(clearInterval)
      timeoutsRef.current = []
      intervalsRef.current = []
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  // Auto scroll to bottom (within terminal only, not the page)
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  // Handle command input
  const handleCommand = (command: string) => {
    if (!command.trim()) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: command,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    setIsThinking(true)

    // Simulate a short processing delay before responding
    const responseTimeout = setTimeout(() => {
      setIsThinking(false)
      const responseId = `assistant-${Date.now()}`
      let response = ''

      const cmd = command.toLowerCase().trim()

      if (cmd === 'help') {
        response = helpContent
      } else if (cmd === 'info') {
        response = `**${projectTitle}**\n\nID: \`${projectId}\`\nStack: ${technologies.slice(0, 3).join(', ')}${technologies.length > 3 ? '...' : ''}`
      } else if (cmd === 'stack') {
        response = `**${t('projectDetail.terminal.stackHeading')}**\n\n${technologies.map(tech => `- ${tech}`).join('\n') || t('projectDetail.terminal.noTech')}`
      } else if (cmd === 'links') {
        response = t('projectDetail.terminal.linksResponse')
      } else if (cmd === 'clear') {
        setMessages([])
        return
      } else {
        response = `${t('projectDetail.terminal.notRecognized', { command })}\n\n${t('projectDetail.terminal.typeHelp')}`
      }

      const assistantMsg: Message = {
        id: responseId,
        type: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true
      }

      // Add message first, then start streaming with small delay
      setMessages(prev => [...prev, assistantMsg])
      setCurrentStreamingId(responseId)
      const streamTimeout = setTimeout(() => {
        streamTextWithRef(response, responseId)
      }, 50)
      timeoutsRef.current.push(streamTimeout)
    }, 600 + Math.random() * 400)

    timeoutsRef.current.push(responseTimeout)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isThinking && !currentStreamingId) {
      handleCommand(inputValue)
    }
  }

  // Render markdown-like content (input is HTML-escaped first)
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      let processed = escapeHtml(line)
      // Bold text
      processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong class="text-secondary">$1</strong>')
      // Code
      processed = processed.replace(/`(.*?)`/g, '<code class="bg-gray-800 px-1.5 py-0.5 rounded text-xs text-orange-300">$1</code>')
      // List items
      if (processed.startsWith('- ')) {
        processed = `<span class="text-gray-500 mr-2">•</span>${processed.slice(2)}`
      }

      return (
        <div
          key={i}
          className="leading-relaxed"
          dangerouslySetInnerHTML={{ __html: processed || '&nbsp;' }}
        />
      )
    })
  }

  return (
    <div className={`bg-[#0d0d0d] border-t border-gray-800 flex flex-col transition-all duration-300 ${isCollapsed ? 'h-10' : 'h-[420px]'}`}>
      {/* Terminal Header */}
      <button
        type="button"
        onClick={onToggleCollapse}
        aria-expanded={!isCollapsed}
        aria-controls={panelId}
        className="flex items-center justify-between px-4 py-2 bg-[#0a0a0a] border-b border-gray-800 cursor-pointer select-none text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" aria-hidden="true"></span>
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">{t('projectDetail.terminal.title')}</span>
          </div>
          {isThinking && (
            <div className="flex items-center gap-1.5 text-secondary ml-2">
              <span className="text-[10px] text-gray-500 mr-1">{t('projectDetail.terminal.thinking')}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-sparkle" style={{ animationDelay: '0ms' }} aria-hidden="true"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-sparkle" style={{ animationDelay: '200ms' }} aria-hidden="true"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-sparkle" style={{ animationDelay: '400ms' }} aria-hidden="true"></span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-600 font-mono">
          <span aria-hidden="true">{isCollapsed ? '▲' : '▼'}</span>
          <span>claude-dev</span>
        </div>
      </button>

      {/* Messages Area */}
      {!isCollapsed && (
        <div id={panelId} className="animate-terminal-fade-in flex flex-col flex-1 min-h-0">
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm custom-scrollbar"
            role="log"
            aria-live="polite"
            aria-label={t('projectDetail.terminal.ariaLabel')}
          >
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-message-slide`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2.5 transition-all duration-200 ${
                    msg.type === 'user'
                      ? 'bg-secondary/20 text-secondary border-l-2 border-secondary'
                      : msg.type === 'system'
                        ? 'bg-gray-900/30 text-gray-500 text-xs italic'
                        : 'bg-gray-900/50 text-gray-300 border-l-2 border-gray-700'
                  }`}
                >
                  {msg.type === 'user' ? (
                    <div className="flex items-center gap-2">
                      <span className="text-secondary/70" aria-hidden="true">$</span>
                      <span>{msg.content}</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {renderContent(msg.content)}
                      {msg.isStreaming && (
                        <span className="inline-block w-2 h-4 bg-secondary/70 animate-pulse ml-0.5" aria-hidden="true"></span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-800 p-3 bg-[#080808] flex-shrink-0">
            <div className="flex items-center gap-3 bg-black/50 rounded-lg border border-gray-800 px-4 py-2 focus-within:border-secondary/50 transition-colors">
              <span className="text-secondary font-bold text-sm" aria-hidden="true">❯</span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isThinking ? t('projectDetail.terminal.thinkingPlaceholder') : t('projectDetail.terminal.placeholder')}
                disabled={isThinking || !!currentStreamingId}
                aria-label={t('projectDetail.terminal.placeholder')}
                className="flex-1 bg-transparent outline-none text-gray-300 font-mono text-sm placeholder-gray-700 disabled:opacity-50"
              />
              {!isThinking && !currentStreamingId && inputValue && (
                <button
                  onClick={() => handleCommand(inputValue)}
                  className="text-secondary hover:text-white transition-colors text-sm"
                  aria-label={t('projectDetail.terminal.placeholder')}
                >
                  ↵
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
