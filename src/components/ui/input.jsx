import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Input = forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full px-3.5 py-2.5 text-sm rounded-lg bg-[var(--color-base-50)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] transition-all duration-200 focus-ring focus:border-blue-500/50',
        className
      )}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export const Select = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        'w-full px-3.5 py-2.5 text-sm rounded-lg bg-[var(--color-base-50)] border border-[var(--color-border)] text-[var(--color-text)] transition-all duration-200 focus-ring focus:border-blue-500/50 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
})
Select.displayName = 'Select'

export const Textarea = forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        'w-full px-3.5 py-2.5 text-sm rounded-lg bg-[var(--color-base-50)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] transition-all duration-200 focus-ring focus:border-blue-500/50 resize-none',
        className
      )}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'
