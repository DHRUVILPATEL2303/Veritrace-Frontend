import { cn } from '@/lib/utils'

const SIZES = { xs: 12, sm: 16, md: 22, lg: 32 }

export function Spinner({ size = 22, className }) {
  const px = typeof size === 'number' ? size : (SIZES[size] || 22)
  return (
    <span
      className={cn('inline-block animate-spin rounded-full border-2 border-[var(--border-2)]', className)}
      style={{ width: px, height: px, borderTopColor: 'var(--accent)' }}
      aria-hidden="true"
    />
  )
}
