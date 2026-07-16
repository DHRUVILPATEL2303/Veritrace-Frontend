'use client'

import { useEffect, useRef } from 'react'

/**
 * BlockchainBackground — Animated background with floating blockchain nodes and connections
 * Features:
 * - Animated node particles moving across canvas
 * - Glowing connection lines between nodes
 * - Smooth color transitions (Arbitrum blues, greens, purples)
 * - Fully responsive and optimized for performance
 */
export function BlockchainBackground() {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animationIdRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize particles
    const particleCount = Math.floor((canvas.width * canvas.height) / 35000)
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 1.5 + 0.5,
      color: Math.random() > 0.5 ? '#12AAFF' : '#00D395',
      opacity: Math.random() * 0.5 + 0.3,
    }))

    const colors = ['#12AAFF', '#1B4ADD', '#00D395', '#4DC3FF']

    const drawConnection = (from, to, opacity) => {
      const dist = Math.hypot(to.x - from.x, to.y - from.y)
      if (dist > 150) return

      const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y)
      gradient.addColorStop(0, `rgba(18, 170, 255, ${opacity * 0.4})`)
      gradient.addColorStop(1, `rgba(0, 211, 149, ${opacity * 0.2})`)

      ctx.strokeStyle = gradient
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
      ctx.stroke()
    }

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(5, 5, 7, 0.02)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const particles = particlesRef.current

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Update position
        p.x += p.vx
        p.y += p.vy

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
        gradient.addColorStop(0, `rgba(${p.color === '#12AAFF' ? '18, 170, 255' : '0, 211, 149'}, ${p.opacity})`)
        gradient.addColorStop(1, `rgba(${p.color === '#12AAFF' ? '18, 170, 255' : '0, 211, 149'}, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }

      // Draw connections
      for (let i = 0; i < Math.min(particles.length, 20); i++) {
        for (let j = i + 1; j < Math.min(particles.length, 20); j++) {
          drawConnection(particles[i], particles[j], 0.5)
        }
      }

      animationIdRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        background: 'transparent',
      }}
    />
  )
}
