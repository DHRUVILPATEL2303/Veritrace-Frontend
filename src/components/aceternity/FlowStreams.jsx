import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * FlowStreams — Premium canvas animation of flowing gradient streams
 * representing on-chain data movement. Theme-independent (identical in
 * dark and light mode). Continuous, smooth, mesmerizing motion.
 */
export function FlowStreams({ className }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    let w = 0, h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const parent = canvas.parentElement
      w = parent.offsetWidth
      h = parent.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    // Flow streams — each is a sine-wave path with flowing particles
    const STREAM_COUNT = 5
    const streams = []
    const STREAM_COLORS = [
      ['#12AAFF', '#1B4ADD'],
      ['#00D395', '#00F5A8'],
      ['#4DC3FF', '#12AAFF'],
      ['#1B4ADD', '#4DC3FF'],
      ['#00D395', '#12AAFF'],
    ]

    const initStreams = () => {
      streams.length = 0
      for (let i = 0; i < STREAM_COUNT; i++) {
        const baseY = h * (0.15 + (i / STREAM_COUNT) * 0.7)
        streams.push({
          baseY,
          amplitude: 30 + Math.random() * 50,
          frequency: 0.003 + Math.random() * 0.004,
          speed: 0.0003 + Math.random() * 0.0004,
          offset: Math.random() * Math.PI * 2,
          phase: 0,
          colors: STREAM_COLORS[i % STREAM_COLORS.length],
          width: 1.5 + Math.random() * 2,
          particles: [],
          particleCount: 3 + Math.floor(Math.random() * 4),
        })
      }
      // init particles for each stream
      streams.forEach(s => {
        for (let j = 0; j < s.particleCount; j++) {
          s.particles.push({
            t: j / s.particleCount + Math.random() * 0.1,
            speed: 0.00015 + Math.random() * 0.0002,
            size: 2 + Math.random() * 3,
          })
        }
      })
    }

    const getY = (stream, x, time) => {
      return stream.baseY +
        Math.sin(x * stream.frequency + time * stream.speed + stream.offset) * stream.amplitude +
        Math.sin(x * stream.frequency * 2.3 + time * stream.speed * 1.5) * stream.amplitude * 0.3
    }

    const draw = (now) => {
      ctx.clearRect(0, 0, w, h)

      // Soft base wash — same in both themes, very subtle
      const wash = ctx.createLinearGradient(0, 0, w, h)
      wash.addColorStop(0, 'rgba(18,170,255,0.03)')
      wash.addColorStop(0.5, 'rgba(0,211,149,0.02)')
      wash.addColorStop(1, 'rgba(27,74,221,0.03)')
      ctx.fillStyle = wash
      ctx.fillRect(0, 0, w, h)

      streams.forEach((stream, idx) => {
        // Draw the flowing stream path
        const grad = ctx.createLinearGradient(0, 0, w, 0)
        grad.addColorStop(0, 'rgba(18,170,255,0)')
        grad.addColorStop(0.15, stream.colors[0] + '55')
        grad.addColorStop(0.5, stream.colors[1] + '88')
        grad.addColorStop(0.85, stream.colors[0] + '55')
        grad.addColorStop(1, 'rgba(18,170,255,0)')

        ctx.strokeStyle = grad
        ctx.lineWidth = stream.width
        ctx.lineCap = 'round'
        ctx.shadowColor = stream.colors[0]
        ctx.shadowBlur = 8

        ctx.beginPath()
        const step = 4
        for (let x = 0; x <= w; x += step) {
          const y = getY(stream, x, now)
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
        ctx.shadowBlur = 0

        // Draw flowing particles along the stream
        stream.particles.forEach(p => {
          p.t += p.speed * 16.67
          if (p.t > 1) p.t -= 1.2

          const px = p.t * w
          const py = getY(stream, px, now)

          // particle glow
          const pgrad = ctx.createRadialGradient(px, py, 0, px, py, p.size * 4)
          pgrad.addColorStop(0, stream.colors[1] + 'CC')
          pgrad.addColorStop(0.4, stream.colors[0] + '44')
          pgrad.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.fillStyle = pgrad
          ctx.beginPath()
          ctx.arc(px, py, p.size * 4, 0, Math.PI * 2)
          ctx.fill()

          // particle core
          ctx.fillStyle = '#ffffff'
          ctx.shadowColor = stream.colors[1]
          ctx.shadowBlur = 10
          ctx.beginPath()
          ctx.arc(px, py, p.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
        })
      })

      // Floating hash tokens drifting across
      tokens.forEach(t => {
        t.x += t.vx * 0.06
        t.y += t.vy * 0.06
        t.life += 0.003
        if (t.x > w + 60) t.x = -60
        if (t.x < -60) t.x = w + 60
        if (t.y > h + 20) t.y = -20
        if (t.y < -20) t.y = h + 20

        const flicker = 0.6 + Math.sin(t.life * 2) * 0.4
        ctx.globalAlpha = t.alpha * flicker
        ctx.fillStyle = t.color
        ctx.font = `600 ${t.size}px "JetBrains Mono", monospace`
        ctx.fillText(t.text, t.x, t.y)
      })
      ctx.globalAlpha = 1

      raf = requestAnimationFrame(draw)
    }

    // Floating tokens
    const TOKEN_TEXTS = ['0xa1b2c3', 'SHA-256', 'pHash', 'VERIFY', 'REGISTER', '0x421614', 'ANCHOR', 'sealed', 'IPFS', 'Arbitrum']
    const TOKEN_COLORS = ['#12AAFF', '#00D395', '#4DC3FF', '#1B4ADD']
    const tokens = []
    const initTokens = () => {
      tokens.length = 0
      for (let i = 0; i < 10; i++) {
        tokens.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.3,
          text: TOKEN_TEXTS[Math.floor(Math.random() * TOKEN_TEXTS.length)],
          color: TOKEN_COLORS[Math.floor(Math.random() * TOKEN_COLORS.length)],
          alpha: 0.15 + Math.random() * 0.2,
          size: 9 + Math.random() * 4,
          life: Math.random() * 10,
        })
      }
    }

    resize()
    initStreams()
    initTokens()

    if (reduced) {
      draw(performance.now())
    } else {
      raf = requestAnimationFrame(draw)
    }

    const onResize = () => { resize(); initStreams(); initTokens() }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 pointer-events-none', className)}
      aria-hidden="true"
    />
  )
}
