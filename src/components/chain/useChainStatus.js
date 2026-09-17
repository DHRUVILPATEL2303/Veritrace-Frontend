import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { ARBITRUM_SEPOLIA } from '../../config'

let provider = null
function getProvider() {
  if (!provider) provider = new ethers.JsonRpcProvider(ARBITRUM_SEPOLIA.rpcUrl)
  return provider
}

/** Polls the Arbitrum Sepolia RPC for the head block and gas price. */
export function useChainStatus(intervalMs = 12000) {
  const [status, setStatus] = useState({ block: null, gasGwei: null, ok: true })

  useEffect(() => {
    let alive = true
    const tick = async () => {
      try {
        const p = getProvider()
        const [block, fee] = await Promise.all([p.getBlockNumber(), p.getFeeData()])
        const gwei = fee.gasPrice ? Number(ethers.formatUnits(fee.gasPrice, 'gwei')) : null
        if (alive) setStatus({ block, gasGwei: gwei, ok: true })
      } catch {
        if (alive) setStatus(s => ({ ...s, ok: false }))
      }
    }
    tick()
    const id = setInterval(tick, intervalMs)
    return () => { alive = false; clearInterval(id) }
  }, [intervalMs])

  return status
}

export function timeAgo(tsSeconds) {
  if (!tsSeconds) return '—'
  const diff = Math.max(0, Math.floor(Date.now() / 1000 - tsSeconds))
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}
