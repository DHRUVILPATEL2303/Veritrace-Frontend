import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'bg-[var(--color-base-200)] text-[var(--color-text-secondary)] border border-[var(--color-border)]',
        accent: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
        success: 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/30',
        warning: 'bg-amber-400/10 text-amber-400 border border-amber-400/30',
        danger: 'bg-red-500/10 text-red-400 border border-red-500/30',
        info: 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/30',
        purple: 'bg-purple-400/10 text-purple-400 border border-purple-400/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export function Badge({ className, variant, children, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  )
}
