import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Shield, FingerprintPattern as Fingerprint, Lock, Zap, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

/* The five forensic layers, in the order they run. */
const LAYERS = [
  {
    id: 'sha256',
    title: 'SHA-256 Cryptographic Hash',
    tag: 'EXACT PROOF',
    tone: 'accent',
    description: 'Deterministic 256-bit fingerprint of raw file bytes. Any single byte modification completely changes the hash, giving byte-for-byte exact proof.',
    codeSnippet: '0xa1b2c3d4e5f67890123456789abcdef0...',
    stats: { speed: '< 5ms', accuracy: '100% Exact', layer: 'Layer 1' },
    icon: Lock,
  },
  {
    id: 'phash',
    title: 'Perceptual Visual pHash',
    tag: 'STRUCTURE PROOF',
    tone: 'success',
    description: '64-bit DCT visual fingerprint. Resists image compression, resizing, color shifts, and format changes using Hamming distance matching.',
    codeSnippet: 'pHash: 0x8f3c1a9e4b7d206f (Dist <= 22)',
    stats: { speed: '< 15ms', accuracy: 'Fuzzy Visual', layer: 'Layer 2' },
    icon: Fingerprint,
  },
  {
    id: 'semantic',
    title: 'Semantic Embedding',
    tag: 'AI TRANSFORMER',
    tone: 'accent',
    description: 'High-dimensional vision transformer vectors encoding visual meaning. Catches heavy cropping, style-transfers, and AI regenerations.',
    codeSnippet: 'Cosine Sim: 0.942 [Vision-ViT-B/32]',
    stats: { speed: '~ 40ms', accuracy: '98.4% Semantic', layer: 'Layer 3' },
    icon: Zap,
  },
  {
    id: 'arcface',
    title: 'ArcFace Biometric',
    tag: 'DEEPFAKE DETECTOR',
    tone: 'danger',
    description: '512-dimensional face identity vector. Matches facial identities across lighting variations, age progression, face swaps, and deepfakes.',
    codeSnippet: 'ArcFace Distance: 0.312 (Match Confirmed)',
    stats: { speed: '~ 65ms', accuracy: '99.8% Facial', layer: 'Layer 4' },
    icon: Shield,
  },
  {
    id: 'wav2vec2',
    title: 'wav2vec2 Voice Print',
    tag: 'AUDIO CLONE DETECTOR',
    tone: 'warning',
    description: '768-d biometric audio vector. Extracts vocal frequency patterns to detect AI voice clones, synthesized audio, and speaker identity.',
    codeSnippet: 'wav2vec2 Vector: 768-dim Spectral Map',
    stats: { speed: '~ 50ms', accuracy: '97.6% Vocal', layer: 'Layer 5' },
    icon: Eye,
  },
]

const TONE_VAR = {
  accent: 'var(--accent)',
  success: 'var(--success-text)',
  danger: 'var(--danger-text)',
  warning: 'var(--warning-text)',
}

export default function EvidenceLayers() {
  const [activeIndex, setActiveIndex] = useState(0)
  const len = LAYERS.length

  const next = useCallback(() => setActiveIndex(i => (i + 1) % len), [len])
  const prev = useCallback(() => setActiveIndex(i => (i - 1 + len) % len), [len])

  const active = LAYERS[activeIndex]
  const Icon = active.icon
  const tone = TONE_VAR[active.tone]

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); next() }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); prev() }
  }

  return (
    <div className="max-w-[1280px] mx-auto px-5">
      <div className="section-rule"><span className="kicker">Evidence layers</span></div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] gap-6 lg:gap-10 items-start">
        {/* Left: headline + selectable layer list */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text)] leading-[1.05] mb-3">
            Evidence powered by <span style={{ color: tone }} className="transition-colors duration-300">3D Cryptography</span>.
          </h2>
          <p className="text-sm sm:text-[15px] text-[var(--text-2)] leading-relaxed mb-5 max-w-xl m-0">
            Select a layer to explore VeriTrace's multi-layered forensic engine. Every asset is anchored against byte-level, visual, semantic, and biometric vectors.
          </p>

          <div className="layer-list" role="listbox" aria-label="Forensic layers" tabIndex={0} onKeyDown={onKeyDown}>
            {LAYERS.map((layer, idx) => {
              const LIcon = layer.icon
              const selected = idx === activeIndex
              return (
                <button
                  key={layer.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className="layer-item"
                  onClick={() => setActiveIndex(idx)}
                >
                  <span className="layer-index">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="flex items-center gap-2 min-w-0">
                    <LIcon size={14} style={{ color: selected ? TONE_VAR[layer.tone] : undefined }} className="flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{layer.title}</span>
                  </span>
                  <span className="kicker hidden sm:inline-flex" style={{ color: selected ? TONE_VAR[layer.tone] : undefined }}>{layer.tag}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: detail pane for the selected layer */}
        <div className="layer-detail">
          <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-[var(--border)] bg-[var(--surface-2)] rounded-t-[12px]">
            <span className="kicker" style={{ color: tone }}>
              <Icon size={13} /> {active.tag}
            </span>
            <span className="font-mono text-[11px] text-[var(--text-4)]">{String(activeIndex + 1).padStart(2, '0')} / {String(len).padStart(2, '0')}</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: .18 }}
              className="p-5 sm:p-6"
            >
              <h3 className="text-2xl font-bold text-[var(--text)] tracking-tight leading-tight mb-2">{active.title}</h3>
              <p className="text-sm text-[var(--text-2)] leading-relaxed m-0 mb-5">{active.description}</p>

              <div className="code-block px-3.5 py-3 mb-5 text-[var(--text)]">
                <span className="text-[var(--text-4)] select-none">$ </span>{active.codeSnippet}
              </div>

              <dl className="grid grid-cols-3 border border-[var(--border)] rounded-[6px] overflow-hidden m-0">
                {[['Processing', active.stats.speed], ['Accuracy', active.stats.accuracy], ['Security', active.stats.layer]].map(([k, v], i) => (
                  <div key={k} className={cn('px-4 py-3', i > 0 && 'border-l border-[var(--border)]')}>
                    <dt className="kicker mb-1">{k}</dt>
                    <dd className="m-0 font-mono text-sm font-medium text-[var(--text)]">{v}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--border)]">
            <button type="button" onClick={prev} className="btn btn-outline text-xs px-2.5 py-1.5" aria-label="Previous layer">
              <ChevronLeft size={14} /> Previous
            </button>
            <div className="flex gap-1" aria-hidden="true">
              {LAYERS.map((l, idx) => (
                <span key={l.id} className="h-1 rounded-[1px] transition-all duration-300" style={{ width: idx === activeIndex ? 20 : 8, background: idx === activeIndex ? tone : 'var(--border-2)' }} />
              ))}
            </div>
            <button type="button" onClick={next} className="btn btn-outline text-xs px-2.5 py-1.5" aria-label="Next layer">
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
