'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

const defaultTransition = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }

interface FadeUpOnScrollProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function FadeUpOnScroll({ children, className, delay = 0 }: FadeUpOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ ...defaultTransition, delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
