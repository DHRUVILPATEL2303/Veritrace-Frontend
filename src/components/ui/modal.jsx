import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Modal({ open, onClose, children, className, maxWidth = 'max-w-2xl' }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="overlay-scrim fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={cn('relative w-full max-h-[85vh] bg-[var(--surface)] border border-[var(--border-2)] rounded-[12px] flex flex-col overflow-hidden', maxWidth, className)}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function ModalHeader({ title, onClose, icon }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]">
      <h2 className="font-sans text-sm font-semibold flex items-center gap-2 text-[var(--text)]">{icon}{title}</h2>
      <button onClick={onClose} aria-label="Close" className="w-7 h-7 rounded-[4px] flex items-center justify-center text-[var(--text-3)] hover:bg-[var(--bg-3)] hover:text-[var(--text)]">
        <X size={16} />
      </button>
    </div>
  )
}
