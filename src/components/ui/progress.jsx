import { cn } from '@/lib/utils'

export function Progress({ value = 0, className }) {
  const v = Math.min(100, Math.max(0, value))
  return (
    <div className={cn('w-full h-1.5 rounded-[2px] bg-[var(--bg-3)] overflow-hidden', className)} role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full bg-[var(--accent)] transition-[width] duration-300 ease-out" style={{ width: `${v}%` }} />
    </div>
  )
}
