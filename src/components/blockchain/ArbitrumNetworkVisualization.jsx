'use client'

import { motion } from 'framer-motion'

/**
 * ArbitrumNetworkVisualization — Interactive blockchain network nodes with animations
 * Displays interconnected nodes representing validators, sequencers, and state
 * Props:
 *   - size: 'sm' | 'md' | 'lg' (controls canvas dimensions)
 *   - interactive: boolean (enable hover interactions)
 */
export function ArbitrumNetworkVisualization({ size = 'md', interactive = true }) {
  const sizes = {
    sm: { width: 200, height: 200, nodeRadius: 8 },
    md: { width: 320, height: 320, nodeRadius: 10 },
    lg: { width: 480, height: 480, nodeRadius: 12 },
  }
  const config = sizes[size] || sizes.md

  // Create network nodes arranged in a circle
  const nodes = Array.from({ length: 7 }, (_, i) => {
    const angle = (i / 7) * Math.PI * 2
    const radius = config.width / 3
    const centerX = config.width / 2
    const centerY = config.height / 2
    return {
      id: i,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      label: ['Sequencer', 'Validator 1', 'Validator 2', 'Validator 3', 'Validator 4', 'Validator 5', 'State'][i],
      type: i === 0 ? 'sequencer' : 'validator',
    }
  })

  const centerNode = {
    x: config.width / 2,
    y: config.height / 2,
    label: 'Arbitrum',
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={config.width} height={config.height} className="border border-[var(--border)] rounded-lg bg-[var(--bg-3)]">
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#12AAFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00D395" stopOpacity="0.2" />
          </linearGradient>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines from center to outer nodes */}
        {nodes.map((node) => (
          <motion.line
            key={`line-${node.id}`}
            x1={centerNode.x}
            y1={centerNode.y}
            x2={node.x}
            y2={node.y}
            stroke="url(#line-gradient)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: node.id * 0.1 }}
          />
        ))}

        {/* Center node */}
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <circle
            cx={centerNode.x}
            cy={centerNode.y}
            r={config.nodeRadius}
            fill="#12AAFF"
            filter="url(#node-glow)"
            opacity="0.8"
          />
          <circle
            cx={centerNode.x}
            cy={centerNode.y}
            r={config.nodeRadius - 2}
            fill="#050507"
          />
          <text
            x={centerNode.x}
            y={centerNode.y}
            textAnchor="middle"
            dy="0.3em"
            fontSize="10"
            fill="#12AAFF"
            fontWeight="bold"
          >
            A
          </text>
        </motion.g>

        {/* Outer nodes */}
        {nodes.map((node, idx) => (
          <motion.g
            key={`node-${node.id}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + idx * 0.05, type: 'spring' }}
          >
            {/* Glow circle */}
            <circle
              cx={node.x}
              cy={node.y}
              r={config.nodeRadius * 2.2}
              fill={node.type === 'sequencer' ? '#12AAFF' : '#00D395'}
              opacity="0.15"
            />
            {/* Node border */}
            <circle
              cx={node.x}
              cy={node.y}
              r={config.nodeRadius}
              fill="none"
              stroke={node.type === 'sequencer' ? '#12AAFF' : '#00D395'}
              strokeWidth="1.5"
            />
            {/* Node fill */}
            <circle
              cx={node.x}
              cy={node.y}
              r={config.nodeRadius - 2}
              fill={node.type === 'sequencer' ? '#050507' : 'rgba(0, 211, 149, 0.1)'}
            />
            {/* Node label indicator */}
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dy="0.3em"
              fontSize="8"
              fill={node.type === 'sequencer' ? '#12AAFF' : '#00D395'}
              fontWeight="bold"
            >
              {node.type === 'sequencer' ? 'S' : 'V'}
            </text>
          </motion.g>
        ))}

        {/* Animated pulse rings */}
        <motion.circle
          cx={centerNode.x}
          cy={centerNode.y}
          r={config.nodeRadius}
          fill="none"
          stroke="#12AAFF"
          strokeWidth="1"
          opacity="0.5"
          initial={{ r: config.nodeRadius, opacity: 0.5 }}
          animate={{ r: config.nodeRadius * 3, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-[var(--text-2)]">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#12AAFF' }} />
          <span>Sequencer</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00D395' }} />
          <span>Validator</span>
        </div>
      </div>
    </div>
  )
}
