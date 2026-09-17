import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Bot, ArrowUp } from 'lucide-react'
import { RAG_BOT_API } from '../config'

export const OPEN_CHAT_EVENT = 'veritrace:open-chat'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Let other components (e.g. the onboarding tour) open the chat on demand.
  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener(OPEN_CHAT_EVENT, handleOpen)
    return () => window.removeEventListener(OPEN_CHAT_EVENT, handleOpen)
  }, [])

  // Track scroll position for "Back to top" arrow
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('veritrace_chat_history')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        // Fallback
      }
    }
    return [
      {
        id: 'welcome',
        text: 'Hi! I am the VeriTrace Help Assistant, grounded in platform documentation. Ask me about fingerprinting, visual similarity matching thresholds, or request content verification checks and team alerts!',
        sender: 'bot',
        timestamp: new Date().toISOString(),
      },
    ]
  })
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)

  const messagesEndRef = useRef(null)

  useEffect(() => {
    sessionStorage.setItem('veritrace_chat_history', JSON.stringify(messages))
    if (!isOpen && messages.length > 1 && messages[messages.length - 1].sender === 'bot') {
      setHasUnread(true)
    }
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false)
      scrollToBottom()
    }
  }, [isOpen])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async (e) => {
    if (e) e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      id: `user-${Date.now()}`,
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    const botMessageId = `bot-${Date.now()}`
    let messageAdded = false
    let accumulatedText = ''

    try {
      const response = await fetch(`${RAG_BOT_API.replace(/\/$/, '')}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.text }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      if (!response.body) {
        throw new Error('Streaming response body not available')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const events = buffer.split('\n\n')
        buffer = events.pop() || ''

        for (const rawEvent of events) {
          const dataLines = rawEvent
            .split('\n')
            .filter((line) => line.startsWith('data:'))
            .map((line) => line.slice(5).trim())

          if (!dataLines.length) continue

          let eventObj
          try {
            eventObj = JSON.parse(dataLines.join('\n'))
          } catch {
            continue
          }

          if (eventObj.type === 'tool_start') {
            const toolName = eventObj.tool || 'Processing'
            setMessages((prev) => {
              if (!messageAdded) {
                messageAdded = true
                return [
                  ...prev,
                  {
                    id: botMessageId,
                    text: '',
                    sender: 'bot',
                    timestamp: new Date().toISOString(),
                    toolStatus: toolName,
                  },
                ]
              }
              return prev.map((msg) =>
                msg.id === botMessageId ? { ...msg, toolStatus: toolName } : msg
              )
            })
          } else if (eventObj.type === 'tool_end') {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === botMessageId ? { ...msg, toolStatus: null } : msg
              )
            )
          } else if (eventObj.type === 'token') {
            accumulatedText += eventObj.content
            const currentText = accumulatedText
            setMessages((prev) => {
              if (!messageAdded) {
                messageAdded = true
                return [
                  ...prev,
                  {
                    id: botMessageId,
                    text: currentText,
                    sender: 'bot',
                    timestamp: new Date().toISOString(),
                    toolStatus: null,
                  },
                ]
              }
              return prev.map((msg) =>
                msg.id === botMessageId
                  ? { ...msg, text: currentText, toolStatus: null }
                  : msg
              )
            })
          } else if (eventObj.type === 'error') {
            throw new Error(eventObj.message || 'Stream error')
          }
        }
      }

      if (!accumulatedText && !messageAdded) {
        const botMessage = {
          id: botMessageId,
          text: "I couldn't process that request. Please try again.",
          sender: 'bot',
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, botMessage])
      }
    } catch (err) {
      console.error('Chat bot error:', err)
      const errorMessage = {
        id: `error-${Date.now()}`,
        text: 'Sorry, I am having trouble connecting to the helper service. Please verify the RAG Bot API deployment status.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isError: true,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Simple formatter for bold text, hashes, bullet points, and newlines
  const formatMessageText = (text) => {
    if (!text) return ''
    
    // Split by newlines
    const lines = text.split('\n')
    
    return lines.map((line, lineIndex) => {
      let content = line

      // Handle bullet points
      const isBullet = content.startsWith('- ') || content.startsWith('* ')
      if (isBullet) {
        content = content.substring(2)
      }

      // Format bold text (**text**)
      const boldRegex = /\*\*(.*?)\*\*/g
      const parts = []
      let lastIndex = 0
      let match

      while ((match = boldRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
          parts.push(content.substring(lastIndex, match.index))
        }
        parts.push(
          <strong key={match.index} className="font-bold text-[var(--text)]">
            {match[1]}
          </strong>
        )
        lastIndex = boldRegex.lastIndex
      }

      if (lastIndex < content.length) {
        parts.push(content.substring(lastIndex))
      }

      // Check if line looks like code or hash
      const isHash = /0x[a-fA-F0-9]{40,64}/.test(content) || /[a-fA-F0-9]{64}/.test(content)

      const renderedLine = (
        <span className={isHash ? 'font-mono text-xs select-all bg-[var(--bg-3)] px-1.5 py-0.5 rounded-[3px] border border-[var(--border-2)] text-[var(--accent)] break-all' : ''}>
          {parts.length > 0 ? parts : content}
        </span>
      )

      if (isBullet) {
        return (
          <li key={lineIndex} className="ml-4 list-disc mb-1.5 text-[var(--text-2)] leading-relaxed">
            {renderedLine}
          </li>
        )
      }

      return (
        <p key={lineIndex} className="mb-2 leading-relaxed text-[var(--text-2)]">
          {renderedLine}
        </p>
      )
    })
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{ boxShadow: 'var(--shadow-xl)' }}
            className="w-[calc(100vw-3rem)] max-w-[360px] sm:max-w-[380px] h-[520px] max-h-[calc(100vh-120px)] rounded-[8px] bg-[var(--surface)] flex flex-col mb-3 border border-[var(--border-2)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg-2)]">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-[5px] bg-[var(--surface)] flex items-center justify-center text-[var(--accent)] border border-[var(--border-2)]">
                  <Bot size={16} />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[var(--success-text)] border-2 border-[var(--bg)]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                    VeriTrace Assistant
                    <span className="chip !py-0 !px-1 text-[9px]">RAG</span>
                  </div>
                  <div className="text-[10px] text-[var(--text-3)] flex items-center gap-1">
                    <span className="font-mono text-[10px]">Gemini-Grounded Knowledge</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-[4px] flex items-center justify-center text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[var(--bg-3)]"
                aria-label="Close chat"
              >
                <X size={15} />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar bg-[var(--surface)]">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user'
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-start gap-2`}
                  >
                    {!isUser && (
                      <div className="w-6 h-6 rounded-[4px] bg-[var(--surface)] border border-[var(--border-2)] flex items-center justify-center text-[var(--accent)] shrink-0 mt-0.5">
                        <Bot size={12} />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-[6px] px-3.5 py-2.5 text-xs ${
                        isUser
                          ? 'bg-[var(--ink)] text-[var(--ink-text)] rounded-tr-none'
                          : msg.isError
                          ? 'bg-[var(--danger-bg)] border border-[var(--danger-border)] text-[var(--danger-text)] rounded-tl-none'
                          : 'bg-[var(--bg-2)] border border-[var(--border)] text-[var(--text-2)] rounded-tl-none'
                      }`}
                    >
                      {isUser ? (
                        <p className="leading-relaxed select-text">{msg.text}</p>
                      ) : (
                        <div className="select-text space-y-1">
                          {msg.toolStatus && (
                            <div className="flex items-center gap-1.5 text-[11px] text-[var(--accent)] mb-1.5 font-medium italic">
                              <span className="live-dot" style={{ background: 'var(--accent)' }} />
                              <span>{msg.toolStatus}...</span>
                            </div>
                          )}
                          {formatMessageText(msg.text)}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Bouncing Loader */}
              {isLoading && messages[messages.length - 1]?.sender === 'user' && (
                <div className="flex justify-start items-start gap-2">
                  <div className="w-6 h-6 rounded-[4px] bg-[var(--surface)] border border-[var(--border-2)] flex items-center justify-center text-[var(--accent)] shrink-0">
                    <Bot size={12} />
                  </div>
                  <div className="bg-[var(--bg-2)] border border-[var(--border)] rounded-[6px] rounded-tl-none px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSend}
              className="px-3 py-3 border-t border-[var(--border)] bg-[var(--bg-2)] flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about thresholds, duplicates..."
                className="flex-1 bg-[var(--surface)] border border-[var(--border-2)] focus:border-[var(--accent)] rounded-[5px] px-3 py-2 text-xs text-[var(--text)] placeholder-[var(--text-4)] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="w-8 h-8 rounded-[5px] bg-[var(--ink)] text-[var(--ink-text)] flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none hover:bg-[var(--ink-2)]"
                aria-label="Send message"
              >
                <Send size={12} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Buttons Control Row */}
      <div className="flex items-end gap-3">
        {/* Scroll to Top Arrow */}
        <AnimatePresence>
          {showScrollTop && !isOpen && (
            <motion.button
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15 }}
              onClick={scrollToTop}
              className="w-11 h-11 mb-1 rounded-[6px] bg-[var(--surface)] flex items-center justify-center text-[var(--text-2)] hover:text-[var(--text)] border border-[var(--border-2)] hover:border-[var(--text-3)]"
              style={{ boxShadow: 'var(--shadow-md)' }}
              aria-label="Scroll to top"
            >
              <ArrowUp size={20} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Floating Toggle Button */}
        <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-14 h-14 rounded-full flex items-center justify-center relative border border-[var(--border-2)] bg-[var(--surface)] text-[var(--text-2)] hover:text-[var(--text)] hover:border-[var(--text-3)]"
        style={{ boxShadow: 'var(--shadow-lg)' }}
        aria-label="Toggle Help Chatbot"
      >
        {isOpen ? (
          <X size={20} />
        ) : (
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Concentric circular rings around the mascot */}
            <circle cx="50" cy="50" r="38" stroke="var(--border-2)" strokeWidth="1.2" strokeOpacity="0.85" />
            <circle cx="50" cy="50" r="34" stroke="var(--border-2)" strokeWidth="1.2" strokeOpacity="0.45" />

            {/* Bear-like ears */}
            <circle cx="34" cy="27" r="6.5" fill="var(--border-2)" opacity="0.6" />
            <circle cx="66" cy="27" r="6.5" fill="var(--border-2)" opacity="0.6" />

            {/* Shoulders */}
            <path d="M32 55 C29 60 29 66 33 69" fill="none" stroke="var(--accent)" strokeWidth="5.5" strokeLinecap="round" />
            <path d="M68 55 C71 60 71 66 67 69" fill="none" stroke="var(--accent)" strokeWidth="5.5" strokeLinecap="round" />

            {/* Shield Chestplate (VeriTrace Signature Logo) */}
            <path
              d="M50 52 L61 54.5 V64 C61 70 57 74 50 76 C43 74 39 70 39 64 V54.5 Z"
              fill="var(--accent)"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Checkmark inside chest shield */}
            <path d="M45.5 64.5 L48.5 67.5 L54.5 61.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

            {/* Robot Head */}
            <rect x="29" y="26" width="42" height="26" rx="13" fill="var(--accent)" stroke="#ffffff" strokeWidth="1.2" />

            {/* Visor Area */}
            <rect x="35" y="31" width="30" height="13" rx="6.5" fill="var(--ink)" stroke="#ffffff" strokeWidth="0.8" />

            {/* Glowing Eyes */}
            <rect x="40" y="34.5" width="8" height="6" rx="3" fill="var(--mark)" />
            <rect x="52" y="34.5" width="8" height="6" rx="3" fill="var(--mark)" />
            {/* Inner glowing dots */}
            <circle cx="44" cy="37.5" r="1" fill="#ffffff" />
            <circle cx="56" cy="37.5" r="1" fill="#ffffff" />

            {/* Smile Mouth */}
            <path d="M45 46 Q50 50 55 46" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
        
        {/* Unread indicator */}
        {!isOpen && hasUnread && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[var(--success-text)] border-2 border-[var(--surface)] rounded-full" />
        )}
      </button>
      </div>
    </div>
  )
}
