import { TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, Info, CircleX as XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const icons = { info: Info, success: CheckCircle2, warning: AlertTriangle, danger: XCircle, error: XCircle }
const styles = {
  info: 'text-[var(--text-2)] border-[var(--border-2)] [--bar:var(--accent)]',
  success: 'text-[var(--text-2)] border-[var(--success-border)] [--bar:var(--success-text)]',
  warning: 'text-[var(--text-2)] border-[var(--warning-border)] [--bar:var(--warning-text)]',
  danger: 'text-[var(--text-2)] border-[var(--danger-border)] [--bar:var(--danger-text)]',
  error: 'text-[var(--text-2)] border-[var(--danger-border)] [--bar:var(--danger-text)]',
}

export function Alert({ variant = 'info', children, className }) {
  const Icon = icons[variant] || Info
  return (
    <div
      role="status"
      className={cn('relative flex gap-3 pl-4 pr-3.5 py-3 rounded-[5px] border bg-[var(--surface)] text-sm leading-relaxed overflow-hidden', styles[variant] || styles.info, className)}
    >
      <span aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: 'var(--bar)' }} />
      <Icon size={16} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--bar)' }} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}
