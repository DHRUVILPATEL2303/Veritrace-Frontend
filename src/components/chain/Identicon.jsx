import { cn } from '@/lib/utils'

/* Deterministic two-tone disc from an address, in the spirit of explorer identicons. */
function hashString(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function identiconStyle(address = '') {
  const h = hashString(address.toLowerCase())
  const hue1 = h % 360
  const hue2 = (hue1 + 40 + (h >> 8) % 80) % 360
  const angle = (h >> 16) % 360
  return {
    background: `linear-gradient(${angle}deg, hsl(${hue1} 70% 52%) 0 50%, hsl(${hue2} 70% 42%) 50% 100%)`,
  }
}

export function Identicon({ address, size = 22, className }) {
  if (!address) return <span className={cn('identicon', className)} style={{ width: size, height: size, background: 'var(--bg-3)' }} aria-hidden="true" />
  return <span className={cn('identicon', className)} style={{ width: size, height: size, ...identiconStyle(address) }} aria-hidden="true" />
}
