import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
}

const styles = {
  info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  success: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  warning: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  danger: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export function Alert({ variant = 'info', children, className }) {
  const Icon = icons[variant] || Info
  return (
    <div className={cn('flex gap-3 p-3.5 rounded-lg border text-sm leading-relaxed', styles[variant], className)}>
      <Icon size={18} className="flex-shrink-0 mt-0.5" />
      <div className="flex-1">{children}</div>
    </div>
  )
}
