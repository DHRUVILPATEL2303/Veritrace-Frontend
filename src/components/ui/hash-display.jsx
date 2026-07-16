import { CopyButton } from './copy-button'
import { cn } from '@/lib/utils'

export function HashDisplay({ label, hash, icon, variant = 'crypto', className }) {
  const variants = {
    crypto: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'C' },
    perceptual: { bg: 'bg-emerald-400/10', text: 'text-emerald-400', label: 'P' },
  }
  const v = variants[variant] || variants.crypto

  return (
    <div className={cn('p-3 rounded-lg bg-[var(--color-base-50)] border border-[var(--color-border)]', className)}>
      <div className="flex items-center gap-2 mb-1.5">
        {icon && (
          <span className={cn('flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold', v.bg, v.text)}>
            {icon}
          </span>
        )}
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          {label}
        </span>
      </div>
      {hash ? (
        <div className="flex items-center gap-2">
          <span className="flex-1 font-mono text-xs text-[var(--color-text)] break-all leading-relaxed">
            {hash}
          </span>
          <CopyButton text={hash} />
        </div>
      ) : (
        <div className="font-mono text-xs text-[var(--color-text-faint)] italic">
          Awaiting file upload...
        </div>
      )}
    </div>
  )
}
