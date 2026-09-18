import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Shield, FingerprintPattern as Fingerprint, Lock, Zap, Eye, ArrowRight } from 'lucide-react'

/* The five forensic layers, in the order they run. One neutral card style: only the active card
   picks up the accent hairline, so colour marks selection and nothing else. */
const LAYERS = [
  {
    id: 'sha256',
    tone: 'var(--accent)',
    title: 'SHA-256 Cryptographic Hash',
    tag: 'Exact proof',
    description: 'Deterministic 256-bit fingerprint of raw file bytes. Any single byte modification completely changes the hash, giving byte-for-byte exact proof.',
    codeSnippet: '0xa1b2c3d4e5f67890123456789abcdef0...',
    stats: { speed: '< 5ms', accuracy: '100% Exact', layer: 'Layer 1' },
    icon: Lock,
  },
  {
    id: 'phash',
    tone: 'var(--success-text)',
    title: 'Perceptual Visual pHash',
    tag: 'Structure proof',
    description: '64-bit DCT visual fingerprint. Resists image compression, resizing, color shifts, and format changes using Hamming distance matching.',
    codeSnippet: 'pHash: 0x8f3c1a9e4b7d206f (Dist <= 22)',
    stats: { speed: '< 15ms', accuracy: 'Fuzzy Visual', layer: 'Layer 2' },
    icon: Fingerprint,
  },
  {
    id: 'semantic',
    tone: 'var(--tone-violet)',
    title: 'Semantic Embedding',
    tag: 'AI transformer',
    description: 'High-dimensional vision transformer vectors encoding visual meaning. Catches heavy cropping, style-transfers, and AI regenerations.',
    codeSnippet: 'Cosine Sim: 0.942 [Vision-ViT-B/32]',
    stats: { speed: '~ 40ms', accuracy: '98.4% Semantic', layer: 'Layer 3' },
    icon: Zap,
  },
  {
    id: 'arcface',
    tone: 'var(--danger-text)',
    title: 'ArcFace Biometric',
    tag: 'Deepfake detector',
    description: '512-dimensional face identity vector. Matches facial identities across lighting variations, age progression, face swaps, and deepfakes.',
    codeSnippet: 'ArcFace Distance: 0.312 (Match Confirmed)',
    stats: { speed: '~ 65ms', accuracy: '99.8% Facial', layer: 'Layer 4' },
    icon: Shield,
  },
  {
    id: 'wav2vec2',
    tone: 'var(--warning-text)',
    title: 'wav2vec2 Voice Print',
    tag: 'Audio clone detector',
    description: '768-d biometric audio vector. Extracts vocal frequency patterns to detect AI voice clones, synthesized audio, and speaker identity.',
    codeSnippet: 'wav2vec2 Vector: 768-dim Spectral Map',
    stats: { speed: '~ 50ms', accuracy: '97.6% Vocal', layer: 'Layer 5' },
    icon: Eye,
  },
]

export default function EvidenceLayers() {
  const [activeIndex, setActiveIndex] = useState(0)
  const stackRef = useRef(null)
  const len = LAYERS.length

  const next = useCallback(() => setActiveIndex(i => (i + 1) % len), [len])
  const prev = useCallback(() => setActiveIndex(i => (i - 1 + len) % len), [len])

  // Drag or swipe across the stack to scrub through the layers.
  const scrubAt = useCallback((clientX) => {
    if (!stackRef.current) return
    const rect = stackRef.current.getBoundingClientRect()
    const idx = Math.min(len - 1, Math.max(0, Math.floor(((clientX - rect.left) / rect.width) * len)))
    setActiveIndex(idx)
  }, [len])

  const active = LAYERS[activeIndex]
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640

  return (
    <div className="max-w-[1280px] mx-auto px-5">
      <div className="section-rule"><span className="kicker">Evidence layers</span></div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-12 lg:gap-16 items-center select-none">
        <div>
          <h2 className="section-title text-[var(--text)] mb-4">Five layers of forensic evidence, checked on every file.</h2>
          <p className="text-[15px] text-[var(--text-2)] leading-relaxed mb-8 max-w-xl m-0">
            Click or drag across the cards to move through VeriTrace's forensic engine. Every asset is anchored against byte-level, visual, semantic, and biometric vectors.
          </p>

          <dl className="grid grid-cols-3 border border-[var(--border)] rounded-[8px] bg-[var(--surface)] max-w-lg m-0 mb-8 overflow-hidden">
            {[['Processing', active.stats.speed], ['Accuracy', active.stats.accuracy], ['Security', active.stats.layer]].map(([k, v], i) => (
              <div key={k} className={`px-4 py-3 ${i > 0 ? 'border-l border-[var(--border)]' : ''}`}>
                <dt className="kicker mb-1">{k}</dt>
                <dd className="m-0 font-mono text-sm font-medium text-[var(--text)]">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="flex items-center gap-3">
            <button type="button" onClick={prev} className="layer-nav" aria-label="Previous layer"><ChevronLeft size={18} /></button>
            <div className="flex gap-1.5 px-1">
              {LAYERS.map((l, idx) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Show ${l.title}`}
                  className="h-1.5 rounded-[2px] transition-all duration-300"
                  style={{ width: idx === activeIndex ? 28 : 10, background: idx === activeIndex ? active.tone : 'var(--border-2)' }}
                />
              ))}
            </div>
            <button type="button" onClick={next} className="layer-nav" aria-label="Next layer"><ChevronRight size={18} /></button>
          </div>
        </div>

        {/* 3D card stack */}
        <div
          ref={stackRef}
          onMouseMove={(e) => { if (e.buttons === 1) scrubAt(e.clientX) }}
          onTouchStart={(e) => e.touches[0] && scrubAt(e.touches[0].clientX)}
          onTouchMove={(e) => e.touches[0] && scrubAt(e.touches[0].clientX)}
          className="relative h-[400px] w-full flex items-center justify-center cursor-pointer touch-pan-y"
          style={{ perspective: 1200 }}
        >
          {LAYERS.map((layer, idx) => {
            let diff = idx - activeIndex
            if (diff > len / 2) diff -= len
            if (diff < -len / 2) diff += len
            if (Math.abs(diff) > 2) return null

            const isActive = diff === 0
            const Icon = layer.icon
            const abs = Math.abs(diff)

            return (
              <motion.div
                key={layer.id}
                onClick={() => setActiveIndex(idx)}
                className="layer-card absolute top-0 w-[280px] sm:w-[340px] h-[380px] p-6 flex flex-col justify-between transform-gpu"
                data-active={isActive}
                style={{ zIndex: 20 - abs, '--tone': layer.tone }}
                animate={{
                  transform: `translateX(${diff * (isMobile ? 62 : 118)}px) translateZ(${isActive ? 0 : -abs * (isMobile ? 70 : 120)}px) rotateY(${diff * (isMobile ? -12 : -18)}deg) scale(${isActive ? 1 : 0.86 - abs * 0.06})`,
                  opacity: 1,
                }}
                transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              >
                <div className="layer-body" style={{ opacity: isActive ? 1 : 0.45 }}>
                  <div className="flex items-center justify-between mb-5">
                    <span className="layer-tag"><Icon size={13} /> {layer.tag}</span>
                    <span className="font-mono text-xs text-[var(--text-3)]">{String(idx + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text)] mb-3 leading-snug tracking-tight">{layer.title}</h3>
                  <p className="text-[13px] text-[var(--text-2)] leading-relaxed m-0">{layer.description}</p>
                </div>

                <div className="layer-body" style={{ opacity: isActive ? 1 : 0.45 }}>
                  <div className="code-block px-3.5 py-3 mb-4 text-[11px] break-all text-[var(--text)]">{layer.codeSnippet}</div>
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] text-xs font-medium text-[var(--text-2)]">
                    <span>Inspect algorithm</span>
                    <ArrowRight size={14} style={{ color: 'var(--tone)' }} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
