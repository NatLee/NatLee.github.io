'use client'

import React, { useState, useEffect, useRef } from 'react'

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

// AI-style boot sequence messages
const getBootSequence = (projectId: string, projectTitle: string, technologies: string[] = []) => [
  { type: 'system' as const, content: `Initializing project environment...`, delay: 0 },
  { type: 'assistant' as const, content: `Analyzing ${projectTitle}...`, delay: 400 },
  { type: 'assistant' as const, content: `\n**Project:** ${projectTitle}\n\n**Dependencies resolved:**\n${technologies.slice(0, 5).map(t => `- ${t}`).join('\n')}\n\n✓ Environment ready. Type \`help\` for available commands.`, delay: 800 },
]

export default function AIChatTerminal({ projectId, projectTitle, technologies = [], isCollapsed, onToggleCollapse }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [currentStreamingId, setCurrentStreamingId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasBootedRef = useRef<string | null>(null)
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])
  const intervalsRef = useRef<NodeJS.Timeout[]>([])

  // Boot sequence effect - only runs once per projectId
  useEffect(() => {
    // Skip if already booted for this project
    if (hasBootedRef.current === projectId) return
    hasBootedRef.current = projectId

    // Clear any existing timeouts/intervals
    timeoutsRef.current.forEach(clearTimeout)
    intervalsRef.current.forEach(clearInterval)
    timeoutsRef.current = []
    intervalsRef.current = []

    setMessages([])
    setCurrentStreamingId(null)
    
    const bootSequence = getBootSequence(projectId, projectTitle, technologies)

    bootSequence.forEach((msg, index) => {
      const timeout = setTimeout(() => {
        const newMsg: Message = {
          id: `boot-${index}`,
          type: msg.type,
          content: msg.content,
          timestamp: new Date(),
          isStreaming: msg.type === 'assistant' && index === bootSequence.length - 1
        }
        
        if (newMsg.isStreaming) {
          setCurrentStreamingId(newMsg.id)
          streamTextWithRef(newMsg.content, newMsg.id)
        }
        
        setMessages(prev => [...prev, { ...newMsg, content: newMsg.isStreaming ? '' : newMsg.content }])
      }, msg.delay)
      
      timeoutsRef.current.push(timeout)
    })

    return () => {
      timeoutsRef.current.forEach(clearTimeout)
      intervalsRef.current.forEach(clearInterval)
    }
  }, [projectId, projectTitle, technologies])

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

    // Simulate AI response
    setTimeout(() => {
      setIsThinking(false)
      const responseId = `assistant-${Date.now()}`
      let response = ''

      const cmd = command.toLowerCase().trim()
      
      if (cmd === 'help') {
        response = `**Available commands:**\n\n- \`info\` - Show project information\n- \`stack\` - List technology stack\n- \`links\` - Show project links\n- \`clear\` - Clear terminal\n- \`help\` - Show this help message`
      } else if (cmd === 'info') {
        response = `**${projectTitle}**\n\nID: \`${projectId}\`\nStack: ${technologies.slice(0, 3).join(', ')}${technologies.length > 3 ? '...' : ''}`
      } else if (cmd === 'stack') {
        response = `**Technology Stack:**\n\n${technologies.map(t => `- ${t}`).join('\n') || 'No technologies listed.'}`
      } else if (cmd === 'links') {
        response = `Check the **config.ts** tab above for project links and deployment information.`
      } else if (cmd === 'clear') {
        setMessages([])
        return
      } else {
        response = `Command not recognized: \`${command}\`\n\nType \`help\` for available commands.`
      }

      const assistantMsg: Message = {
        id: responseId,
        type: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true
      }
      
      setMessages(prev => [...prev, assistantMsg])
      setCurrentStreamingId(responseId)
      streamTextWithRef(response, responseId)
    }, 600 + Math.random() * 400)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isThinking && !currentStreamingId) {
      handleCommand(inputValue)
    }
  }

  // Render markdown-like content
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      // Bold text
      let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-secondary">$1</strong>')
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
    <div className={`bg-[#0d0d0d] border-t border-gray-800 flex flex-col transition-all duration-300 ${isCollapsed ? 'h-10' : 'h-56'}`}>
      {/* Terminal Header */}
      <div 
        className="flex items-center justify-between px-4 py-2 bg-[#0a0a0a] border-b border-gray-800 cursor-pointer select-none"
        onClick={onToggleCollapse}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">AI Terminal</span>
          </div>
          {isThinking && (
            <div className="flex items-center gap-1.5 text-secondary ml-2">
              <span className="text-[10px] text-gray-500 mr-1">thinking</span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-sparkle" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-sparkle" style={{ animationDelay: '200ms' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-sparkle" style={{ animationDelay: '400ms' }}></span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-600 font-mono">
          <span>{isCollapsed ? '▲' : '▼'}</span>
          <span>claude-dev</span>
        </div>
      </div>

      {/* Messages Area */}
      {!isCollapsed && (
        <div className="animate-terminal-fade-in flex flex-col flex-1 min-h-0">
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm custom-scrollbar">
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
                      <span className="text-secondary/70">$</span>
                      <span>{msg.content}</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {renderContent(msg.content)}
                      {msg.isStreaming && (
                        <span className="inline-block w-2 h-4 bg-secondary/70 animate-pulse ml-0.5"></span>
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
              <span className="text-secondary font-bold text-sm">❯</span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isThinking ? 'Thinking...' : 'Type a command...'}
                disabled={isThinking || !!currentStreamingId}
                className="flex-1 bg-transparent outline-none text-gray-300 font-mono text-sm placeholder-gray-700 disabled:opacity-50"
              />
              {!isThinking && !currentStreamingId && inputValue && (
                <button 
                  onClick={() => handleCommand(inputValue)}
                  className="text-secondary hover:text-white transition-colors text-sm"
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
