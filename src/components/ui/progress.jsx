import { cn } from '@/lib/utils'

export function Progress({ value = 0, className, variant = 'accent' }) {
  const colors = {
    accent: 'from-blue-500 to-blue-400',
    success: 'from-emerald-500 to-emerald-400',
    danger: 'from-red-500 to-red-400',
  }
  return (
    <div className={cn('w-full h-2 rounded-full bg-[var(--color-base-200)] overflow-hidden', className)}>
      <div
        className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-300 ease-out', colors[variant])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
