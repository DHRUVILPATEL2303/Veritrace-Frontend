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
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          style={{ background: 'var(--bg)', backdropFilter: 'none' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn('relative w-full bg-[var(--surface)] border border-[var(--border-2)] rounded-2xl shadow-2xl h-[92vh] max-h-[92vh] flex flex-col overflow-hidden', maxWidth, className)}
            onClick={(e) => e.stopPropagation()}
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
    <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
      <h2 className="text-base font-bold flex items-center gap-2 text-[var(--text)]">{icon}{title}</h2>
      <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-3)] hover:bg-[var(--bg-2)] hover:text-[var(--text)] transition-colors">
        <X size={18} />
      </button>
    </div>
  )
}
