import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const base = 'w-full px-3 py-2.5 text-sm rounded-[5px] bg-[var(--surface)] border border-[var(--border-2)] text-[var(--text)] placeholder:text-[var(--text-4)] outline-none focus:border-[var(--accent)] disabled:bg-[var(--bg-2)] disabled:text-[var(--text-3)] disabled:cursor-not-allowed'

export const Input = forwardRef(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(base, className)} {...props} />
))
Input.displayName = 'Input'

export const Select = forwardRef(({ className, children, ...props }, ref) => (
  <select ref={ref} className={cn(base, 'cursor-pointer', className)} {...props}>
    {children}
  </select>
))
Select.displayName = 'Select'

export const Textarea = forwardRef(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(base, 'resize-none', className)} {...props} />
))
Textarea.displayName = 'Textarea'
