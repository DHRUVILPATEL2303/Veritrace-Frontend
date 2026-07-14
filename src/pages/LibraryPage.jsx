/**
 * LibraryPage.jsx — Decentralized Content Registry Explorer
 * 
 * This page queries the smart contract's historical event logs directly 
 * from the Arbitrum Sepolia blockchain (using ethers.js queryFilter).
 * 
 * It extracts all `ContentRegistered` events emitted by the registry contract,
 * displaying an immutable, real-time list of all registered media assets, 
 * including their cryptographic hashes, visual perceptual hashes (pHash), 
 * owners, block timestamps, and AI model attributions.
 * 
 * Written for VeriTrace. Zero backend database dependencies.
 */
import { useState, useEffect } from 'react'
import HashDisplay from '../components/HashDisplay'
import { getContractEvents } from '@wagmi/core'
import { parseAbi } from 'viem'
import { config } from '../wagmiConfig'
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  ARBITRUM_SEPOLIA,
} from '../config'

export default function LibraryPage() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Layer 2 Modal variables with secure screenshot copy protection
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [modalMediaUrl, setModalMediaUrl] = useState(null)
  const [modalMediaType, setModalMediaType] = useState('image')
  const [modalLoading, setModalLoading] = useState(false)

  const getGatewayUrl = (url) => {
    if (!url) return null
    if (url.startsWith('ipfs://')) {
      const cid = url.replace('ipfs://', '')
      return `https://gateway.pinata.cloud/ipfs/${cid}`
    }
    if (url.includes('/ipfs/')) {
      const parts = url.split('/ipfs/')
      const cid = parts[parts.length - 1]
      return `https://gateway.pinata.cloud/ipfs/${cid}`
    }
    return url
  }

  const handleOpenAsset = async (item) => {
    setSelectedAsset(item)
    setModalMediaUrl(null)
    setModalMediaType('image')
    
    const hashKey = (item.sha256 || '').toLowerCase()
    
    // 1. Try local cache first
    const cachedStr = localStorage.getItem(`vt_media_${hashKey}`)
    if (cachedStr) {
      try {
        const cached = JSON.parse(cachedStr)
        if (cached.media_ipfs_url || cached.media_s3_url) {
          const resolved = getGatewayUrl(cached.media_s3_url || cached.media_ipfs_url)
          setModalMediaUrl(resolved)
          setModalMediaType(cached.media_type || 'image')
          return
        }
      } catch (e) {}
    }

    // 2. Fetch from IPFS Gateway
    if (item.ipfsCid && !item.ipfsCid.startsWith('QmYourMetadataCid')) {
      setModalLoading(true)
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 4000) // 4s timeout
        
        const res = await fetch(`https://gateway.pinata.cloud/ipfs/${item.ipfsCid}`, {
          signal: controller.signal
        })
        clearTimeout(timeoutId)
        
        if (res.ok) {
          const meta = await res.json()
          const resolved = getGatewayUrl(meta.media_s3_url || meta.media_ipfs_url)
          setModalMediaUrl(resolved)
          setModalMediaType(meta.media_type || 'image')
          
          // Cache it for future loads
          try {
            localStorage.setItem(`vt_media_${hashKey}`, JSON.stringify({
              sha256: item.sha256,
              media_ipfs_url: meta.media_ipfs_url,
              media_s3_url: meta.media_s3_url,
              media_type: meta.media_type || 'image',
              ipfsCid: item.ipfsCid
            }))
          } catch (e) {}
        } else {
          // Try fallback public gateway
          const fallbackRes = await fetch(`https://ipfs.io/ipfs/${item.ipfsCid}`)
          if (fallbackRes.ok) {
            const meta = await fallbackRes.json()
            const resolved = getGatewayUrl(meta.media_s3_url || meta.media_ipfs_url)
            setModalMediaUrl(resolved)
            setModalMediaType(meta.media_type || 'image')
          }
        }
      } catch (err) {
        console.warn("Failed to fetch asset media from IPFS gateway:", err.message)
      } finally {
        setModalLoading(false)
      }
    }
  }

  // Fetch all registrations from the blockchain logs on mount
  useEffect(() => {
    const fetchEventLogs = async () => {
      try {
        setLoading(true)
        setError(null)

        // 1. Query all historical "ContentRegistered" events
        const events = await getContractEvents(config, {
          address: CONTRACT_ADDRESS,
          abi: parseAbi(CONTRACT_ABI),
          eventName: 'ContentRegistered',
          fromBlock: 0n,
          toBlock: 'latest',
        })

        // 2. Map events to user-friendly registration entries
        const parsedLogs = events.map(event => {
          const args = event.args || {}
          return {
            sha256: args.sha256hash,
            creator: args.creator,
            phash: args.phash?.toString() || '0',
            timestamp: Number(args.timestamp || 0n),
            ipfsCid: args.ipfsCid || '',
            aiTool: args.aitool || '',
            txHash: event.transactionHash,
            blockNumber: Number(event.blockNumber),
          }
        })

        // Sort descending (newest registrations first)
        setRegistrations(parsedLogs.reverse())
      } catch (err) {
        console.error('Failed to query contract logs:', err)
        setError(`Failed to read on-chain registry: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchEventLogs()
  }, [])

  /** Truncate address for safe display: 0x1234...abcd */
  const formatAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  return (
    <section className="container" style={{ paddingTop: '1.5rem' }}>
      {/* Page Title */}
      <div className="page-title">
        <h1>On-Chain Asset Library</h1>
        <div className="page-title-sub">
          Immutable history of all registered media assets parsed directly from Arbitrum Sepolia logs
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="alert-box danger" style={{ marginBottom: '1.5rem' }}>
          <span>⚠️</span>
          <div>{error}</div>
        </div>
      )}

      {/* ── Main content block ── */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-header-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem' }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="9" y1="3" x2="9" y2="21"/>
            </svg>
            Registered Assets ({registrations.length})
          </h2>
        </div>

        {/* ── Loading State ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div className="spinner" />
            <div style={{ fontWeight: 600, marginTop: '1rem' }}>Reading blockchain event log...</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              Connecting to RPC node and querying Arbitrum Sepolia contract filters
            </div>
          </div>
        ) : registrations.length === 0 ? (
          /* ── Empty State ── */
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="3" x2="9" y2="21"/>
              </svg>
            </div>
            <div className="empty-state-title">No assets registered yet</div>
            <div className="empty-state-text">
              Go to the Register tab to write the first cryptographic fingerprint to the contract!
            </div>
          </div>
        ) : (
          /* ── Data Table ── */
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cryptographic SHA-256</th>
                  <th>Visual pHash (Decimal)</th>
                  <th>Registrant Owner</th>
                  <th>AI Model</th>
                  <th>Date Anchored</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((item, idx) => (
                  <tr key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 40}ms` }}>
                    {/* SHA-256 hex display */}
                    <td>
                      <span className="hash-tag" title={item.sha256}>
                        {item.sha256.slice(0, 10)}...{item.sha256.slice(-8)}
                      </span>
                    </td>
                    
                    {/* Visual pHash */}
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text)' }}>
                        {item.phash !== '0' ? item.phash : <span className="text-muted" style={{ fontStyle: 'italic' }}>None</span>}
                      </span>
                    </td>
                    
                    {/* Registrant Address */}
                    <td>
                      <a
                        href={`${ARBITRUM_SEPOLIA.explorer}/address/${item.creator}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="address-tag"
                      >
                        {formatAddress(item.creator)}
                      </a>
                    </td>
 
                    {/* AI Tool */}
                    <td>
                      {item.aiTool ? (
                        <span className="badge badge-info">{item.aiTool}</span>
                      ) : (
                        <span className="badge badge-success">Authentic</span>
                      )}
                    </td>
 
                    {/* Block Timestamp */}
                    <td>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                        {new Date(item.timestamp * 1000).toLocaleString()}
                      </span>
                    </td>
 
                    {/* Actions Column */}
                    <td>
                      <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <button
                          onClick={() => handleOpenAsset(item)}
                          className="btn btn-sm btn-primary"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.6875rem' }}
                        >
                          View Asset 👁️
                        </button>
                        <a
                          href={`${ARBITRUM_SEPOLIA.explorer}/tx/${item.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.6875rem' }}
                        >
                          View Tx ↗
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Layer 2 Detail Modal (Asset Viewer with Screenshot Protection) ── */}
      {selectedAsset && (
        <div className="modal-overlay" onClick={() => setSelectedAsset(null)} style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem',
          backdropFilter: 'blur(4px)'
        }}>
          <div className="modal-card card animate-scale-in" onClick={(e) => e.stopPropagation()} style={{
            width: '100%',
            maxWidth: '650px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden'
          }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="card-header-title" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span>🛡️</span> Registered Asset Details
              </h2>
              <button 
                className="btn btn-sm btn-outline" 
                onClick={() => setSelectedAsset(null)}
                style={{ padding: '0.25rem 0.5rem' }}
              >
                ✕ Close
              </button>
            </div>
            
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Media Preview Box with Screenshot/Stealing Protection */}
              <div 
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '320px',
                  background: '#0d0d0d',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--color-border)'
                }}
                onContextMenu={(e) => e.preventDefault()} // Disable Right-Click
              >
                {modalLoading ? (
                  <div style={{ textAlign: 'center', color: 'white' }}>
                    <div className="spinner" style={{ borderTopColor: 'white' }} />
                    <div style={{ marginTop: '1rem', fontSize: '0.8125rem' }}>Retrieving protected media from IPFS...</div>
                  </div>
                ) : modalMediaUrl ? (
                  <>
                    {/* The Media Element */}
                    {modalMediaType === 'video' ? (
                      <video 
                        src={modalMediaUrl} 
                        controls
                        controlsList="nodownload" // Disable downloading
                        style={{ maxWidth: '100%', maxHeight: '100%', userSelect: 'none', pointerEvents: 'none' }}
                        className="copy-protected-media"
                      />
                    ) : (
                      <img 
                        src={modalMediaUrl} 
                        alt="Protected Registry Asset"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', userSelect: 'none', pointerEvents: 'none' }}
                        className="copy-protected-media"
                      />
                    )}
                    
                    {/* Copy Protection Layer: Watermarks & Stripes */}
                    <div className="watermark-overlay" style={{
                      position: 'absolute',
                      inset: 0,
                      pointerEvents: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02) 15px, rgba(0, 0, 0, 0.15) 15px, rgba(0, 0, 0, 0.15) 30px)'
                    }}>
                      <div style={{
                        transform: 'rotate(-25deg)',
                        fontSize: '1.125rem',
                        fontWeight: '900',
                        color: 'rgba(255, 255, 255, 0.18)',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        userSelect: 'none',
                        lineHeight: '1.8'
                      }}>
                        VERITRACE REGISTERED<br />
                        COPY PROTECTED<br />
                        <span style={{ fontSize: '0.625rem', fontFamily: 'var(--font-mono)' }}>
                          OWNER: {selectedAsset.creator.slice(0, 16)}...{selectedAsset.creator.slice(-6)}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem', width: '100%' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒</div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'white' }}>Protected Registry Node</div>
                    <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                      {selectedAsset.ipfsCid ? "Media not resolved from IPFS." : "Legacy registration: File was not pinned to storage."}
                    </div>
                    <div>
                      <label 
                        className="btn btn-secondary btn-sm" 
                        style={{ cursor: 'pointer', padding: '0.375rem 0.75rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        Select local file to view securely
                        <input 
                          type="file" 
                          style={{ display: 'none' }} 
                          onChange={(e) => {
                            const file = e.target.files[0]
                            if (file) {
                              const localUrl = URL.createObjectURL(file)
                              setModalMediaUrl(localUrl)
                              setModalMediaType(file.type.startsWith('video/') ? 'video' : 'image')
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Asset Metadatas */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.375rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Cryptographic SHA-256</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{selectedAsset.sha256}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.375rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Visual Perceptual Hash (pHash)</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{selectedAsset.phash !== '0' ? selectedAsset.phash : 'None'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.375rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Anchored Date</span>
                  <span>{new Date(selectedAsset.timestamp * 1000).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.375rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Attributed AI Model</span>
                  <span>
                    {selectedAsset.aiTool ? (
                      <span className="badge badge-info">{selectedAsset.aiTool}</span>
                    ) : (
                      <span className="badge badge-success">Authentic Content</span>
                    )}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Registrant Address</span>
                  <a
                    href={`${ARBITRUM_SEPOLIA.explorer}/address/${selectedAsset.creator}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="address-tag"
                  >
                    {selectedAsset.creator}
                  </a>
                </div>
              </div>
            </div>
            
            <div className="card-footer" style={{ justifyContent: 'space-between', gap: '1rem', background: 'var(--color-bg)' }}>
              <a
                href={`${ARBITRUM_SEPOLIA.explorer}/tx/${selectedAsset.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-primary"
                style={{ flex: 1, textAlign: 'center' }}
              >
                Inspect On Arbiscan Explorer ↗
              </a>
              {selectedAsset.ipfsCid && (
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => {
                    const certData = {
                      title: "VeriTrace Registration Certificate",
                      sha256: selectedAsset.sha256,
                      phash: selectedAsset.phash,
                      owner: selectedAsset.creator,
                      anchoredAt: new Date(selectedAsset.timestamp * 1000).toISOString(),
                      aiModel: selectedAsset.aiTool || "None (Authentic Content)",
                      ipfsMetadataUrl: `https://ipfs.io/ipfs/${selectedAsset.ipfsCid}`
                    }
                    const blob = new Blob([JSON.stringify(certData, null, 2)], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `veritrace-cert-${selectedAsset.sha256.slice(2, 10)}.json`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    URL.revokeObjectURL(url)
                  }}
                  style={{ flex: 1 }}
                >
                  Download Certificate 📜
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
