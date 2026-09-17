import { cn } from '@/lib/utils'

/** Plain wrapper. The mouse-follow spotlight was removed as part of the ledger redesign. */
export function SpotlightCard({ children, className }) {
  return <div className={cn('relative', className)}>{children}</div>
}
