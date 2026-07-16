import { cn } from '@/lib/utils'

export function Spinner({ size = 24, className }) {
  return (
    <div
      className={cn('animate-spin rounded-full border-2 border-[var(--color-base-300)] border-t-blue-500', className)}
      style={{ width: size, height: size }}
    />
  )
}
