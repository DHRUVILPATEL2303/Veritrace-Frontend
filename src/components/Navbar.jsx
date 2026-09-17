import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { Menu, X, ChevronDown, Wallet, Copy, LogOut, Check, User } from 'lucide-react'
import { toast } from 'sonner'
import { ARBITRUM_SEPOLIA } from '../config'
import { VeriTraceLogo, ArbitrumLogo } from './ArbitrumLogo'
import { cn } from '@/lib/utils'
import ThemeToggle from './ThemeToggle'
import { Identicon } from './chain/Identicon'

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/register', label: 'Register' },
  { path: '/verify', label: 'Verify' },
  { path: '/library', label: 'Library' },
  { path: '/enterprise', label: 'Enterprise' },
  { path: '/profile', label: 'Profile' },
  { path: '/about', label: 'About' },
]

export default function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => { setMobileOpen(false) }, [location])

  const isActive = (path) => location.pathname === path

  return (
    <header className="site-nav">
      <div className="max-w-[1280px] mx-auto px-5 h-14 flex items-center justify-between gap-4">
        {/* Wordmark */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 text-[var(--text)]">
          <VeriTraceLogo size={26} />
          <span className="wordmark">VeriTrace</span>
          <span className="hidden lg:inline kicker ml-1">Protocol</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-stretch h-full" aria-label="Primary">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className="nav-link" aria-current={isActive(item.path) ? 'page' : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <ThemeToggle />
          <WalletButton />
          <button
            type="button"
            className="lg:hidden w-9 h-9 rounded-[5px] border border-[var(--border)] flex items-center justify-center text-[var(--text-2)] hover:text-[var(--text)]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: .2 }}
            className="lg:hidden overflow-hidden border-t border-[var(--border)] bg-[var(--surface)]"
            aria-label="Primary"
          >
            <div className="max-w-[1280px] mx-auto px-5 py-2 flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center justify-between px-2 py-3 text-sm font-medium border-b border-[var(--border)] last:border-b-0',
                    isActive(item.path) ? 'text-[var(--text)]' : 'text-[var(--text-2)]'
                  )}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                >
                  {item.label}
                  {isActive(item.path) && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

function Menu_({ open, onClose, children, className }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: .15 }}
            className={cn('absolute top-full right-0 mt-2 bg-[var(--surface)] border border-[var(--border-2)] rounded-[6px] p-1.5 z-50', className)}
            style={{ boxShadow: 'var(--shadow-lg)' }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function WalletButton() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const [showDropdown, setShowDropdown] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (isConnected && (!chain || chain.id !== ARBITRUM_SEPOLIA.chainId)) {
      switchChain({ chainId: ARBITRUM_SEPOLIA.chainId })
    }
  }, [isConnected, chain, switchChain])

  const formatAddress = (addr) => `${addr.slice(0, 6)}…${addr.slice(-4)}`

  const copyAddress = async () => {
    if (!address) return
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      toast.success('Wallet address copied')
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      toast.error('Could not copy wallet address')
    }
  }

  const itemClass = 'w-full flex items-center gap-2 px-2.5 py-2 rounded-[4px] text-left text-sm text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--bg-2)]'

  if (isConnected && address) {
    return (
      <div className="relative flex-shrink-0">
        <button
          type="button"
          onClick={() => setShowDropdown(value => !value)}
          className="btn btn-outline h-[2.1rem] px-2.5 text-xs font-mono font-medium"
          aria-expanded={showDropdown}
          aria-label="Open wallet account menu"
        >
          <Identicon address={address} size={16} />
          <span className="hidden sm:inline">{formatAddress(address)}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--success-text)] flex-shrink-0" title="Connected" />
          <ChevronDown size={12} className={cn('transition-transform text-[var(--text-3)]', showDropdown && 'rotate-180')} />
        </button>

        <Menu_ open={showDropdown} onClose={() => setShowDropdown(false)} className="w-[calc(100vw-2rem)] max-w-[280px] sm:w-72">
          <div className="px-2.5 py-2 border-b border-[var(--border)] mb-1">
            <div className="kicker">Connected wallet</div>
            <div className="flex items-start gap-2 mt-1.5"><Identicon address={address} size={22} /><div className="font-mono text-[11px] text-[var(--text)] break-all">{address}</div></div>
            <div className="mt-1.5 flex items-center gap-1.5 text-[10.5px] font-mono text-[var(--text-3)]"><ArbitrumLogo size={10} /> {ARBITRUM_SEPOLIA.name}</div>
          </div>
          <Link to="/profile" onClick={() => setShowDropdown(false)} className={itemClass}>
            <User size={14} /> View profile
          </Link>
          <button type="button" onClick={copyAddress} className={cn(itemClass, 'justify-between')}>
            <span className="flex items-center gap-2"><Copy size={14} /> Copy address</span>
            {copied ? <Check size={14} className="text-[var(--success-text)]" /> : <span className="font-mono text-[10px] text-[var(--text-4)]">{formatAddress(address)}</span>}
          </button>
          <button type="button" onClick={() => { disconnect(); setShowDropdown(false) }} className={cn(itemClass, 'text-[var(--danger-text)] hover:text-[var(--danger-text)] hover:bg-[var(--danger-bg)]')}>
            <LogOut size={14} /> Disconnect wallet
          </button>
        </Menu_>
      </div>
    )
  }

  return (
    <div className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        className="btn btn-primary h-[2.1rem] px-3 text-sm"
        aria-expanded={showDropdown}
      >
        <Wallet size={14} />
        <span className="hidden sm:inline">Connect</span>
        <ChevronDown size={12} className={cn('transition-transform', showDropdown && 'rotate-180')} />
      </button>

      <Menu_ open={showDropdown} onClose={() => setShowDropdown(false)} className="w-[calc(100vw-3rem)] max-w-[240px] sm:w-60">
        <div className="kicker px-2.5 py-1.5">Choose a wallet</div>
        {connectors.length > 0 ? (
          connectors.map((connector) => (
            <button
              key={connector.uid}
              type="button"
              onClick={() => { connect({ connector }); setShowDropdown(false) }}
              className={cn(itemClass, 'text-[var(--text)]')}
            >
              {connector.icon && <img src={connector.icon} alt="" className="w-4 h-4" />}
              {connector.name}
            </button>
          ))
        ) : (
          <div className="px-3 py-3 text-sm text-[var(--text-3)]">No wallets found</div>
        )}
      </Menu_>
    </div>
  )
}
