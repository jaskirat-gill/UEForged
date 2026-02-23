'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import type { MotionValue } from 'framer-motion'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ScrollParallaxShowcaseProps {
  imageUrl: string | null
  /** When provided (e.g. from ParallaxWithAbout), animation is driven by shared scroll */
  scrollProgress?: MotionValue<number> | null
}

export function ScrollParallaxShowcase({ imageUrl, scrollProgress: externalProgress }: ScrollParallaxShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: internalProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const progress = externalProgress ?? internalProgress

  const rotateY = useTransform(progress, [0.08, 0.35, 0.5, 0.75], [-32, 0, 0, 32])
  const rotateX = useTransform(progress, [0.08, 0.35, 0.5, 0.75], [14, 0, 0, -14])
  const scale = useTransform(progress, [0.05, 0.3, 0.5, 0.85], [0.88, 1.04, 1.04, 0.88])
  const y = useTransform(progress, [0, 0.3, 0.5, 1], [100, 0, 0, -80])
  const opacity = useTransform(progress, [0, 0.12, 0.75, 1], [0, 1, 1, 0])

  return (
    <section
      ref={externalProgress ? undefined : containerRef}
      className="relative py-32 md:py-48 px-6 overflow-hidden"
      aria-hidden
    >
      <div className="max-w-5xl mx-auto" style={{ perspective: '1400px' }}>
        <motion.div
          className="relative w-full aspect-[4/3] md:aspect-[16/10] rounded-2xl overflow-hidden border border-border bg-surface shadow-2xl"
          style={{
            rotateX,
            rotateY,
            scale,
            y,
            opacity,
          }}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1024px"
              priority={false}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,168,76,0.12) 0%, transparent 50%), linear-gradient(180deg, rgba(26,26,26,0.98) 0%, rgba(8,8,8,0.99) 100%)',
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg/40 via-transparent to-bg/20 pointer-events-none" />
        </motion.div>
        <motion.p
          className="font-display text-center text-gold/60 tracking-[0.3em] text-sm mt-8"
          style={{ opacity }}
        >
          PRECISION IN MOTION
        </motion.p>
      </div>
    </section>
  )
}
