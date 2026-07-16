'use client'

import { motion } from 'framer-motion'

/**
 * ArbitrumLoader — Animated loading spinner with Arbitrum branding
 * Props:
 *   - size: 'sm' | 'md' | 'lg'
 *   - text: string (optional loading text)
 *   - fullHeight: boolean (center on full screen)
 */
export function ArbitrumLoader({ size = 'md', text, fullHeight = false }) {
  const sizes = {
    sm: { container: 'w-12 h-12', outer: 'w-12 h-12', inner: 'w-10 h-10', icon: 'w-5 h-5' },
    md: { container: 'w-16 h-16', outer: 'w-16 h-16', inner: 'w-14 h-14', icon: 'w-6 h-6' },
    lg: { container: 'w-20 h-20', outer: 'w-20 h-20', inner: 'w-16 h-16', icon: 'w-8 h-8' },
  }
  const config = sizes[size] || sizes.md

  const containerClass = fullHeight ? 'flex items-center justify-center min-h-screen' : 'flex items-center justify-center'

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className={config.container}>
          {/* Outer rotating ring */}
          <motion.div
            className={`${config.outer} absolute rounded-full border-2 border-transparent`}
            style={{
              borderTopColor: '#12AAFF',
              borderRightColor: '#12AAFF',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />

          {/* Inner rotating ring (opposite direction) */}
          <motion.div
            className={`${config.inner} absolute rounded-full border-2 border-transparent`}
            style={{
              borderBottomColor: '#00D395',
              borderLeftColor: '#00D395',
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />

          {/* Center icon */}
          <motion.div
            className="absolute flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg className={config.icon} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0)">
                <path
                  d="M16 2C8.26875 2 2 8.26875 2 16C2 23.7312 8.26875 30 16 30C23.7312 30 30 23.7312 30 16C30 8.26875 23.7312 2 16 2ZM16 27.875C9.3875 27.875 4.125 22.6125 4.125 16C4.125 9.3875 9.3875 4.125 16 4.125C22.6125 4.125 27.875 9.3875 27.875 16C27.875 22.6125 22.6125 27.875 16 27.875Z"
                  fill="currentColor"
                  className="text-[#12AAFF]"
                />
                <path
                  d="M16 8C11.5875 8 8 11.5875 8 16C8 20.4125 11.5875 24 16 24C20.4125 24 24 20.4125 24 16C24 11.5875 20.4125 8 16 8ZM16 21.875C12.6062 21.875 10.125 19.3938 10.125 16C10.125 12.6062 12.6062 10.125 16 10.125C19.3938 10.125 21.875 12.6062 21.875 16C21.875 19.3938 19.3938 21.875 16 21.875Z"
                  fill="currentColor"
                  className="text-[#00D395]"
                />
              </g>
            </svg>
          </motion.div>
        </div>

        {/* Loading text */}
        {text && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <p className="text-sm font-semibold text-[var(--text)]">{text}</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
