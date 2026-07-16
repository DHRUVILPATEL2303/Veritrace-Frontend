'use client'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CONTRACT_ADDRESS, ARBITRUM_SEPOLIA } from '../config'
import { VeriTraceLogo, ArbitrumLogo } from './ArbitrumLogo'
import { ExternalLink, Code2, Share2, Mail } from 'lucide-react'

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const linkVariants = {
  initial: { color: 'var(--text-2)', x: 0 },
  hover: { color: '#12AAFF', x: 4, transition: { duration: 0.2 } },
}

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-2)] mt-16 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#12AAFF] via-transparent to-[#00D395] blur-3xl" />
      </div>

      <motion.div
        className="max-w-[1280px] mx-auto px-5 py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={footerVariants}
      >
        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Branding section */}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2.5 mb-4">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <VeriTraceLogo size={32} />
              </motion.div>
              <span className="text-xl font-extrabold">
                <span className="gradient-arb">Veri</span><span className="text-[var(--text)]">Trace</span>
              </span>
            </div>
            <p className="text-sm text-[var(--text-3)] leading-relaxed max-w-sm mb-4">
              Decentralized content authenticity registry on Arbitrum. Register, verify, and search digital content with multi-modal fingerprinting.
            </p>
            <motion.div
              className="flex items-center gap-2 text-xs text-[var(--text-3)]"
              whileHover={{ color: '#12AAFF' }}
            >
              <ArbitrumLogo size={14} />
              <span>Powered by Arbitrum Sepolia</span>
            </motion.div>
          </motion.div>

          {/* Platform Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-3)] mb-4">Platform</div>
            <div className="flex flex-col gap-3">
              {[
                { to: '/register', label: 'Register' },
                { to: '/verify', label: 'Verify' },
                { to: '/library', label: 'Library' },
                { to: '/about', label: 'About' },
              ].map((link) => (
                <motion.div key={link.to} variants={linkVariants} initial="initial" whileHover="hover">
                  <Link to={link.to} className="text-sm text-[var(--text-2)] transition-colors inline-flex items-center gap-1">
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-3)] mb-4">Resources</div>
            <div className="flex flex-col gap-3">
              {[
                { href: `${ARBITRUM_SEPOLIA.explorer}/address/${CONTRACT_ADDRESS}`, label: 'Contract on Arbiscan' },
                { href: 'https://faucet.lamprosdao.com/', label: 'Sepolia Faucet' },
                { href: 'https://www.arbitrum.io/', label: 'Arbitrum.io' },
              ].map((link) => (
                <motion.div key={link.href} variants={linkVariants} initial="initial" whileHover="hover">
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--text-2)] transition-colors inline-flex items-center gap-1.5"
                  >
                    <ExternalLink size={12} />
                    {link.label}
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{ transformOrigin: 'center' }}
        />

        {/* Bottom section */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <motion.div
            className="text-xs text-[var(--text-3)]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            VeriTrace © {new Date().getFullYear()} — Content Authenticity Registry
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {[
              { icon: Code2, href: '#', label: 'GitHub' },
              { icon: Share2, href: '#', label: 'Twitter' },
              { icon: Mail, href: 'mailto:info@veritrace.io', label: 'Email' },
            ].map((social) => {
              const Icon = social.icon
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--text-3)] bg-[var(--bg-3)]"
                  whileHover={{
                    borderColor: '#12AAFF',
                    backgroundColor: 'rgba(18, 170, 255, 0.1)',
                    color: '#12AAFF',
                    scale: 1.1,
                  }}
                  transition={{ duration: 0.2 }}
                  title={social.label}
                >
                  <Icon size={16} />
                </motion.a>
              )
            })}
          </motion.div>

          {/* Contract address */}
          <motion.div
            className="text-[10px] font-mono text-[var(--text-4)]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <span className="text-[var(--text-3)]">Contract:</span> {CONTRACT_ADDRESS.slice(0, 8)}...{CONTRACT_ADDRESS.slice(-6)}
          </motion.div>
        </div>
      </motion.div>
    </footer>
  )
}
