'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const steps = [
  { label: 'Design', sub: 'Your vision, our engineering' },
  { label: 'Forge', sub: 'Single billet. Aerospace-grade.' },
  { label: 'Finish', sub: 'Custom color. Perfect detail.' },
]

export function ProcessSteps() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 px-6 border-t border-border" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="font-display text-4xl md:text-5xl tracking-widest text-text text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          THE PROCESS
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 relative">
          {/* Animated connecting line */}
          <motion.div
            className="absolute top-12 left-0 right-0 hidden md:block h-px bg-border"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ originX: 0 }}
          />
          <motion.div
            className="absolute top-12 left-0 right-0 hidden md:block h-px bg-gold opacity-60"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ originX: 0 }}
          />
          {steps.map((step, i) => {
            const transition = { duration: 0.7, delay: 0.3 + i * 0.15, ease: [0.22, 1, 0.36, 1] as const }
            return (
              <motion.div
                key={step.label}
                className="relative text-center py-8 md:py-12"
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={transition}
              >
                <div className="hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 border-gold bg-bg z-10" />
                <h3 className="font-display text-2xl md:text-3xl tracking-widest text-gold mt-4">
                  {step.label}
                </h3>
                <p className="font-body text-text-muted mt-2">{step.sub}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
