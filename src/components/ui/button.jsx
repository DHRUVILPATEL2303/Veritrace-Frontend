import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap select-none',
  {
    variants: {
      variant: {
        primary: 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-[0_0_24px_rgba(59,130,246,0.4)] active:scale-[0.98]',
        success: 'bg-emerald-400 text-black hover:bg-emerald-300 hover:shadow-[0_0_24px_rgba(0,230,118,0.4)] active:scale-[0.98]',
        outline: 'border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]',
        ghost: 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]',
        danger: 'bg-red-500/90 text-white hover:bg-red-500 hover:shadow-[0_0_24px_rgba(255,82,82,0.3)] active:scale-[0.98]',
        glass: 'glass text-[var(--color-text)] hover:border-[var(--color-accent-border)] hover:shadow-[0_0_24px_rgba(59,130,246,0.15)]',
      },
      size: {
        sm: 'text-xs px-3 py-1.5',
        md: 'text-sm px-4 py-2',
        lg: 'text-base px-6 py-3',
        icon: 'p-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export const Button = forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
})
Button.displayName = 'Button'
