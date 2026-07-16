import { cn } from '@/lib/utils'

export function EmptyState({ icon, title, description, children, className }) {
  return (
    <div className={cn('text-center py-12 px-4', className)}>
      <div className="w-14 h-14 rounded-full bg-[var(--color-base-100)] flex items-center justify-center mx-auto mb-4 text-[var(--color-text-muted)]">
        {icon}
      </div>
      <div className="font-semibold text-sm mb-1.5 text-[var(--color-text)]">{title}</div>
      <div className="text-xs text-[var(--color-text-muted)] max-w-sm mx-auto leading-relaxed">{description}</div>
      {children}
    </div>
  )
}
