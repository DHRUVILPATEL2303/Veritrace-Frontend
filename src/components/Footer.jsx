/**
 * Footer.jsx — Site footer with copyright and external links
 * 
 * Links to the live Arbiscan contract page and GitHub.
 */
import { CONTRACT_ADDRESS, ARBITRUM_SEPOLIA } from '../config'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div>
          VeriTrace © {new Date().getFullYear()} — Content Authenticity Registry
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {/* Link to the deployed contract on Arbiscan */}
          <a
            href={`${ARBITRUM_SEPOLIA.explorer}/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Contract on Arbiscan ↗
          </a>
          <a
            href="https://faucet.lamprosdao.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Faucet ↗
          </a>
        </div>
      </div>
    </footer>
  )
}
