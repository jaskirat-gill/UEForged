'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface CursorGlowProps {
  className?: string
}

export function CursorGlow({ className }: CursorGlowProps) {
  const [mounted, setMounted] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  if (!mounted) return null

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[9999] hidden sm:block ${className ?? ''}`}
      aria-hidden
    >
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 140,
          height: 140,
          background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.02) 50%, transparent 75%)',
          boxShadow: '0 0 36px 18px rgba(201,168,76,0.04)',
        }}
        animate={{
          left: pos.x - 70,
          top: pos.y - 70,
          opacity: [0.5, 0.85, 0.5],
          scale: [0.96, 1.04, 0.96],
        }}
        transition={{
          left: { type: 'spring', damping: 30, stiffness: 200 },
          top: { type: 'spring', damping: 30, stiffness: 200 },
          opacity: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
          scale: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 80,
          height: 80,
          background: 'radial-gradient(circle, rgba(232,201,106,0.09) 0%, transparent 70%)',
        }}
        animate={{
          left: pos.x - 40,
          top: pos.y - 40,
          opacity: [0.35, 0.6, 0.35],
        }}
        transition={{
          left: { type: 'spring', damping: 30, stiffness: 200 },
          top: { type: 'spring', damping: 30, stiffness: 200 },
          opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
    </div>
  )
}
