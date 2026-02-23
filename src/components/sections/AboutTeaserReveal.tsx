'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'

interface AboutTeaserRevealProps {
  backgroundImageUrl?: string | null
  scrollProgress: MotionValue<number>
}

export function AboutTeaserReveal({
  backgroundImageUrl,
  scrollProgress,
}: AboutTeaserRevealProps) {
  const headingOpacity = useTransform(scrollProgress, [0.38, 0.52, 0.68], [0, 1, 1])
  const headingY = useTransform(scrollProgress, [0.38, 0.52, 0.68], [36, 0, 0])
  const bodyOpacity = useTransform(scrollProgress, [0.42, 0.56, 0.72], [0, 1, 1])
  const bodyY = useTransform(scrollProgress, [0.42, 0.56, 0.72], [28, 0, 0])

  return (
    <section className="relative py-24 px-6 border-t border-border overflow-hidden">
      {backgroundImageUrl && (
        <>
          <div className="absolute inset-0 z-0">
            <Image src={backgroundImageUrl} alt="" fill className="object-cover" sizes="100vw" />
          </div>
          <div className="absolute inset-0 z-[1] bg-bg/80" />
        </>
      )}
      <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          className="md:order-2"
          style={{ opacity: headingOpacity, y: headingY }}
        >
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-widest uppercase text-outline-gold">
            WHY FORGED?
          </h2>
        </motion.div>
        <motion.div
          className="md:order-1"
          style={{ opacity: bodyOpacity, y: bodyY }}
        >
          <p className="font-body text-text-muted text-lg leading-relaxed mb-6">
            Forged wheels are machined from a single billet of aerospace-grade aluminum. The result
            is a stronger, lighter wheel that performs under the most demanding conditions. No
            casting. No compromise.
          </p>
          <p className="font-body text-text-muted text-lg leading-relaxed mb-8">
            Every UEForged wheel is designed and manufactured to order — your build, your specs,
            your vision.
          </p>
          <Link
            href="/wheels"
            className="font-body text-sm uppercase tracking-wider text-gold hover:text-gold-highlight transition-colors"
          >
            View collection →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
