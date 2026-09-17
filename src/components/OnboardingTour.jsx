import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, FilePlus, Search, Library, User, Database, ArrowRight, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { OPEN_CHAT_EVENT } from './ChatWidget'

const TOUR_STORAGE_KEY = 'veritrace_tour_completed'
export const OPEN_TOUR_EVENT = 'veritrace:open-tour'

/** Dispatch this from anywhere (e.g. a footer "Take the tour" link) to replay onboarding on demand. */
export function replayTour() {
  window.dispatchEvent(new Event(OPEN_TOUR_EVENT))
}

const steps = [
  {
    icon: Sparkles,
    title: 'Welcome to VeriTrace',
    description: "VeriTrace proves a file is authentic and traces where it came from, permanently, on the blockchain. Here's a 30-second look at what you can do — skip anytime.",
  },
  {
    icon: FilePlus,
    title: 'Register a file',
    description: 'Upload an image, video, or document to create its unique fingerprint and record it on-chain as proof you own the original.',
    path: '/register',
    cta: 'Go to Register',
  },
  {
    icon: Search,
    title: 'Verify a file',
    description: "Not sure if something is genuine? Upload it here and VeriTrace instantly checks it against everything that's been registered.",
    path: '/verify',
    cta: 'Go to Verify',
  },
  {
    icon: Library,
    title: 'Browse the Library',
    description: 'See every file registered on VeriTrace along with its full verification history, all in one place.',
    path: '/library',
    cta: 'Open Library',
  },
  {
    icon: User,
    title: 'Your Profile',
    description: 'Connect your wallet to view everything you’ve registered and manage your account.',
    path: '/profile',
    cta: 'Open Profile',
  },
  {
    icon: Database,
    title: 'Built for teams too',
    description: 'The Enterprise page covers bulk registration, team access, and API integration for organizations.',
    path: '/enterprise',
    cta: 'Explore Enterprise',
  },
]

export default function OnboardingTour() {
  const [open, setOpen] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const alreadySeen = window.localStorage.getItem(TOUR_STORAGE_KEY)
    let timer
    if (!alreadySeen) {
      timer = window.setTimeout(() => setOpen(true), 700)
    }

    const handleReplay = () => {
      setStepIndex(0)
      setOpen(true)
    }
    window.addEventListener(OPEN_TOUR_EVENT, handleReplay)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener(OPEN_TOUR_EVENT, handleReplay)
    }
  }, [])

  const finish = useCallback(() => {
    window.localStorage.setItem(TOUR_STORAGE_KEY, 'true')
    setOpen(false)
    // Give the tour's close animation a moment before the chat bubble pops open.
    window.setTimeout(() => window.dispatchEvent(new Event(OPEN_CHAT_EVENT)), 400)
  }, [])

  const goNext = () => {
    if (stepIndex === steps.length - 1) finish()
    else setStepIndex((i) => i + 1)
  }

  const goBack = () => setStepIndex((i) => Math.max(0, i - 1))

  const goToStepPage = () => {
    const step = steps[stepIndex]
    finish()
    if (step.path) navigate(step.path)
  }

  if (!open) return null

  const step = steps[stepIndex]
  const Icon = step.icon
  const isLast = stepIndex === steps.length - 1
  const isFirst = stepIndex === 0

  return (
    <AnimatePresence>
      <motion.div
        key="onboarding-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="overlay-scrim fixed inset-0 z-[1100] flex items-center justify-center p-4"
      >
        <motion.div
          key={`onboarding-card-${stepIndex}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-[var(--surface)] border border-[var(--border-2)] rounded-[12px] overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Welcome tour"
        >
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-[var(--border)] bg-[var(--surface-2)]">
            <span className="kicker">Tour · {String(stepIndex + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}</span>
            <button
              type="button"
              onClick={finish}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-[4px] text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[var(--bg-3)]"
            >
              Skip <X size={13} />
            </button>
          </div>

          <div className="px-6 pt-6 pb-6">
            <div className="w-10 h-10 rounded-[8px] border border-[var(--accent-border)] bg-[var(--accent-bg)] flex items-center justify-center mb-4 text-[var(--accent)]">
              <Icon size={18} />
            </div>

            <h2 className="text-xl font-bold text-[var(--text)] mb-2">{step.title}</h2>
            <p className="text-sm leading-relaxed text-[var(--text-2)] m-0">{step.description}</p>

            {step.path && (
              <button
                type="button"
                onClick={goToStepPage}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] hover:underline underline-offset-4"
              >
                {step.cta} <ArrowRight size={14} />
              </button>
            )}
          </div>

          {/* Footer nav */}
          <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={goBack}
              disabled={isFirst}
              className={cn('btn btn-ghost text-xs px-3 py-2', isFirst && 'opacity-0 pointer-events-none')}
            >
              <ArrowLeft size={14} /> Back
            </button>

            <div className="flex items-center gap-1" aria-hidden="true">
              {steps.map((_, i) => (
                <span key={i} className={cn('h-1 rounded-[1px] transition-all duration-300', i === stepIndex ? 'w-5 bg-[var(--accent)]' : 'w-2 bg-[var(--border-2)]')} />
              ))}
            </div>

            <button type="button" onClick={goNext} className="btn btn-primary text-xs px-4 py-2">
              {isLast ? 'Get started' : 'Next'} <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
