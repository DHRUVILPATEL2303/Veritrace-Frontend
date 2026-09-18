import { CONTRACT_ADDRESS, ARBITRUM_SEPOLIA } from '../config'
import { useIntegrityTone } from './providers/ExperienceProvider'
import { useChainStatus } from './chain/useChainStatus'
import { shortHex } from './chain/Address'
import { ArbitrumLogo } from './ArbitrumLogo'

/** Network status bar: chain, head block, gas, contract, integrity state. */
export default function Topbar() {
  const { integrityTone } = useIntegrityTone()
  const { block, gasGwei, ok } = useChainStatus()
  const isAlert = integrityTone === 'alert'

  // The network bar is gone; only the integrity alert (set by the Verify page) still needs the strip.
  if (!isAlert) return null

  return (
    <div className="status-strip" data-tone={integrityTone}>
      <div className="max-w-[1280px] mx-auto px-5 h-7 flex items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-3 min-w-0">
          <span className="status-item">
            <span className="live-dot" aria-hidden="true" />
            {isAlert ? 'Integrity alert — review flagged matches' : <><ArbitrumLogo size={10} /> {ARBITRUM_SEPOLIA.name}</>}
          </span>
          {!isAlert && (
            <>
              <span className="status-sep hidden sm:block" />
              <span className="status-item hidden sm:inline-flex">Block <b className="tnum">{block ? `#${block.toLocaleString()}` : ok ? '…' : 'offline'}</b></span>
              <span className="status-sep hidden md:block" />
              <span className="status-item hidden md:inline-flex">Gas <b className="tnum">{gasGwei != null ? `${gasGwei < 1 ? gasGwei.toFixed(3) : gasGwei.toFixed(2)} gwei` : '…'}</b></span>
            </>
          )}
        </div>
        <a
          href={`${ARBITRUM_SEPOLIA.explorer}/address/${CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="status-item hover:text-[var(--text)]"
          title={CONTRACT_ADDRESS}
        >
          <span className="opacity-70">Registry</span> <b>{shortHex(CONTRACT_ADDRESS)}</b>
        </a>
      </div>
    </div>
  )
}
