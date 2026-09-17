import { useEffect, useState } from 'react'
import { getContractEvents } from '@wagmi/core'
import { parseAbi } from 'viem'
import { config } from '../../wagmiConfig'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../config'

let cache = null
let inflight = null

/** Parses ContentRegistered logs into plain records, newest first. Shared across pages. */
export async function fetchRegistryEvents(force = false) {
  if (cache && !force) return cache
  if (inflight) return inflight
  inflight = (async () => {
    const events = await getContractEvents(config, {
      address: CONTRACT_ADDRESS,
      abi: parseAbi(CONTRACT_ABI),
      eventName: 'ContentRegistered',
      fromBlock: 0n,
      toBlock: 'latest',
    })
    const parsed = events.map(ev => {
      const a = ev.args || {}
      return {
        sha256: a.sha256hash,
        creator: a.creator,
        phash: a.phash?.toString() || '0',
        timestamp: Number(a.timestamp || 0n),
        ipfsCid: a.ipfsCid || '',
        aiTool: a.aitool || '',
        txHash: ev.transactionHash,
        blockNumber: Number(ev.blockNumber),
      }
    }).reverse()
    cache = parsed
    inflight = null
    return parsed
  })()
  return inflight
}

export function useRegistryEvents() {
  const [state, setState] = useState({ events: cache || [], loading: !cache, error: null })

  useEffect(() => {
    let alive = true
    fetchRegistryEvents()
      .then(events => { if (alive) setState({ events, loading: false, error: null }) })
      .catch(err => { if (alive) setState(s => ({ ...s, loading: false, error: err.message })) })
    return () => { alive = false }
  }, [])

  return state
}
