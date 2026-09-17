import { ExternalLink } from 'lucide-react'
import { ARBITRUM_SEPOLIA } from '../../config'
import { Identicon } from './Identicon'
import { CopyButton } from '../ui/copy-button'
import { cn } from '@/lib/utils'

export function shortHex(value = '', head = 6, tail = 4) {
  if (!value) return '—'
  if (value.length <= head + tail + 1) return value
  return `${value.slice(0, head)}…${value.slice(-tail)}`
}

/** Address with identicon, truncated hex, and an Arbiscan link. */
export function Address({ address, head = 6, tail = 4, link = true, copy = false, size = 20, className }) {
  if (!address) return <span className={cn('addr text-[var(--text-3)]', className)}>Unknown</span>
  const text = shortHex(address, head, tail)
  return (
    <span className={cn('addr', className)} title={address}>
      <Identicon address={address} size={size} />
      {link ? (
        <a href={`${ARBITRUM_SEPOLIA.explorer}/address/${address}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
          {text} <ExternalLink size={10} className="opacity-60" />
        </a>
      ) : (
        <span>{text}</span>
      )}
      {copy && <CopyButton text={address} size={11} className="w-5 h-5" />}
    </span>
  )
}

/** Transaction hash link. */
export function TxHash({ hash, head = 10, tail = 6, className }) {
  if (!hash) return null
  return (
    <a href={`${ARBITRUM_SEPOLIA.explorer}/tx/${hash}`} target="_blank" rel="noopener noreferrer" title={hash} className={cn('font-mono text-[var(--accent)] hover:underline underline-offset-4 inline-flex items-center gap-1', className)}>
      {shortHex(hash, head, tail)} <ExternalLink size={10} className="opacity-60" />
    </a>
  )
}
