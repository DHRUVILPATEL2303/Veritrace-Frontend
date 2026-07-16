'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

/**
 * ChainSimulation — Animated blockchain block chain visualization
 * Shows blocks being added sequentially with transaction flow
 * Props:
 *   - autoPlay: boolean (automatically add blocks)
 *   - blockCount: number (initial blocks to display)
 */
export function ChainSimulation({ autoPlay = true, blockCount = 5 }) {
  const [blocks, setBlocks] = useState([])
  const [nextId, setNextId] = useState(blockCount)

  useEffect(() => {
    // Initialize with starting blocks
    setBlocks(
      Array.from({ length: blockCount }, (_, i) => ({
        id: i,
        hash: Math.random().toString(36).substring(7),
        timestamp: Date.now() - (blockCount - i) * 2000,
        transactions: Math.floor(Math.random() * 8) + 2,
      }))
    )
    setNextId(blockCount)
  }, [blockCount])

  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      const newBlock = {
        id: nextId,
        hash: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
        transactions: Math.floor(Math.random() * 8) + 2,
      }
      setBlocks((prev) => {
        const updated = [newBlock, ...prev.slice(0, 4)]
        return updated
      })
      setNextId((prev) => prev + 1)
    }, 3000)

    return () => clearInterval(interval)
  }, [autoPlay, nextId])

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-3)] mb-2">Blockchain Blocks</div>

      <div className="flex flex-col gap-2.5">
        {blocks.map((block, idx) => (
          <motion.div
            key={`${block.id}-${idx}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2.5"
          >
            {/* Block number */}
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--bg-3)] border border-[var(--border)] flex-shrink-0 font-mono text-xs font-bold text-[#12AAFF]">
              #{block.id}
            </div>

            {/* Block content */}
            <div className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-2)] border border-[var(--border)] min-w-0">
              <div className="flex flex-col gap-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-3)]">Hash:</span>
                  <code className="text-[#12AAFF] font-mono truncate">{`0x${block.hash}`}</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-3)]">Txs:</span>
                  <span className="text-[#00D395] font-semibold">{block.transactions}</span>
                </div>
              </div>
            </div>

            {/* Connection line */}
            {idx < blocks.length - 1 && (
              <div className="flex items-center justify-center w-4 h-4 flex-shrink-0">
                <motion.div
                  className="w-0.5 h-6 bg-gradient-to-b from-[#12AAFF] to-[#00D395]"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ transformOrigin: 'top' }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Auto-add indicator */}
      {autoPlay && (
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[var(--text-3)]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#12AAFF] animate-pulse" />
          <span>New blocks every 3 seconds</span>
        </div>
      )}
    </div>
  )
}
