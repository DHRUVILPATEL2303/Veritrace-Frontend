import { CopyButton } from './copy-button'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

const VARIANTS = {
  crypto: { label: 'SHA', tooltip: 'Cryptographic hash used for byte-for-byte exact matches on the blockchain.' },
  perceptual: { label: 'pHash', tooltip: 'Perceptual hash used to find visually similar content and detect modifications.' },
  semantic: { label: 'SEM', tooltip: 'Vision Transformer 64-dimensional semantic embedding vector for AI style and heatmap feature matching.' },
  face: { label: 'FACE', tooltip: 'ArcFace 128D/512D facial landmark geometry mesh for facial recognition and deepfake detection.' },
  audio: { label: 'AUD', tooltip: 'MFCC & wav2vec2 acoustic spectral vector for voice clone and audio deepfake detection.' },
}

export function HashDisplay({ label, hash, icon, variant = 'crypto', className }) {
  const v = VARIANTS[variant] || VARIANTS.crypto

  return (
    <div className={cn('border border-[var(--border)] rounded-[8px] bg-[var(--surface)] overflow-hidden', className)}>
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-[var(--border)] bg-[var(--surface-2)]">
        <Tooltip>
          <TooltipTrigger className="flex items-center gap-2 cursor-help">
            {icon && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-[3px] border border-[var(--border-2)] font-mono text-[10px] font-medium text-[var(--text-2)]">
                {icon}
              </span>
            )}
            <span className="kicker">{label}</span>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="max-w-[220px] text-xs">{v.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="px-3 py-2.5">
        {hash ? (
          <div className="flex items-start gap-2">
            <span className="flex-1 hash-display text-[var(--text)]">{hash}</span>
            <CopyButton text={hash} />
          </div>
        ) : (
          <div className="hash-display text-[var(--text-4)]">Awaiting file upload...</div>
        )}
      </div>
    </div>
  )
}
