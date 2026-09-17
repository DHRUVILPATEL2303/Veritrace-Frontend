/** ArbitrumLogo — the "A" mark, drawn in the current accent. */
export function ArbitrumLogo({ size = 24, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3.5 20.5L9.5 3.5H14.5L20.5 20.5H16.5L15.3 17H8.7L7.5 20.5H3.5ZM9.9 13.7H14.1L12 7.2L9.9 13.7Z" fill="var(--accent)" />
    </svg>
  )
}

/** VeriTraceLogo — V-checkmark with pixel dispersion, set in ink and accent. */
export function VeriTraceLogo({ size = 32, className }) {
  return (
    <span className={`inline-flex items-center justify-center ${className || ''}`}>
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Left leg of the V in ink */}
        <path d="M28 24 L44 24 L52 64 L56 76 L40 76 L36 64 Z" fill="currentColor" />
        {/* Right leg / checkmark in accent */}
        <path d="M36 56 L44 56 L56 76 L52 64 L88 24 L76 24 L48 60 Z" fill="var(--accent)" />
        {/* Pixel dispersion trail */}
        <rect x="82" y="22" width="4" height="4" rx="0.6" fill="var(--accent)" opacity="0.95" />
        <rect x="88" y="18" width="3.5" height="3.5" rx="0.5" fill="var(--accent)" opacity="0.85" />
        <rect x="84" y="14" width="3.5" height="3.5" rx="0.5" fill="var(--accent)" opacity="0.75" />
        <rect x="78" y="17" width="3" height="3" rx="0.4" fill="currentColor" opacity="0.7" />
        <rect x="92" y="22" width="2.8" height="2.8" rx="0.4" fill="var(--accent)" opacity="0.65" />
        <rect x="90" y="14" width="2.5" height="2.5" rx="0.3" fill="var(--accent)" opacity="0.6" />
        <rect x="86" y="10" width="2.5" height="2.5" rx="0.3" fill="currentColor" opacity="0.55" />
        <rect x="80" y="10" width="2.5" height="2.5" rx="0.3" fill="var(--accent)" opacity="0.5" />
        <rect x="94" y="16" width="2.2" height="2.2" rx="0.3" fill="var(--accent)" opacity="0.45" />
        <rect x="96" y="20" width="1.8" height="1.8" rx="0.2" fill="currentColor" opacity="0.4" />
        <rect x="92" y="10" width="1.6" height="1.6" rx="0.2" fill="var(--accent)" opacity="0.35" />
        <rect x="88" y="7" width="1.8" height="1.8" rx="0.2" fill="var(--accent)" opacity="0.3" />
        <rect x="84" y="6" width="1.4" height="1.4" rx="0.2" fill="currentColor" opacity="0.25" />
      </svg>
    </span>
  )
}

/** AnimatedArbitrumBadge — kept for compatibility; now a static chip. */
export function AnimatedArbitrumBadge({ text }) {
  return (
    <span className="chip">
      <ArbitrumLogo size={11} />
      {text}
    </span>
  )
}

/** AnimatedNetworkBadge — kept for compatibility; now a static chip with a live dot. */
export function AnimatedNetworkBadge({ text }) {
  return (
    <span className="chip">
      <span className="live-dot" aria-hidden="true" />
      {text}
    </span>
  )
}

/** ArbitrumOrbit — decorative rings retired; renders nothing. */
export function ArbitrumOrbit() {
  return null
}
