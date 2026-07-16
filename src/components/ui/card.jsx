import { cn } from '@/lib/utils'

export function Card({ className, children, hover = false, glow = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-300',
        hover && 'hover:border-[var(--color-border-hover)] hover:shadow-lg',
        glow && 'shadow-[0_0_40px_rgba(59,130,246,0.08)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={cn('flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn('text-sm font-bold text-[var(--color-text)] flex items-center gap-2', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardBody({ className, children, ...props }) {
  return (
    <div className={cn('p-5', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn('flex items-center justify-center px-5 py-3 border-t border-[var(--color-border)] bg-[var(--color-base-50)]', className)}
      {...props}
    >
      {children}
    </div>
  )
}
