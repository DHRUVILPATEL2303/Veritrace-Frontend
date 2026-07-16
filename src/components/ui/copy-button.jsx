import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CopyButton({ text, className, size = 16 }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'flex-shrink-0 w-7 h-7 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-text-muted)] transition-all hover:border-blue-500/50 hover:text-blue-400',
        className
      )}
      title="Copy to clipboard"
    >
      {copied ? (
        <Check size={size} className="text-emerald-400" />
      ) : (
        <Copy size={size} />
      )}
    </button>
  )
}
