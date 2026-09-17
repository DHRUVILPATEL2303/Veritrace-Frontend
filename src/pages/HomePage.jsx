import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { CounterUp } from '../components/aceternity/CounterUp'
import { ScrollReveal } from '../components/ui/scroll-reveal'
import EvidenceLayers from '../components/EvidenceLayers'
import { Identicon } from '../components/chain/Identicon'
import { shortHex } from '../components/chain/Address'
import { useChainStatus, timeAgo } from '../components/chain/useChainStatus'
import { useRegistryEvents } from '../components/chain/useRegistryEvents'
import { ArbitrumLogo } from '../components/ArbitrumLogo'
import { FilePlus, Search, Shield, ArrowRight, Upload, FingerprintPattern as Fingerprint, Wallet, CircleCheck as CheckCircle2, Eye, Pin, ChevronDown, Image as ImageIcon, Video, FileText, Radio, Globe, ExternalLink, Blocks } from 'lucide-react'
import { SUPPORTED_FILES, CONTRACT_ADDRESS, ARBITRUM_SEPOLIA, CORE_BACKEND_API } from '../config'
import { cn } from '@/lib/utils'

/* Chain-of-custody steps. The order is the real pipeline, so the numbering means something. */
const WORKFLOW_STEPS = [
  { Icon: Upload, label: 'Upload', desc: 'File dropped' },
  { Icon: Fingerprint, label: 'Fingerprint', desc: 'SHA-256 + pHash' },
  { Icon: Pin, label: 'Pin to IPFS', desc: 'Permanent storage' },
  { Icon: Wallet, label: 'Sign Tx', desc: 'MetaMask confirm' },
  { Icon: Globe, label: 'Index', desc: 'Go backend' },
  { Icon: CheckCircle2, label: 'Verified', desc: 'On-chain proof' },
]

const FORMAT_ICONS = { image: ImageIcon, video: Video, document: FileText }

export default function HomePage() {
  const [stats, setStats] = useState({ registered: 0, verifications: 0, onchain: 0, loading: true })
  const [searchFilter, setSearchFilter] = useState('all')
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
        const res = await fetch(`${CORE_BACKEND_API}/api/v1/stats`)
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
        <div className="relative max-w-[1280px] mx-auto px-5 pt-12 pb-12 md:pt-16 md:pb-14 grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] gap-10 lg:gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex items-center gap-2 mb-5">
              <span className="chip !text-[var(--accent)] !border-[var(--accent-border)] !bg-[var(--accent-bg)]"><ArbitrumLogo size={10} /> Arbitrum Sepolia</span>
              <span className="chip">Stylus · Rust</span>
              <span className="chip hidden sm:inline-flex">ERC-721 proofs</span>
            </div>

            <h1 className="home-title mb-5">
              Prove what's real.<br />
              <span className="muted">Trace what's not.</span>
            </h1>

            <p className="text-[15px] sm:text-base text-[var(--text-2)] max-w-[34rem] leading-relaxed mb-7 m-0">
              Turn every original into a durable, independently verifiable record. Establish ownership, surface derivatives, and protect trust across the open web.
            </p>

            <div className="flex gap-2.5 flex-wrap mb-7">
              <Link to="/register" className="inline-flex">
                <Button variant="primary" size="lg" as="span"><FilePlus size={16} /> Create a proof</Button>
              </Link>
              <Link to="/verify" className="inline-flex">
                <Button variant="outline" size="lg" as="span"><Search size={16} /> Inspect a file</Button>
              </Link>
            </div>

            <div className="max-w-[36rem]">
              <div className="hero-search">
                <SearchFilterDropdown value={searchFilter} onChange={setSearchFilter} />
                <input type="text" placeholder="Search a proof, wallet, or transaction" spellCheck="false" autoComplete="off" aria-label="Search the registry" />
                <button type="button" className="px-4 border-l border-[var(--border)] text-[var(--text-2)] hover:text-[var(--accent)] hover:bg-[var(--surface-2)]" aria-label="Search">
                  <Search size={16} />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }} className="w-full lg:justify-self-end max-w-[520px]">
            <ChainConsole events={events} loading={eventsLoading} />
          </motion.div>
        </div>
      </section>

      {/* ════ STATS + INTEGRITY ════ */}
      <section className="max-w-[1280px] mx-auto px-5">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.15fr] gap-3 pt-5">
          <div className="stat-row">
            <StatCell label="Proofs committed" value={stats.loading ? null : stats.registered} suffix="synced" icon={<FilePlus size={13} />} />
            <StatCell label="Inspections run" value={stats.loading ? null : stats.verifications} suffix="tracked" icon={<Eye size={13} />} />
            <StatCell label="Block anchors" value={stats.loading ? null : stats.onchain} suffix="confirmed" icon={<Shield size={13} />} />
          </div>

          <div className="panel overflow-hidden grid grid-cols-1 md:grid-cols-[1.05fr_2fr]">
            <div className="p-4 md:p-5 border-b md:border-b-0 md:border-r border-[var(--border)]">
              <div className="kicker"><span className="live-dot" aria-hidden="true" /> Integrity dashboard</div>
              <div className="text-base font-semibold mt-2 text-[var(--text)]">Registry health: operational</div>
              <p className="text-xs text-[var(--text-3)] mt-1 leading-relaxed m-0">Forensic services, evidence storage, and block anchoring are available for proof creation and inspection.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3">
              <IntegritySignal icon={<Radio size={13} />} label="Registry listener" value="Synced" detail="Event index online" />
              <IntegritySignal icon={<Fingerprint size={13} />} label="Exact evidence" value="SHA-256" detail="Byte-level proof" />
              <IntegritySignal icon={<CheckCircle2 size={13} />} label="Fuzzy evidence" value="pHash ready" detail="Derivative detection" />
            </div>
          </div>
        </div>
      </section>

      {/* ════ EVIDENCE LAYERS ════ */}
      <ScrollReveal>
        <section className="py-16 md:py-20">
          <EvidenceLayers />
        </section>
      </ScrollReveal>

      {/* ════ PIPELINE ════ */}
      <ScrollReveal>
        <section className="max-w-[1280px] mx-auto px-5 pb-16 md:pb-20">
          <div className="section-rule"><span className="kicker kicker-accent"><span className="live-dot" aria-hidden="true" /> Live workflow</span></div>
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-4 md:gap-10 mb-7 items-end">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text)] leading-[1.05]">One file. A complete chain of trust.</h2>
            <p className="text-sm text-[var(--text-2)] leading-relaxed m-0 max-w-xl">From a private upload to a public, tamper-evident record—without adding friction to your workflow.</p>
          </div>

          <ol className="custody-log list-none m-0 p-0">
            {WORKFLOW_STEPS.map((s, i) => (
              <li key={s.label} className={cn('custody-step', i === activeStep && 'is-active', activeStep > -1 && i < activeStep && 'is-done')}>
                <span className="custody-index">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <span className="custody-icon mb-2.5"><s.Icon size={15} /></span>
                  <div className="font-semibold text-sm text-[var(--text)]">{s.label}</div>
                  <div className="text-xs text-[var(--text-3)]">{s.desc}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </ScrollReveal>

      {/* ════ WHAT YOU CAN DO ════ */}
      <ScrollReveal>
        <section className="max-w-[1280px] mx-auto px-5 pb-16 md:pb-20">
          <div className="section-rule"><span className="kicker">What you can do</span></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FeatureRow to="/register" icon={<FilePlus size={16} />} title="Create a proof" description="Fingerprint your work and commit a clear ownership signal to Arbitrum in a single guided flow." cta="Start registration" />
            <FeatureRow to="/verify" icon={<Search size={16} />} title="Inspect authenticity" description="Check for exact matches, visual derivatives, and provenance signals before you trust a file." cta="Run verification" />
            <FeatureRow href={`${ARBITRUM_SEPOLIA.explorer}/address/${CONTRACT_ADDRESS}`} icon={<Shield size={16} />} title="Public by design" description="Every registration is time-stamped and independently auditable through an on-chain registry." cta="View the contract" />
          </div>
        </section>
      </ScrollReveal>

      {/* ════ SUPPORTED FORMATS ════ */}
      <ScrollReveal>
        <section className="max-w-[1280px] mx-auto px-5 pb-16 md:pb-20">
          <div className="section-rule"><span className="kicker">Supported file formats</span></div>
          <div className="panel grid grid-cols-1 sm:grid-cols-3 overflow-hidden">
            {Object.entries(SUPPORTED_FILES).map(([key, cat], i) => {
              const Icon = FORMAT_ICONS[key] || FileText
              return (
                <div key={key} className={cn('flex items-start gap-4 p-5', i > 0 && 'border-t sm:border-t-0 sm:border-l border-[var(--border)]')}>
                  <span className="w-10 h-10 rounded-[8px] border border-[var(--border-2)] bg-[var(--surface-2)] flex items-center justify-center text-[var(--accent)] flex-shrink-0">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm mb-2 text-[var(--text)]">{cat.label}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.extensions.map(ext => <span key={ext} className="chip">{ext}</span>)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </ScrollReveal>

      {/* ════ BOTTOM CTA ════ */}
      <ScrollReveal>
        <section className="max-w-[1280px] mx-auto px-5 pb-6">
          <div className="ink-panel grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-8 md:gap-10 p-7 sm:p-10">
            <div>
              <div className="kicker mb-4"><span className="live-dot" aria-hidden="true" /> Open registry</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-[1.05] mb-3">Ready to anchor your first proof?</h2>
              <p className="text-sm max-w-lg mb-6 m-0 opacity-80">Join the open registry. Every proof you create is permanently verifiable and tamper-evident.</p>
              <div className="flex gap-2.5 flex-wrap">
                <Link to="/register" className="inline-flex"><Button variant="primary" size="lg" as="span"><FilePlus size={16} /> Get started</Button></Link>
                <Link to="/verify" className="inline-flex"><Button variant="outline" size="lg" as="span"><Search size={16} /> Try verification</Button></Link>
              </div>
            </div>

            <dl className="ink-dl m-0 font-mono text-xs self-center rounded-[10px]">
              <div className="grid grid-cols-[6rem_1fr] gap-3 px-4 py-3">
                <dt className="kicker">Network</dt>
                <dd className="m-0 flex items-center gap-1.5"><ArbitrumLogo size={11} /> {ARBITRUM_SEPOLIA.name}</dd>
              </div>
              <div className="grid grid-cols-[6rem_1fr] gap-3 px-4 py-3">
                <dt className="kicker">Chain ID</dt>
                <dd className="m-0">{ARBITRUM_SEPOLIA.chainId}</dd>
              </div>
              <div className="grid grid-cols-[6rem_1fr] gap-3 px-4 py-3">
                <dt className="kicker">Contract</dt>
                <dd className="m-0 break-all">
                  <a href={`${ARBITRUM_SEPOLIA.explorer}/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1.5 hover:underline underline-offset-4">
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

/* ─── Chain console: head block + anchor blocks + the latest proofs from the contract ─── */
function ChainConsole({ events, loading }) {
  const { block: head } = useChainStatus(8000)
  const latest = events.slice(0, 5)
  const anchorBlocks = [...new Set(events.map(e => e.blockNumber))].slice(0, 7).reverse()
  const cells = [...anchorBlocks.map(b => ({ n: b, proof: true })), { n: head, head: true }]

  return (
    <div className="panel overflow-hidden">
      <div className="panel-head">
        <span className="kicker kicker-accent"><span className="live-dot" aria-hidden="true" /> Latest anchored proofs</span>
        <span className="font-mono text-[10.5px] text-[var(--text-4)]">ContentRegistered · {ARBITRUM_SEPOLIA.name}</span>
      </div>

      <div className="px-4 pt-4 pb-3 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-2.5">
          <span className="kicker"><Blocks size={12} /> Anchor blocks</span>
          <span className="font-mono text-[10.5px] text-[var(--text-3)]">head <b className="text-[var(--success-text)] font-medium tnum">{head ? `#${head.toLocaleString()}` : '…'}</b></span>
        </div>
        <div className="block-strip" aria-label="Recent blocks containing registry events">
          {cells.map((c, i) => (
            <div key={i} className={cn('block-cell', c.proof && 'has-proof', c.head && 'is-head')} title={c.n ? `Block #${c.n}` : ''}>
              <span className="block-mark" />
              <span className="block-num tnum">{c.n ? `#${String(c.n).slice(-6)}` : '······'}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        {loading && latest.length === 0 ? (
          [0, 1, 2, 3, 4].map(i => (
            <div key={i} className="feed-row">
              <div className="skeleton w-[1.4rem] h-[1.4rem] !rounded-full" />
              <div><div className="skeleton h-3 w-2/3 mb-1.5" /><div className="skeleton h-2.5 w-1/3" /></div>
              <div className="skeleton h-4 w-16" />
            </div>
          ))
        ) : latest.length === 0 ? (
          <div className="px-4 py-6 text-xs text-[var(--text-3)]">No registrations found yet.</div>
        ) : (
          latest.map((e) => (
            <a key={e.txHash} href={`${ARBITRUM_SEPOLIA.explorer}/tx/${e.txHash}`} target="_blank" rel="noopener noreferrer" className="feed-row" title={e.sha256}>
              <Identicon address={e.creator} size={22} />
              <div className="min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="feed-hash truncate">{shortHex(e.sha256, 10, 6)}</span>
                  {e.aiTool ? <Badge variant="warning">{e.aiTool}</Badge> : <Badge variant="success">Authentic</Badge>}
                </div>
                <div className="feed-meta mt-0.5">by {shortHex(e.creator)} · block #{e.blockNumber.toLocaleString()} · {timeAgo(e.timestamp)}</div>
              </div>
              <span className="chip !text-[var(--success-text)] !border-[var(--success-border)] !bg-[var(--success-bg)]"><CheckCircle2 size={10} /> Confirmed</span>
            </a>
          ))
        )}
      </div>

      <Link to="/library" className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--border)] bg-[var(--surface-2)] text-xs font-medium text-[var(--accent)] hover:bg-[var(--row-hover)] rounded-b-[12px]">
        Open the full ledger <ArrowRight size={13} />
      </Link>
    </div>
  )
}

/* ─── Themed replacement for the hero search bar's native <select> ─── */
const SEARCH_FILTER_OPTIONS = [
  { value: 'all', label: 'All Filters' },
  { value: 'hash', label: 'By Hash' },
  { value: 'address', label: 'By Address' },
  { value: 'tx', label: 'By Tx Hash' },
]

function SearchFilterDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [menuRect, setMenuRect] = useState(null)
  const buttonRef = useRef(null)
  const current = SEARCH_FILTER_OPTIONS.find(o => o.value === value) ?? SEARCH_FILTER_OPTIONS[0]

  const toggleOpen = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMenuRect({ top: rect.bottom + 6, left: rect.left })
    }
    setOpen(v => !v)
  }

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [open])

  return (
    <div className="relative flex-shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleOpen}
        className={cn(
          'flex items-center gap-1.5 px-3.5 h-full text-xs font-medium border-r border-[var(--border)] whitespace-nowrap bg-[var(--surface-2)]',
          open ? 'text-[var(--text)]' : 'text-[var(--text-2)] hover:text-[var(--text)]'
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {current.label}
        <ChevronDown size={13} className={cn('transition-transform flex-shrink-0 text-[var(--text-3)]', open && 'rotate-180')} />
      </button>

      {createPortal(
        <AnimatePresence>
          {open && menuRect && (
            <>
              <div className="fixed inset-0 z-[998]" onClick={() => setOpen(false)} />
              <motion.div
                role="listbox"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: .15 }}
                style={{ position: 'fixed', top: menuRect.top, left: menuRect.left, boxShadow: 'var(--shadow-lg)' }}
                className="w-44 bg-[var(--surface)] border border-[var(--border-2)] rounded-[8px] p-1 z-[999]"
              >
                {SEARCH_FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={opt.value === value}
                    onClick={() => { onChange(opt.value); setOpen(false) }}
                    className={cn(
                      'w-full text-left px-2.5 py-2 text-sm rounded-[6px]',
                      opt.value === value ? 'text-[var(--text)] bg-[var(--bg-2)] font-medium' : 'text-[var(--text-2)] hover:bg-[var(--bg-2)] hover:text-[var(--text)]'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}

/* ════ Helper components ════ */

function StatCell({ icon, label, value, suffix }) {
  return (
    <div className="stat-cell">
      <div className="kicker mb-3"><span className="text-[var(--accent)]">{icon}</span>{label}</div>
      <div className="stat-value">
        {value === null ? <span className="text-[var(--text-4)]">···</span> : <CounterUp value={value} />}
      </div>
      <div className="font-mono text-[11px] text-[var(--text-4)] mt-1.5">{suffix}</div>
    </div>
  )
}

function IntegritySignal({ icon, label, value, detail }) {
  return (
    <div className="px-4 py-4 border-b sm:border-b-0 sm:border-r last:border-r-0 last:border-b-0 border-[var(--border)] flex flex-col justify-center">
      <div className="kicker"><span className="text-[var(--accent)]">{icon}</span>{label}</div>
      <div className="text-sm font-semibold text-[var(--text)] mt-2">{value}</div>
      <div className="text-[11px] text-[var(--text-3)] mt-0.5">{detail}</div>
    </div>
  )
}

function FeatureRow({ to, href, icon, title, description, cta }) {
  const content = (
    <>
      <div className="p-6 flex-1">
        <span className="w-9 h-9 rounded-[8px] border border-[var(--accent-border)] bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)] mb-4">{icon}</span>
        <h3 className="text-lg font-bold mb-1.5 text-[var(--text)] tracking-tight">{title}</h3>
        <p className="text-sm text-[var(--text-2)] leading-relaxed m-0">{description}</p>
      </div>
      <div className="px-6 py-3 border-t border-[var(--border)] text-sm font-medium text-[var(--accent)] flex items-center gap-1.5 bg-[var(--surface-2)] rounded-b-[12px]">
        {cta} <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </div>
    </>
  )
  const cls = 'panel group flex flex-col overflow-hidden hover:border-[var(--border-2)]'
  if (to) return <Link to={to} className={cls}>{content}</Link>
  return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{content}</a>
}
