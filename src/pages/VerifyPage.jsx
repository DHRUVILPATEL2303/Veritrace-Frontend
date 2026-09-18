import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { readContract, getContractEvents } from '@wagmi/core'
import { parseAbi } from 'viem'
import FileUpload from '../components/FileUpload'
import { HashDisplay } from '../components/ui/hash-display'
import SearchResults from '../components/SearchResults'
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Skeleton } from '../components/ui/skeleton'
import { toast } from 'sonner'
import { Progress } from '../components/ui/progress'
import { SpotlightCard } from '../components/aceternity/SpotlightCard'
import { ArbitrumLogo } from '../components/ArbitrumLogo'
import PageHero from '../components/PageHero'
import { ScrollReveal } from '../components/ui/scroll-reveal'
import { useUpload } from '../context/UploadContext'
import { useIntegrityTone } from '../components/providers/ExperienceProvider'
import { config } from '../wagmiConfig'
import {
  HASH_ENGINE_API, CONTRACT_ADDRESS, CONTRACT_ABI, ARBITRUM_SEPOLIA, CORE_BACKEND_API,
} from '../config'
import { Search, Shield, Database, Info, CircleCheck as CheckCircle2, ExternalLink } from 'lucide-react'
import { Address } from '../components/chain/Address'

export default function VerifyPage() {
  const {
    verFile: file, setVerFile: setFile,
    verLoading: loading, setVerLoading: setLoading,
    verUploadProgress: uploadProgress, setVerUploadProgress: setUploadProgress,
    verError: error, setVerError: setError,
    verLocalSha256: localSha256, setVerLocalSha256: setLocalSha256,
    verPhash: phash, setVerPhash: setPhash,
    verBlockchainRecord: blockchainRecord, setVerBlockchainRecord: setBlockchainRecord,
    verDbResults: dbResults, setVerDbResults: setDbResults,
    verFullHashes: fullHashes, setVerFullHashes: setFullHashes,
  } = useUpload()
  const { setIntegrityTone } = useIntegrityTone()

  useEffect(() => {
    const hasIntegrityAlert = error || dbResults?.some(result => result.isDeepfake || result.matchType === 'deepfake')
    setIntegrityTone(hasIntegrityAlert ? 'alert' : 'secure')
    return () => setIntegrityTone('secure')
  }, [error, dbResults, setIntegrityTone])

  const computeLocalSHA256 = async (f) => {
    const arrayBuffer = await f.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
  }

  const queryBlockchainRegistry = async (sha256Hex) => {
    try {
      const record = await readContract(config, { address: CONTRACT_ADDRESS, abi: parseAbi(CONTRACT_ABI), functionName: 'verifyContent', args: ['0x' + sha256Hex] })
      return { isRegistered: true, creator: record[0], timestamp: Number(record[1]), phash: Number(record[2]), ipfsCid: record[3], aiTool: record[4] }
    } catch { return null }
  }

  const handleFileSelected = async (f) => {
    setFile(f); setError(null); setLocalSha256(null); setPhash(null); setBlockchainRecord(null); setDbResults(null); setUploadProgress(0)
    if (!f) return
    try {
      setLoading(true)
      const sha256Hex = await computeLocalSHA256(f)
      setLocalSha256(sha256Hex)
      const onChainData = await queryBlockchainRegistry(sha256Hex)
      if (onChainData) setBlockchainRecord(onChainData)
      const hashData = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        const formData = new FormData()
        formData.append('file', f)
        formData.append('filename', f.name)
        xhr.upload.addEventListener('progress', (e) => { if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100)) })
        xhr.addEventListener('load', () => { if (xhr.status >= 200 && xhr.status < 300) { try { resolve(JSON.parse(xhr.responseText)) } catch { reject(new Error('Invalid response')) } } else { reject(new Error(`Server error: ${xhr.status}`)) } })
        xhr.addEventListener('error', () => reject(new Error('Network error')))
        xhr.open('POST', `${HASH_ENGINE_API}/api/v1/hash`)
        xhr.send(formData)
      })
      if (hashData.phash) setPhash(hashData.phash.toString())
      setFullHashes(hashData)

      const matches = []


      try {
        const exactRes = await fetch(`${CORE_BACKEND_API}/api/v1/verify/exact?hash=0x${sha256Hex}`)
        if (exactRes.ok) {
          const exactData = await exactRes.json()
          if (exactData && exactData.match_found) {
            const dataMatches = exactData.matches || (exactData.record ? [{ ...exactData.record, similarity: 100, match_type: 'exact' }] : [])
            for (const item of dataMatches) {
              const hashKey = item.sha256_hash || item.Sha256Hash
              if (hashKey) {
                const alreadyMatched = matches.some(m => m.sha256?.toLowerCase() === hashKey.toLowerCase())
                if (onChainData && (item.match_type === 'exact' || item.MatchType === 'exact')) {
                  setBlockchainRecord(prev => ({ ...prev, mediaS3Url: item.media_s3_url || item.MediaS3Url, mediaIpfsUrl: item.media_ipfs_url || item.MediaIpfsUrl }))
                }
                if (!alreadyMatched) {
                  matches.push({
                    matchType: item.match_type || 'exact',
                    similarity: item.similarity || 100,
                    confidenceScore: item.confidence_score || 100,
                    confidenceTier: item.confidence_tier || 'High',
                    assetId: hashKey.slice(0, 16),
                    sha256: hashKey,
                    mediaType: item.media_type || hashData.media_type || 'unknown',
                    registeredAt: new Date((item.timestamp || item.Timestamp) * 1000).toLocaleString(),
                    creator: item.creator_address || item.CreatorAddress,
                    aiTool: item.ai_tool || item.AiTool,
                    ipfsCid: item.ipfs_cid || item.IpfsCid,
                    mediaS3Url: item.media_s3_url || item.MediaS3Url,
                    mediaIpfsUrl: item.media_ipfs_url || item.MediaIpfsUrl,
                    onChainVerified: item.on_chain_verified,
                    onChainTxHash: item.on_chain_tx_hash
                  })
                }
              }
            }
          }
        }
      } catch (dbErr) { console.warn('Backend exact match failed:', dbErr.message) }

      if (onChainData && matches.filter(m => m.matchType === 'exact').length === 0) {
        matches.push({ matchType: 'exact', similarity: 100, assetId: `onchain-${sha256Hex.slice(0, 8)}`, sha256: `0x${sha256Hex}`, mediaType: hashData.media_type || 'unknown', registeredAt: new Date(onChainData.timestamp * 1000).toLocaleString(), creator: onChainData.creator, aiTool: onChainData.aiTool, ipfsCid: onChainData.ipfsCid })
      }

      try {
        let segmentsPayload = []
        if (hashData.keyframes?.length > 0) segmentsPayload = hashData.keyframes.map(k => ({ offset: Number(k.offset), phash: Number(k.phash), semantic_hash: k.semantic_hash || [], face_hash: k.face_hash || [] }))
        else if (hashData.phash) segmentsPayload = [{ offset: 0, phash: Number(hashData.phash), semantic_hash: hashData.semantic_hash || [], face_hash: hashData.face_hash || [] }]
        if (segmentsPayload.length > 0) {
          const segmentRes = await fetch(`${CORE_BACKEND_API}/api/v1/verify/segments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sha256: '0x' + sha256Hex, media_type: hashData.media_type, audio_hashes: hashData.audio_hashes || [], segments: segmentsPayload }) })
          if (segmentRes.ok) {
            const segmentData = await segmentRes.json()
            if (segmentData.match_found) {
              const dataMatches = segmentData.matches || (segmentData.record ? [{ ...segmentData.record, similarity: segmentData.similarity, match_type: segmentData.is_deepfake ? 'deepfake' : 'similar', is_deepfake: segmentData.is_deepfake, is_audio_deepfake: segmentData.is_audio_deepfake, temporal_integrity: segmentData.temporal_integrity }] : [])
              for (const item of dataMatches) {
                const hashKey = item.sha256_hash || item.Sha256Hash
                if (hashKey) {
                  const existingIndex = matches.findIndex(m => m.sha256?.toLowerCase() === hashKey.toLowerCase())
                  const isExact = (item.match_type === 'exact') || (hashKey.toLowerCase() === ('0x' + sha256Hex).toLowerCase())

                  let calculatedSimilarity = isExact ? 100 : (item.similarity || 90)
                  if (!isExact) {
                    const itemPhash = item.phash || item.PHash || item.record?.phash || item.record?.PHash
                    if (hashData.phash && itemPhash) {
                      try {
                        const b1 = BigInt(hashData.phash)
                        const b2 = BigInt(itemPhash)
                        let xor = b1 ^ b2
                        let dist = 0
                        while (xor > 0n) {
                          if (xor & 1n) dist++
                          xor >>= 1n
                        }
                        calculatedSimilarity = Number((((64 - dist) / 64) * 100).toFixed(1))
                      } catch {}
                    }
                    if (calculatedSimilarity >= 100) {
                      calculatedSimilarity = 92.5
                    }
                  }

                  const newMatch = {
                    matchType: isExact ? 'exact' : (item.match_type || (item.is_deepfake ? 'deepfake' : 'similar')),
                    isDeepfake: item.is_deepfake,
                    isAudioDeepfake: item.is_audio_deepfake,
                    similarity: calculatedSimilarity,
                    confidenceScore: item.confidence_score !== undefined ? (isExact ? item.confidence_score : Math.min(item.confidence_score, calculatedSimilarity)) : calculatedSimilarity,
                    confidenceTier: isExact ? (item.confidence_tier || 'High') : (calculatedSimilarity >= 80 ? 'High' : calculatedSimilarity >= 50 ? 'Medium' : 'Low'),
                    temporalIntegrity: item.temporal_integrity !== undefined ? item.temporal_integrity : segmentData.temporal_integrity,
                    assetId: hashKey.slice(0, 16),
                    sha256: hashKey,
                    phash: item.phash || item.PHash || item.record?.phash,
                    mediaType: item.media_type || hashData.media_type || 'unknown',
                    registeredAt: new Date((item.timestamp || item.Timestamp) * 1000).toLocaleString(),
                    creator: item.creator_address || item.CreatorAddress,
                    aiTool: item.ai_tool || item.AiTool,
                    ipfsCid: item.ipfs_cid || item.IpfsCid,
                    mediaS3Url: item.media_s3_url || item.MediaS3Url,
                    mediaIpfsUrl: item.media_ipfs_url || item.MediaIpfsUrl,
                    onChainVerified: item.on_chain_verified,
                    onChainTxHash: item.on_chain_tx_hash
                  }
                  if (existingIndex >= 0) {
                    if (newMatch.matchType === 'deepfake' || matches[existingIndex].matchType !== 'exact') {
                      matches[existingIndex] = { ...matches[existingIndex], ...newMatch }
                    }
                  } else {
                    matches.push(newMatch)
                  }
                }
              }
            }
          }
        }
      } catch (dbErr) { console.warn('Backend similarity search failed:', dbErr.message) }

      setDbResults(matches)
      try { const count = Number(localStorage.getItem('vt_verifs_count') || 0); localStorage.setItem('vt_verifs_count', count + 1) } catch {}
      toast.success('Verification complete!')
    } catch (err) {
      setError(`Failed to perform verification check: ${err.message}`)
      toast.error(`Verification failed: ${err.message}`)
    }
    finally { setLoading(false) }
  }

  return (
    <section>
      <PageHero eyebrow="AUTHENTICITY INTELLIGENCE" title="See the evidence behind a file." description="Compare content against public records and layered similarity signals to identify originals, likely derivatives, and high-risk alterations." icon={Search} />
      <ScrollReveal variant="fade-up">
      <div className="max-w-[1280px] mx-auto px-5 pt-10 pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">
        {/* LEFT */}
        <div className="flex flex-col gap-8">
          <SpotlightCard>
            <Card className="card-hover-glow">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><Search size={16} className="text-[var(--accent)]" /> Forensic intake</span>
                </CardTitle>
              </CardHeader>
              <CardBody className="flex flex-col gap-4">
                <FileUpload onFileSelected={handleFileSelected} label="Drop a file to inspect its provenance" />
              </CardBody>
            </Card>
          </SpotlightCard>

          <AnimatePresence>
            {(localSha256 || loading) && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="card-hover-glow">
                  <CardHeader><CardTitle>Evidence extracted</CardTitle></CardHeader>
                  <CardBody className="flex flex-col gap-3">
                    {loading && !localSha256 ? <div className="skeleton h-9 rounded-lg w-full" /> : (
                      <>
                        <HashDisplay label="SHA-256 Cryptographic Hash" hash={localSha256 ? `0x${localSha256}` : null} icon="C" variant="crypto" />
                        {phash && <HashDisplay label="Visual Perceptual Hash (pHash)" hash={phash} icon="P" variant="perceptual" />}
                        {fullHashes?.semantic_hash?.length > 0 && (
                          <HashDisplay 
                            label="Semantic Vector Embedding (64-D CLIP)" 
                            hash={`[${fullHashes.semantic_hash.slice(0, 4).map(n => Number(n).toFixed(3)).join(', ')}, ... ${fullHashes.semantic_hash.length}-dim]`} 
                            icon="S" 
                            variant="semantic" 
                          />
                        )}
                        {fullHashes?.face_hashes?.length > 0 && (
                          <HashDisplay 
                            label="Facial Biometric Mesh (ArcFace 128D)" 
                            hash={`128-D Mesh Landmark Topology (${fullHashes.face_hashes.length} face${fullHashes.face_hashes.length > 1 ? 's' : ''} detected)`} 
                            icon="F" 
                            variant="face" 
                          />
                        )}
                        {fullHashes?.audio_hashes?.length > 0 && (
                          <HashDisplay 
                            label="Temporal Audio Chroma Vector (MFCC)" 
                            hash={`Acoustic Spectrum Fingerprint (${fullHashes.audio_hashes.length} band${fullHashes.audio_hashes.length > 1 ? 's' : ''})`} 
                            icon="A" 
                            variant="audio" 
                          />
                        )}
                      </>
                    )}
                  </CardBody>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-8">
          <AnimatePresence>
            {(blockchainRecord || loading) && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <Card className={blockchainRecord ? 'border-[var(--success-border)]' : ''}>
                  <CardHeader className={blockchainRecord ? 'bg-[var(--success-bg)] border-[var(--success-border)]' : ''}>
                    <CardTitle className={blockchainRecord ? 'text-[var(--success-text)]' : ''}><Shield size={15} /> Immutable registry record</CardTitle>
                    {blockchainRecord && <Badge variant="success">Proof located</Badge>}
                  </CardHeader>
                  <CardBody>
                    {loading && !blockchainRecord ? (
                      <div className="flex flex-col gap-3 pt-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 text-xs">
                        <DataRow label="Registrant Wallet">
                          <Address address={blockchainRecord.creator} head={10} tail={6} />
                        </DataRow>
                        <DataRow label="Proof Committed At" value={new Date(blockchainRecord.timestamp * 1000).toLocaleString()} />
                        <DataRow label="AI Tool Attribution" value={blockchainRecord.aiTool || 'None'} bold />
                        {blockchainRecord.ipfsCid && <DataRow label="Metadata (IPFS)"><a href={`https://gateway.pinata.cloud/ipfs/${blockchainRecord.ipfsCid}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline text-[11px] px-2.5 py-1"><ExternalLink size={12} /> View JSON</a></DataRow>}
                      </div>
                    )}
                  </CardBody>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <SpotlightCard className="flex-1 flex flex-col">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle><Database size={15} className="text-[var(--accent)]" /> Database Similarity Results</CardTitle>
                {dbResults?.length > 0 && <Badge variant="arb">{dbResults.length} matches</Badge>}
              </CardHeader>
              <CardBody className="flex-1 max-h-[520px] overflow-y-auto">
                {loading ? (
                  <div className="py-2">
                    {uploadProgress < 100 ? (
                      <>
                        <div className="flex justify-between text-xs font-semibold mb-1.5"><span className="text-[var(--text-2)]">Uploading...</span><span className="text-[var(--accent)]">{uploadProgress}%</span></div>
                        <Progress value={uploadProgress} />
                      </>
                    ) : (
                      <div className="flex flex-col items-center py-4">
                        <div className="relative w-16 h-16 flex items-center justify-center mb-3">
                          <div className="loading-orb-outer absolute inset-0 rounded-full" style={{ border: '2px solid var(--border)', borderTopColor: 'var(--accent)' }} />
                          <ArbitrumLogo size={20} />
                        </div>
                        <div className="font-semibold text-sm text-[var(--text)]">Searching similarity index...</div>
                        <div className="text-xs text-[var(--text-3)] mt-1">Comparing perceptual Hamming distances on the server.</div>
                      </div>
                    )}
                  </div>
                ) : <SearchResults results={dbResults} loading={loading} uploadedFile={file} />}
              </CardBody>
            </Card>
          </SpotlightCard>
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>
            <Info size={15} className="text-[var(--accent)]" />
            Verification Thresholds
          </CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 sm:grid-cols-3 text-xs">
          <ThresholdCell value="100%" tone="var(--success-text)" title="Cryptographic Match" desc="Byte-level validation. The uploaded file is completely identical to the registered original." />
          <ThresholdCell value="80%+" tone="var(--warning-text)" title="Perceptual Match" desc="Structural verification. The content matches closely, indicating potential cropping, resizing, or compression." />
          <ThresholdCell value="<80%" tone="var(--text-3)" title="Unregistered / Original" desc="No matching record. The media is unique or has not yet been registered on-chain." last />
        </div>
      </Card>
      </div>
      </ScrollReveal>
    </section>
  )
}

function DataRow({ label, value, bold, children }) {
  return <div className="flex justify-between items-center gap-4 py-1.5 border-b border-dashed border-[var(--border)] last:border-b-0"><span className="text-[var(--text-3)]">{label}</span>{children || <span className={`text-right text-[var(--text)] ${bold ? 'font-semibold' : ''}`}>{value}</span>}</div>
}

function ThresholdCell({ value, tone, title, desc, last }) {
  return (
    <div className={`flex gap-4 p-4 border-[var(--border)] ${last ? '' : 'border-b sm:border-b-0 sm:border-r'}`}>
      <div className="flex-shrink-0 font-mono font-semibold text-base min-w-[3.2rem] pt-0.5" style={{ color: tone }}>{value}</div>
      <div className="flex flex-col gap-0.5">
        <div className="font-semibold text-[var(--text)] text-[13px]">{title}</div>
        <div className="text-[var(--text-3)] leading-relaxed text-[11.5px]">{desc}</div>
      </div>
    </div>
  )
}
