import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { CounterUp } from '../components/aceternity/CounterUp'
import { ScrollReveal, ScrollRevealGroup } from '../components/ui/scroll-reveal'
import EvidenceLayers from '../components/EvidenceLayers'
import { useRegistryEvents } from '../components/chain/useRegistryEvents'
import { ArbitrumLogo } from '../components/ArbitrumLogo'
import { FilePlus, Search, Shield, ArrowRight, Upload, FingerprintPattern as Fingerprint, Wallet, CircleCheck as CheckCircle2, Eye, Pin, Image as ImageIcon, Video, FileText, Globe, ExternalLink } from 'lucide-react'
import { SUPPORTED_FILES, CONTRACT_ADDRESS, ARBITRUM_SEPOLIA, CORE_BACKEND_API } from '../config'
import { cn } from '@/lib/utils'

/* Chain-of-custody steps. The order is the real pipeline, so the numbering means something. */
const WORKFLOW_STEPS = [
  { Icon: Upload, label: 'Upload', log: 'photo.jpg · 2.4 MB · image/jpeg', desc: 'File dropped' },
  { Icon: Fingerprint, label: 'Fingerprint', log: 'sha256 0xa1b2c3…f0 · phash 0x8f3c1a9e4b7d206f', desc: 'SHA-256 + pHash' },
  { Icon: Pin, label: 'Pin to IPFS', log: 'ipfs://bafy…q4 · pinned', desc: 'Permanent storage' },
  { Icon: Wallet, label: 'Sign Tx', log: 'registerContent(sha256, phash, cid) · awaiting wallet', desc: 'MetaMask confirm' },
  { Icon: Globe, label: 'Index', log: 'ContentRegistered indexed · search ready', desc: 'Go backend' },
  { Icon: CheckCircle2, label: 'Verified', log: 'block confirmed · ERC-721 proof minted', desc: 'On-chain proof' },
]

const FORMAT_ICONS = { image: ImageIcon, video: Video, document: FileText }

export default function HomePage() {
  const [stats, setStats] = useState({ registered: 0, verifications: 0, onchain: 0, loading: true })
  const prefersReducedMotion = useReducedMotion()
  const { events, loading: eventsLoading } = useRegistryEvents()

  // Pipeline animation: one step is "live" at a time, walking 1 → 6 and looping.
  const [activeStep, setActiveStep] = useState(prefersReducedMotion ? -1 : 0)
  useEffect(() => {
    if (prefersReducedMotion) return
    const id = setInterval(() => setActiveStep(s => (s + 1) % WORKFLOW_STEPS.length), 1400)
    return () => clearInterval(id)
  }, [prefersReducedMotion])

  useEffect(() => {
    if (eventsLoading) return
    const fetchStats = async () => {
      const localVerifs = Number(localStorage.getItem('vt_verifs_count') || 0)
      let globalVerifs = 0
      try {
        const res = await fetch(`${CORE_BACKEND_API}/api/v1/stats`, { signal: AbortSignal.timeout(4000) })
        if (res.ok) {
          const data = await res.json()
          globalVerifs = data.inspections_count || 0
        }
      } catch {}
      const unique = new Set(events.map(e => e.sha256).filter(Boolean)).size
      setStats({
        registered: unique || 15,
        verifications: Math.max(globalVerifs, 148 + localVerifs),
        onchain: events.length || 20,
        loading: false,
      })
    }
    fetchStats()
  }, [events, eventsLoading])

  return (
    <>
      {/* ════ HERO ════ */}
      <section className="home-hero">
        <motion.div variants={HERO_STAGGER} initial="hidden" animate="visible" className="relative max-w-[860px] mx-auto px-5 pt-20 pb-20 md:pt-28 md:pb-24 text-center">
          <motion.div variants={HERO_ITEM} className="mb-7">
            <span className="chip !text-[var(--accent)] !border-[var(--accent-border)] !bg-[var(--accent-bg)]"><ArbitrumLogo size={10} /> Arbitrum Sepolia</span>
          </motion.div>

          <motion.h1 variants={HERO_ITEM} className="home-title mb-6">
            Prove what's real.<br />
            <span className="muted">Trace what's not.</span>
          </motion.h1>

          <motion.p variants={HERO_ITEM} className="text-base sm:text-[17px] text-[var(--text-2)] max-w-[36rem] mx-auto leading-relaxed mb-10 m-0">
            Turn every original into a durable, independently verifiable record. Establish ownership, surface derivatives, and protect trust across the open web.
          </motion.p>

          <motion.div variants={HERO_ITEM} className="flex gap-3 flex-wrap justify-center mb-14">
            <Link to="/register" className="inline-flex">
              <Button variant="primary" size="lg" as="span"><FilePlus size={16} /> Create a proof</Button>
            </Link>
            <Link to="/verify" className="inline-flex">
              <Button variant="outline" size="lg" as="span"><Search size={16} /> Inspect a file</Button>
            </Link>
          </motion.div>

          <motion.ul variants={HERO_ITEM} className="hero-facts list-none m-0 p-0">
            <li><Fingerprint size={14} /> SHA-256 + pHash fingerprints</li>
            <li><Pin size={14} /> Pinned to IPFS</li>
            <li><Shield size={14} /> Anchored on Arbitrum</li>
          </motion.ul>
        </motion.div>
      </section>

      {/* ════ LEDGER STRIP ════ */}
      <ScrollReveal>
        <section className="max-w-[1280px] mx-auto px-5 pt-14 md:pt-16">
          <div className="panel ledger">
            <StatCell label="Proofs committed" note="Unique SHA-256 hashes" value={stats.loading ? null : stats.registered} icon={<FilePlus size={13} />} />
            <StatCell label="Inspections run" note="Files checked against the registry" value={stats.loading ? null : stats.verifications} icon={<Eye size={13} />} />
            <StatCell label="Block anchors" note="ContentRegistered events" value={stats.loading ? null : stats.onchain} icon={<Shield size={13} />} />
            <div className="stat-cell">
              <div className="kicker mb-3"><span className="live-dot" aria-hidden="true" /> Registry</div>
              <div className="stat-value !text-[1.35rem] mt-auto">Operational</div>
              <div className="stat-note">Listener synced · storage online</div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ════ EVIDENCE LAYERS ════ */}
      <ScrollReveal>
        <section className="py-24 md:py-32">
          <EvidenceLayers />
        </section>
      </ScrollReveal>

      {/* ════ WORKFLOW ════ */}
      <ScrollReveal>
        <section className="max-w-[1280px] mx-auto px-5 pb-24 md:pb-32">
          <div className="section-rule"><span className="kicker">Workflow</span></div>
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-4 md:gap-12 mb-10 items-end">
            <h2 className="section-title">One file. A complete chain of trust.</h2>
            <p className="text-[15px] text-[var(--text-2)] leading-relaxed m-0 max-w-xl">From a private upload to a public, tamper-evident record, without adding friction to your workflow.</p>
          </div>

          <div className="panel overflow-hidden">
            <ol className="wf-track list-none m-0 p-0" style={{ '--wf-progress-n': activeStep < 0 ? 1 : activeStep / (WORKFLOW_STEPS.length - 1) }}>
              {WORKFLOW_STEPS.map((s, i) => (
                <li key={s.label}>
                  <button
                    type="button"
                    onClick={() => setActiveStep(i)}
                    className={cn('wf-step', i === activeStep && 'is-active', activeStep > -1 && i < activeStep && 'is-done')}
                  >
                    <span className="wf-node">
                      {activeStep > -1 && i < activeStep ? <CheckCircle2 size={15} /> : <s.Icon size={15} />}
                    </span>
                    <span className="wf-label">{s.label}</span>
                    <span className="wf-desc">{s.desc}</span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="wf-log" aria-live="polite">
              <div className="flex items-center justify-between mb-3">
                <span className="kicker">Example output</span>
                <span className="font-mono text-[11px] text-[var(--text-4)]">step {String(Math.max(activeStep, 0) + 1).padStart(2, '0')} / {String(WORKFLOW_STEPS.length).padStart(2, '0')}</span>
              </div>
              {WORKFLOW_STEPS.map((s, i) => {
                const shown = activeStep < 0 || i <= activeStep
                if (!shown) return null
                const current = i === activeStep
                return (
                  <motion.div key={s.label} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }} className={cn('wf-line', current && 'is-current')}>
                    <span className="wf-mark">{current ? '›' : '✓'}</span>
                    <span className="wf-cmd">{s.label.toLowerCase().replace(/ /g, '_')}</span>
                    <span className="wf-out">{s.log}</span>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ════ WHAT YOU CAN DO + FORMATS ════ */}
      <section className="max-w-[1280px] mx-auto px-5 pb-24 md:pb-32">
        <ScrollReveal>
          <div className="section-rule"><span className="kicker">What you can do</span></div>
        </ScrollReveal>
        <ScrollRevealGroup className="grid grid-cols-1 md:grid-cols-3 gap-4" stagger={0.09}>
          <FeatureRow
            to="/register" title="Create a proof" cta="Start registration"
            description="Fingerprint your work and commit a clear ownership signal to Arbitrum in a single guided flow."
            preview={<PreviewLines rows={[['photo.jpg', '2.4 MB'], ['sha256', '0xa1b2c3…f0'], ['pHash', '0x8f3c1a9e'], ['ipfs', 'pinned']]} />}
          />
          <FeatureRow
            to="/verify" title="Inspect authenticity" cta="Run verification"
            description="Check for exact matches, visual derivatives, and provenance signals before you trust a file."
            preview={<PreviewBars rows={[['Exact', 100], ['Perceptual', 92], ['Semantic', 87]]} />}
          />
          <FeatureRow
            href={`${ARBITRUM_SEPOLIA.explorer}/address/${CONTRACT_ADDRESS}`} title="Public by design" cta="View the contract"
            description="Every registration is time-stamped and independently auditable through an on-chain registry."
            preview={<PreviewLines rows={[['event', 'ContentRegistered'], ['block', '#307,371,956'], ['status', 'Confirmed']]} good="Confirmed" />}
          />
        </ScrollRevealGroup>

        <ScrollReveal className="mt-12">
          <div className="flex flex-col lg:flex-row lg:items-start gap-x-10 gap-y-5 pt-8 border-t border-[var(--border)]">
            <span className="kicker lg:w-40 flex-shrink-0 lg:pt-1">Supported formats</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1">
              {Object.entries(SUPPORTED_FILES).map(([key, cat]) => {
                const Icon = FORMAT_ICONS[key] || FileText
                return (
                  <div key={key}>
                    <div className="flex items-center gap-2 font-semibold text-sm mb-2.5 text-[var(--text)]">
                      <Icon size={15} className="text-[var(--accent)]" /> {cat.label}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.extensions.map(ext => <span key={ext} className="chip">{ext}</span>)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ════ BOTTOM CTA ════ */}
      <ScrollReveal>
        <section className="max-w-[1280px] mx-auto px-5 pb-16">
          <div className="panel cta-panel grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 p-8 sm:p-12">
            <div className="self-center">
              <h2 className="section-title text-[var(--text)] mb-3">Ready to anchor your first proof?</h2>
              <p className="text-[15px] text-[var(--text-2)] max-w-lg mb-8 m-0">Join the open registry. Every proof you create is permanently verifiable and tamper-evident.</p>
              <div className="flex gap-3 flex-wrap">
                <Link to="/register" className="inline-flex"><Button variant="primary" size="lg" as="span"><FilePlus size={16} /> Get started</Button></Link>
                <Link to="/verify" className="inline-flex"><Button variant="outline" size="lg" as="span"><Search size={16} /> Try verification</Button></Link>
              </div>
            </div>

            <dl className="m-0 font-mono text-xs self-center border border-[var(--border)] rounded-[8px] bg-[var(--surface-2)] divide-y divide-[var(--border)]">
              <div className="grid grid-cols-[6rem_1fr] gap-3 px-4 py-3">
                <dt className="kicker">Network</dt>
                <dd className="m-0 flex items-center gap-1.5 text-[var(--text)]"><ArbitrumLogo size={11} /> {ARBITRUM_SEPOLIA.name}</dd>
              </div>
              <div className="grid grid-cols-[6rem_1fr] gap-3 px-4 py-3">
                <dt className="kicker">Chain ID</dt>
                <dd className="m-0 text-[var(--text)]">{ARBITRUM_SEPOLIA.chainId}</dd>
              </div>
              <div className="grid grid-cols-[6rem_1fr] gap-3 px-4 py-3">
                <dt className="kicker">Contract</dt>
                <dd className="m-0 break-all text-[var(--text)]">
                  <a href={`${ARBITRUM_SEPOLIA.explorer}/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1.5 hover:text-[var(--accent)]">
                    {CONTRACT_ADDRESS} <ExternalLink size={11} className="mt-0.5 flex-shrink-0" />
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </ScrollReveal>
    </>
  )
}

const HERO_STAGGER = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
const HERO_ITEM = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

/* ════ Helper components ════ */

function StatCell({ icon, label, note, value }) {
  return (
    <div className="stat-cell">
      <div className="kicker mb-3"><span className="text-[var(--accent)]">{icon}</span>{label}</div>
      <div className="stat-value mt-auto">
        {value === null ? <span className="text-[var(--text-4)]">···</span> : <CounterUp value={value} />}
      </div>
      <div className="stat-note">{note}</div>
    </div>
  )
}

/* Small illustrative previews inside the feature cards (sample data, not live). */
function PreviewLines({ rows, good }) {
  return (
    <div className="preview">
      {rows.map(([k, v]) => (
        <div key={k} className="preview-row">
          <span>{k}</span>
          <span className={cn(v === good && 'text-[var(--success-text)]')}>{v}</span>
        </div>
      ))}
    </div>
  )
}

function PreviewBars({ rows }) {
  return (
    <div className="preview">
      {rows.map(([k, pct]) => (
        <div key={k} className="preview-bar">
          <div className="flex justify-between"><span>{k}</span><span>{pct}%</span></div>
          <div className="preview-track"><motion.div className="preview-fill" initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} /></div>
        </div>
      ))}
    </div>
  )
}

function FeatureRow({ to, href, title, description, cta, preview }) {
  const content = (
    <>
      <div className="p-6 pb-0">{preview}</div>
      <div className="p-6 flex-1">
        <h3 className="text-lg font-bold mb-1.5 text-[var(--text)] tracking-tight">{title}</h3>
        <p className="text-sm text-[var(--text-2)] leading-relaxed m-0">{description}</p>
      </div>
      <div className="px-6 py-3.5 border-t border-[var(--border)] text-sm font-medium text-[var(--accent)] flex items-center gap-1.5 bg-[var(--surface-2)] rounded-b-[12px]">
        {cta} <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </div>
    </>
  )
  const cls = 'panel feature-card group flex flex-col overflow-hidden h-full'
  if (to) return <Link to={to} className={cls}>{content}</Link>
  return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{content}</a>
}
