import { CopyButton } from './copy-button'
import { cn } from '@/lib/utils'

export function HashDisplay({ label, hash, icon, variant = 'crypto', className }) {
  const colors = {
    crypto: { bg: 'bg-[var(--arb-bg)]', text: 'text-[#12AAFF]', label: 'SHA' },
    perceptual: { bg: 'bg-[var(--success-bg)]', text: 'text-[#00D395]', label: 'pHash' },
  }
  const v = colors[variant] || colors.crypto

  return (
    <div className={cn('p-4 rounded-xl bg-[var(--bg-2)] border border-[var(--border)] animate-fade-up', className)}>
      <div className="flex items-center gap-2 mb-2.5">
        {icon && (
          <span className={cn('flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold flex-shrink-0', v.bg, v.text)}>
            {icon}
          </span>
        )}
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-3)]">{label}</span>
      </div>
      {hash ? (
        <div className="flex items-start gap-2.5">
          <span className="flex-1 hash-display text-[var(--text)] break-all leading-relaxed text-[0.8rem]">{hash}</span>
          <CopyButton text={hash} />
        </div>
      ) : (
        <div className="hash-display text-[var(--text-4)] italic text-sm">Awaiting file upload...</div>
      )}
    </div>
  )
}
