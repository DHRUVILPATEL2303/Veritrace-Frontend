import { cn } from '@/lib/utils'

export function Card({ className, children, hover = false, ...props }) {
  return (
    <div
      data-card-surface
      className={cn(
        'panel overflow-hidden',
        hover && 'hover:border-[var(--border-2)]',
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
    <div className={cn('flex items-center justify-between gap-3 px-6 py-4 border-b border-[var(--border)] bg-[var(--surface-2)]', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn('card-title font-sans text-sm font-semibold tracking-normal flex items-center gap-2 text-[var(--text)]', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardBody({ className, children, ...props }) {
  return <div className={cn('p-6', className)} {...props}>{children}</div>
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn('flex items-center px-6 py-4 border-t border-[var(--border)] bg-[var(--surface-2)]', className)} {...props}>
      {children}
    </div>
  )
}
