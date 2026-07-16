import { CONTRACT_ADDRESS, ARBITRUM_SEPOLIA } from '../config'
import { LogoIcon } from './Navbar'
import { ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-base-50)] mt-12">
      <div className="max-w-[1280px] mx-auto px-5 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <LogoIcon size={24} />
              <span className="font-bold gradient-text-accent">VeriTrace</span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed max-w-xs">
              Decentralized content authenticity registry and similarity search engine. Anchor ownership on Arbitrum Sepolia.
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Resources</div>
            <div className="flex flex-col gap-2">
              <a href={`${ARBITRUM_SEPOLIA.explorer}/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--color-text-secondary)] hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <ExternalLink size={12} /> Contract on Arbiscan
              </a>
              <a href="https://faucet.lamprosdao.com/" target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--color-text-secondary)] hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <ExternalLink size={12} /> Sepolia Faucet
              </a>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Network</div>
            <div className="flex flex-col gap-2 text-xs text-[var(--color-text-secondary)]">
              <span>Chain: Arbitrum Sepolia (421614)</span>
              <span className="font-mono text-[var(--color-text-muted)] break-all">{CONTRACT_ADDRESS}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-[var(--color-text-muted)]">
            VeriTrace © {new Date().getFullYear()} — Content Authenticity Registry
          </div>
        </div>
      </div>
    </footer>
  )
}
