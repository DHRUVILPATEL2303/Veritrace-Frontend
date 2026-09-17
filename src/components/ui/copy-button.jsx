import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CopyButton({ text, className, size = 13 }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'flex-shrink-0 w-6 h-6 rounded-[4px] border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-[var(--text-3)] hover:border-[var(--border-2)] hover:text-[var(--text)]',
        className
      )}
      title={copied ? 'Copied' : 'Copy to clipboard'}
      aria-label="Copy to clipboard"
    >
      {copied ? <Check size={size} className="text-[var(--success-text)]" /> : <Copy size={size} />}
    </button>
  )
}
