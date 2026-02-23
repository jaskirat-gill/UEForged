'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ButtonLink } from '@/components/ui/Button'

interface HeroProps {
  headline: string
  subtext?: string | null
  heroMedia?: { url?: string | null } | null
}

export function Hero({ headline, subtext, heroMedia }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-bg">
        {heroMedia?.url ? (
          <Image
            src={heroMedia.url}
            alt=""
            fill
            className="object-cover opacity-30"
            priority
            sizes="100vw"
          />
        ) : (
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background:
                'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(201,168,76,0.15) 0%, transparent 50%)',
            }}
          />
        )}
        <div className="absolute inset-0 bg-bg/60" />
        <div className="grain-overlay absolute inset-0" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.h1
          className="font-display text-6xl md:text-8xl lg:text-9xl tracking-[0.15em] text-text"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {headline}
        </motion.h1>
        {subtext && (
          <motion.p
            className="font-serif text-xl md:text-2xl text-gold mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {subtext}
          </motion.p>
        )}
        <motion.div
          className="flex flex-wrap gap-4 justify-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <ButtonLink href="/wheels" variant="primary">
            View Our Work
          </ButtonLink>
          <ButtonLink href="/quote" variant="outline">
            Get a Quote
          </ButtonLink>
        </motion.div>
      </div>
    </section>
  )
}
