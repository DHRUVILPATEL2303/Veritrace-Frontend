import { motion } from 'framer-motion'

export default function Topbar() {
  const messages = [
    { text: 'Need free testnet ETH? Get 0.01 Arbitrum Sepolia ETH from the Lampros DAO Faucet', link: 'https://faucet.lamprosdao.com/' },
    { text: 'VeriTrace — Decentralized Content Authenticity Registry on Arbitrum Sepolia', link: null },
    { text: 'Register your digital assets with cryptographic fingerprints anchored on-chain', link: null },
  ]

  return (
    <>
      <section className="bg-[var(--color-base-50)] border-b border-[var(--color-border-subtle)]">
        <div className="max-w-[1280px] mx-auto px-5 flex items-center justify-between h-8">
          <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-muted)] font-medium">
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(0,230,118,0.6)]"
            />
            Arbitrum Sepolia Testnet
          </div>
          <div className="text-[11px] text-[var(--color-text-muted)] font-medium hidden sm:block">
            VeriTrace Content Registry
          </div>
        </div>
      </section>

      <div className="bg-gradient-to-r from-blue-600/20 via-[var(--color-base-50)] to-emerald-400/10 border-b border-[var(--color-border-subtle)] overflow-hidden h-8 flex items-center">
        <div className="flex w-max marquee gap-8">
          {[...messages, ...messages, ...messages, ...messages].map((msg, i) => (
            <span key={i} className="text-[11px] font-semibold text-[var(--color-text-secondary)] whitespace-nowrap flex items-center gap-8">
              {msg.link ? (
                <a href={msg.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                  {msg.text}
                </a>
              ) : (
                <span>{msg.text}</span>
              )}
              <span className="text-[var(--color-text-faint)]">⚡</span>
            </span>
          ))}
        </div>
      </div>
    </>
  )
}
