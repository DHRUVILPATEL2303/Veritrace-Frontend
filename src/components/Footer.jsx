import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CONTRACT_ADDRESS, ARBITRUM_SEPOLIA } from '../config'
import { VeriTraceLogo } from './ArbitrumLogo'
import { ExternalLink, Compass } from 'lucide-react'
import { ArbitrumLogo } from './ArbitrumLogo'
import { cn } from '@/lib/utils'
import { replayTour } from './OnboardingTour'

// Inline SVG component for Twitter (X) to avoid trademark icon issues
function TwitterIcon({ size = 18, className }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

const PAGES = [
  { to: '/', label: 'Home' },
  { to: '/register', label: 'Register' },
  { to: '/verify', label: 'Verify' },
  { to: '/library', label: 'Library' },
  { to: '/enterprise', label: 'Enterprise' },
  { to: '/profile', label: 'Profile' },
  { to: '/about', label: 'About' },
]

const linkClass = 'text-sm text-[var(--footer-text-muted)] hover:text-[var(--footer-text)] inline-flex items-center gap-1.5'

export default function Footer() {
  const [isHighlighted, setIsHighlighted] = useState(false)

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--footer-bg)] text-[var(--footer-text)] mt-16 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-5 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-10 md:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-[var(--footer-text)]">
              <VeriTraceLogo size={22} />
              <span className="wordmark">VeriTrace</span>
            </div>
            <p className="text-sm text-[var(--footer-text-muted)] leading-relaxed max-w-[300px]">
              Decentralized authenticity verification and multi-modal digital fingerprinting. Built on Arbitrum.
            </p>
            <div className="flex items-center gap-4 mt-5 text-[var(--footer-text-muted)]">
              <a href="https://x.com/veritrace_arb" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--footer-text)]" aria-label="X (formerly Twitter)">
                <TwitterIcon size={18} />
              </a>
            </div>
          </div>

          {/* Pages */}
          <div>
            <div className="kicker mb-4">Pages</div>
            <ul className="flex flex-col gap-2 m-0 p-0 list-none">
              {PAGES.map(p => (
                <li key={p.to}><Link to={p.to} className={linkClass}>{p.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <div className="kicker mb-4">Resources</div>
            <ul className="flex flex-col gap-2 m-0 p-0 list-none">
              <li>
                <a href={`${ARBITRUM_SEPOLIA.explorer}/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  <ExternalLink size={13} /> Contract on Arbiscan
                </a>
              </li>
              <li>
                <a href="https://www.arbitrum.io/" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  <ExternalLink size={13} /> Arbitrum.io
                </a>
              </li>
              <li>
                <button type="button" onClick={replayTour} className={linkClass}>
                  <Compass size={13} /> Take the tour
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Colophon */}
        <div className="mt-10 pt-5 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-xs text-[var(--footer-text-muted)] m-0">
            © {new Date().getFullYear()} VeriTrace. All rights reserved.
          </p>
          <p className="font-mono text-[10.5px] text-[var(--text-4)] break-all m-0 inline-flex items-center gap-1.5">
            <ArbitrumLogo size={10} /> {ARBITRUM_SEPOLIA.name} · Contract: {CONTRACT_ADDRESS}
          </p>
        </div>
      </div>

      {/* Wordmark bleed */}
      <div
        onClick={() => setIsHighlighted(!isHighlighted)}
        className="max-w-[1280px] mx-auto px-5 overflow-hidden h-[7vw] min-h-[44px] cursor-pointer select-none"
        aria-hidden="true"
      >
        <div className={cn('footer-wordmark', isHighlighted ? 'opacity-100 text-[var(--accent)]' : 'opacity-[.09] hover:opacity-20')}>
          VERITRACE
        </div>
      </div>
    </footer>
  )
}
