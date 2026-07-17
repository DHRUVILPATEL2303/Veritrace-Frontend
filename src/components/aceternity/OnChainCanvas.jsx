import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * OnChainCanvas — Custom canvas animation visualizing the VeriTrace pipeline:
 *   • Blocks flowing along a chain (mining / anchoring)
 *   • Transaction packets traveling between nodes (register / verify)
 *   • Hash-verification pulse rings
 *   • Speed streaks conveying throughput
 *   • Floating "REGISTER" / "VERIFY" / "SHA-256" tokens
 *
 * Pure canvas2d, theme-aware, respects prefers-reduced-motion.
 */
export function OnChainCanvas({ className, density = 1 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2)
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

    // ── Chain nodes (blocks) arranged in a gentle horizontal arc ──
    const BLOCK_COUNT = 7
    const blocks = []
    const initBlocks = () => {
      blocks.length = 0
      for (let i = 0; i < BLOCK_COUNT; i++) {
        const t = i / (BLOCK_COUNT - 1)
        const x = w * (0.08 + t * 0.84)
        const arc = Math.sin(t * Math.PI) * h * 0.14
        blocks.push({
          x,
          baseY: h * 0.62 - arc,
          y: h * 0.62 - arc,
          phase: i * 0.7,
          size: 16 + Math.random() * 6,
          hash: randHash(6),
          glow: 0,
          sealed: i === 0,
        })
      }
    }

    // ── Packets traveling along the chain (tx flow) ──
    const packets = []
    const PACKET_COLORS = ['#12AAFF', '#00D395', '#4DC3FF', '#1B4ADD']
    const spawnPacket = (forceDir) => {
      const dir = forceDir || (Math.random() > 0.5 ? 1 : -1)
      const fromIdx = dir > 0 ? 0 : BLOCK_COUNT - 1
      packets.push({
        from: fromIdx,
        to: fromIdx + dir,
        progress: 0,
        speed: 0.006 + Math.random() * 0.01,
        dir,
        color: PACKET_COLORS[Math.floor(Math.random() * PACKET_COLORS.length)],
        size: 3 + Math.random() * 2,
        trail: [],
        label: Math.random() > 0.5 ? 'REGISTER' : 'VERIFY',
      })
    }

    // ── Verification pulse rings ──
    const pulses = []
    const spawnPulse = (x, y, color) => {
      pulses.push({ x, y, r: 4, maxR: 60 + Math.random() * 30, color, alpha: 0.9 })
    }

    // ── Floating semantic tokens ──
    const tokens = []
    const TOKEN_TEXTS = ['SHA-256', 'pHash', 'REGISTER', 'VERIFY', 'ANCHOR', '0x421614', 'IPFS', 'Arbitrum', '✓ sealed']
    const initTokens = () => {
      tokens.length = 0
      const count = Math.round(8 * density)
      for (let i = 0; i < count; i++) {
        tokens.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: -0.15 - Math.random() * 0.25,
          text: TOKEN_TEXTS[Math.floor(Math.random() * TOKEN_TEXTS.length)],
          alpha: 0.12 + Math.random() * 0.22,
          size: 9 + Math.random() * 4,
          life: Math.random() * 1,
        })
      }
    }

    // ── Speed streaks (horizontal throughput lines) ──
    const streaks = []
    const spawnStreak = () => {
      streaks.push({
        x: -50,
        y: Math.random() * h,
        len: 40 + Math.random() * 120,
        speed: 2 + Math.random() * 4,
        alpha: 0.15 + Math.random() * 0.25,
        color: Math.random() > 0.5 ? '#12AAFF' : '#00D395',
      })
    }

    function randHash(n) {
      const c = '0123456789abcdef'
      let s = '0x'
      for (let i = 0; i < n; i++) s += c[Math.floor(Math.random() * 16)]
      return s
    }

    let last = performance.now()
    let packetTimer = 0
    let streakTimer = 0
    let pulseTimer = 0

    const draw = (now) => {
      const dt = Math.min((now - last) / 16.67, 2)
      last = now
      const theme = document.documentElement.getAttribute('data-theme') || 'dark'
      const dark = theme === 'dark'
      ctx.clearRect(0, 0, w, h)

      // ── Background vignette ──
      const bgGrad = ctx.createRadialGradient(w / 2, h * 0.5, 0, w / 2, h * 0.5, Math.max(w, h) * 0.7)
      bgGrad.addColorStop(0, dark ? 'rgba(18,170,255,0.05)' : 'rgba(18,170,255,0.04)')
      bgGrad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, w, h)

      // ── Speed streaks ──
      streakTimer += dt
      if (streakTimer > 8 && streaks.length < 6) { streakTimer = 0; spawnStreak() }
      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i]
        s.x += s.speed * dt
        ctx.strokeStyle = s.color
        ctx.globalAlpha = s.alpha
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x + s.len, s.y)
        ctx.stroke()
        ctx.globalAlpha = 1
        if (s.x > w + s.len) streaks.splice(i, 1)
      }

      // ── Floating tokens ──
      ctx.font = '600 11px "JetBrains Mono", monospace'
      tokens.forEach(t => {
        t.x += t.vx * dt
        t.y += t.vy * dt
        t.life += 0.005 * dt
        if (t.y < -20) { t.y = h + 10; t.x = Math.random() * w }
        if (t.x < -40) t.x = w + 20
        if (t.x > w + 40) t.x = -20
        const flicker = 0.7 + Math.sin(t.life * 3) * 0.3
        ctx.globalAlpha = t.alpha * flicker
        ctx.fillStyle = dark ? '#4DC3FF' : '#1B4ADD'
        ctx.fillText(t.text, t.x, t.y)
      })
      ctx.globalAlpha = 1

      // ── Update block positions (gentle bob) ──
      blocks.forEach((b, i) => {
        b.y = b.baseY + Math.sin(now * 0.0008 + b.phase) * 4
        b.glow *= 0.94
      })

      // ── Draw chain links between blocks ──
      for (let i = 0; i < blocks.length - 1; i++) {
        const a = blocks[i], b = blocks[i + 1]
        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
        grad.addColorStop(0, 'rgba(18,170,255,0.5)')
        grad.addColorStop(1, 'rgba(0,211,149,0.5)')
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
        ctx.setLineDash([])
      }

      // ── Spawn packets ──
      packetTimer += dt
      if (packetTimer > 28 / density && packets.length < 10) {
        packetTimer = 0
        spawnPacket()
      }

      // ── Update + draw packets ──
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i]
        p.progress += p.speed * dt
        if (p.progress >= 1) {
          // arrived at block → seal it, emit pulse, hop onward
          const target = blocks[p.to]
          if (target) {
            target.glow = 1
            target.sealed = true
            spawnPulse(target.x, target.y, p.color)
          }
          // continue to next block or despawn
          const next = p.to + p.dir
          if (next >= 0 && next < BLOCK_COUNT) {
            p.from = p.to
            p.to = next
            p.progress = 0
            p.trail = []
          } else {
            packets.splice(i, 1)
            continue
          }
        }
        const from = blocks[p.from], to = blocks[p.to]
        if (!from || !to) { packets.splice(i, 1); continue }
        const px = from.x + (to.x - from.x) * p.progress
        const py = from.y + (to.y - from.y) * p.progress

        // trail
        p.trail.push({ x: px, y: py })
        if (p.trail.length > 12) p.trail.shift()
        for (let j = 0; j < p.trail.length; j++) {
          const tp = p.trail[j]
          const a = (j / p.trail.length) * 0.5
          ctx.globalAlpha = a
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(tp.x, tp.y, p.size * (j / p.trail.length), 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1

        // packet core
        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 12
        ctx.beginPath()
        ctx.arc(px, py, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0

        // label
        ctx.globalAlpha = 0.85
        ctx.fillStyle = dark ? '#cfe8ff' : '#0a3b66'
        ctx.font = '700 9px "JetBrains Mono", monospace'
        ctx.fillText(p.label, px - 18, py - 10)
        ctx.globalAlpha = 1
      }

      // ── Update + draw pulses ──
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]
        p.r += 1.4 * dt
        p.alpha -= 0.012 * dt
        if (p.alpha <= 0 || p.r > p.maxR) { pulses.splice(i, 1); continue }
        ctx.strokeStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      // ── Draw blocks ──
      blocks.forEach((b, i) => {
        const sealed = b.sealed
        const baseColor = sealed ? '#00D395' : '#12AAFF'
        // glow
        if (b.glow > 0.05) {
          ctx.shadowColor = baseColor
          ctx.shadowBlur = 20 * b.glow
        }
        // hexagon-ish block
        ctx.save()
        ctx.translate(b.x, b.y)
        ctx.rotate(Math.PI / 6)
        ctx.fillStyle = dark ? 'rgba(7,8,11,0.9)' : 'rgba(255,255,255,0.95)'
        ctx.strokeStyle = baseColor
        ctx.lineWidth = 1.5 + b.glow * 2
        ctx.beginPath()
        const s = b.size
        for (let k = 0; k < 6; k++) {
          const ang = (k / 6) * Math.PI * 2
          const x = Math.cos(ang) * s
          const y = Math.sin(ang) * s
          if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        ctx.restore()
        ctx.shadowBlur = 0

        // block index
        ctx.fillStyle = dark ? '#8A92AC' : '#6B7280'
        ctx.font = '700 8px "JetBrains Mono", monospace'
        ctx.fillText(`#${i + 1}`, b.x - 6, b.y + b.size + 14)

        // mini hash under block
        ctx.fillStyle = sealed ? '#00D395' : '#4DC3FF'
        ctx.font = '600 8px "JetBrains Mono", monospace'
        ctx.fillText(b.hash, b.x - 16, b.y + b.size + 24)

        // seal check
        if (sealed) {
          ctx.strokeStyle = '#00D395'
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(b.x - 4, b.y)
          ctx.lineTo(b.x - 1, b.y + 3)
          ctx.lineTo(b.x + 4, b.y - 3)
          ctx.stroke()
        }
      })

      // ── Top "incoming upload" emitter ──
      const emitterX = w * 0.5
      const emitterY = h * 0.12
      const pulse = (Math.sin(now * 0.004) + 1) / 2
      ctx.fillStyle = `rgba(18,170,255,${0.15 + pulse * 0.25})`
      ctx.beginPath()
      ctx.arc(emitterX, emitterY, 6 + pulse * 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = 'rgba(18,170,255,0.4)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(emitterX, emitterY, 14 + pulse * 6, 0, Math.PI * 2)
      ctx.stroke()
      ctx.fillStyle = dark ? '#8A92AC' : '#6B7280'
      ctx.font = '700 9px "JetBrains Mono", monospace'
      ctx.fillText('UPLOAD', emitterX - 18, emitterY - 18)

      // beam from emitter down to first block
      const firstBlock = blocks[0]
      if (firstBlock) {
        const beamGrad = ctx.createLinearGradient(emitterX, emitterY, firstBlock.x, firstBlock.y)
        beamGrad.addColorStop(0, 'rgba(18,170,255,0.0)')
        beamGrad.addColorStop(0.5, `rgba(18,170,255,${0.15 + pulse * 0.15})`)
        beamGrad.addColorStop(1, 'rgba(18,170,255,0.0)')
        ctx.strokeStyle = beamGrad
        ctx.lineWidth = 1
        ctx.setLineDash([2, 6])
        ctx.beginPath()
        ctx.moveTo(emitterX, emitterY)
        ctx.lineTo(firstBlock.x, firstBlock.y)
        ctx.stroke()
        ctx.setLineDash([])
      }

      raf = requestAnimationFrame(draw)
    }

    const setup = () => {
      resize()
      initBlocks()
      initTokens()
      // pre-seal first block
      if (blocks[0]) blocks[0].sealed = true
    }
    setup()

    if (reduced) {
      // single static frame
      draw(performance.now())
    } else {
      raf = requestAnimationFrame(draw)
    }

    const onResize = () => setup()
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [density])

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 pointer-events-none', className)}
      aria-hidden="true"
    />
  )
}
