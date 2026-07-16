import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { FilePlus, Search, Library, Info, Menu, X, ChevronDown, Wallet } from 'lucide-react'
import { ARBITRUM_SEPOLIA } from '../config'
import ThemeToggle from './ThemeToggle'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

export function LogoIcon({ size = 30, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#00e676" />
        </linearGradient>
      </defs>
      <path
        d="M16 2.5 L26.5 6 C26.5 16.5, 20.5 24.5, 16 29.5 C11.5 24.5, 5.5 16.5, 5.5 6 Z"
        fill="url(#logo-grad)"
        style={{ filter: 'drop-shadow(0px 2px 8px rgba(59, 130, 246, 0.3))' }}
      />
      <path d="M11 16 L14.5 19.5 L21.5 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="7" y1="16" x2="25" y2="16" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.2" strokeDasharray="2,2" />
    </svg>
  )
}

const navItems = [
  { path: '/', label: 'Home', icon: null },
  { path: '/register', label: 'Register', icon: FilePlus },
  { path: '/verify', label: 'Verify', icon: Search },
  { path: '/library', label: 'Library', icon: Library },
  { path: '/about', label: 'About', icon: Info },
]

export default function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  const isActive = (path) => location.pathname === path

  return (
    <nav className={cn('sticky top-0 z-50 transition-all duration-300', scrolled ? 'glass-strong shadow-lg' : 'bg-transparent')}>
      <div className="max-w-[1280px] mx-auto px-5 flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2.5">
          <LogoIcon size={30} />
          <span className="text-lg font-extrabold tracking-tight gradient-text-accent">VeriTrace</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  isActive(item.path)
                    ? 'text-blue-400 bg-blue-500/10'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]'
                )}
              >
                {Icon && <Icon size={15} />}
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <WalletButton />
          <button
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden glass-strong border-t border-[var(--color-border)]"
          >
            <div className="px-5 py-3 flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                      isActive(item.path)
                        ? 'text-blue-400 bg-blue-500/10'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
                    )}
                  >
                    {Icon && <Icon size={16} />}
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

function WalletButton() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    if (isConnected && (!chain || chain.id !== ARBITRUM_SEPOLIA.chainId)) {
      switchChain({ chainId: ARBITRUM_SEPOLIA.chainId })
    }
  }, [isConnected, chain, switchChain])

  const formatAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  if (isConnected && address) {
    return (
      <Button
        variant="glass"
        size="sm"
        onClick={() => disconnect()}
        className="font-mono"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(0,230,118,0.6)]" />
        {formatAddress(address)}
      </Button>
    )
  }

  return (
    <div className="relative">
      <Button
        variant="primary"
        size="sm"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Wallet size={14} />
        Connect Wallet
        <ChevronDown size={14} className={cn('transition-transform', showDropdown && 'rotate-180')} />
      </Button>

      <AnimatePresence>
        {showDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-2 w-56 glass-strong rounded-xl border border-[var(--color-border)] shadow-xl p-2 z-50"
            >
              {connectors.length > 0 ? (
                connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    onClick={() => { connect({ connector }); setShowDropdown(false) }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg text-left text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
                  >
                    {connector.icon && <img src={connector.icon} alt={connector.name} className="w-5 h-5" />}
                    {connector.name}
                  </button>
                ))
              ) : (
                <div className="px-3 py-3 text-sm text-[var(--color-text-muted)] text-center">No wallets found</div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
