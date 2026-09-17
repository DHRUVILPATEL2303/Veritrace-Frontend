import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 px-1.5 py-[3px] rounded-[4px] font-mono text-[10.5px] font-medium uppercase tracking-[.06em] leading-none whitespace-nowrap border',
  {
    variants: {
      variant: {
        default: 'bg-[var(--bg-2)] text-[var(--text-2)] border-[var(--border)]',
        arb: 'bg-[var(--arb-bg)] text-[var(--accent)] border-[var(--arb-border)]',
        success: 'bg-[var(--success-bg)] text-[var(--success-text)] border-[var(--success-border)]',
        warning: 'bg-[var(--warning-bg)] text-[var(--warning-text)] border-[var(--warning-border)]',
        danger: 'bg-[var(--danger-bg)] text-[var(--danger-text)] border-[var(--danger-border)]',
        info: 'bg-[var(--arb-bg)] text-[var(--accent)] border-[var(--arb-border)]',
        ink: 'bg-[var(--ink)] text-[var(--ink-text)] border-[var(--ink)]',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export function Badge({ className, variant, children, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props}>{children}</span>
}
