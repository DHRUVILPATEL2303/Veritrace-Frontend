import { cn } from '@/lib/utils'

/** Plain section wrapper. The animated aurora was retired in the ledger redesign. */
export const AuroraBackground = ({ className, children, showRadialGradient, ...props }) => {
  return (
    <div className={cn('relative', className)} {...props}>
      {children}
    </div>
  )
}
