'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { CatalogImage } from '@/data/catalog'
import { toRoman } from '@/lib/roman'

const ease = [0.22, 1, 0.36, 1] as const

interface CatalogHeroProps {
  eyebrow: string
  title: string
  tagline: string
  edition: string
  year: string
  image: CatalogImage
  chapters: { id: string; label: string }[]
}

export function CatalogHero({
  eyebrow,
  title,
  tagline,
  edition,
  year,
  image,
  chapters,
}: CatalogHeroProps) {
  const [first, ...rest] = title.split(' ')

  return (
    <section className="relative min-h-screen pt-20 overflow-hidden grain-overlay">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center min-h-[calc(100vh-5rem)] py-12">
        <div className="lg:col-span-5 order-2 lg:order-1">
          <motion.img
            src="/catalog/uef-emblem.svg"
            alt="Upper Echelon Forged emblem"
            className="w-20 h-20 md:w-24 md:h-24"
            initial={{ opacity: 0, rotate: -30 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease }}
          />
          <motion.p
            className="mt-10 font-body text-xs uppercase tracking-[0.4em] text-gold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
          >
            {eyebrow}
          </motion.p>
          <motion.h1
            className="mt-4 font-display leading-[0.85] tracking-wider"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease }}
          >
            <span className="block font-serif italic normal-case text-4xl md:text-5xl text-text-muted tracking-normal">
              {first}
            </span>
            <span className="block text-7xl sm:text-8xl md:text-9xl text-text uppercase">
              {rest.join(' ')}
            </span>
          </motion.h1>
          <motion.div
            className="mt-6 flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <span className="h-px w-16 bg-gold" />
            <span className="font-serif italic text-xl text-gold">
              {edition} · {year}
            </span>
          </motion.div>
          <motion.p
            className="mt-8 font-body text-lg text-text-muted max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease }}
          >
            {tagline}
          </motion.p>

          <motion.nav
            aria-label="Catalog contents"
            className="mt-12 border-t border-border pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-text-muted mb-4">
              Contents
            </p>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {chapters.map((chapter, i) => (
                <li key={chapter.id}>
                  <a
                    href={`#${chapter.id}`}
                    className="group flex items-baseline gap-3 font-body text-sm text-text-muted hover:text-gold transition-colors"
                  >
                    <span className="font-serif italic text-gold">{toRoman(i + 1)}</span>
                    <span className="uppercase tracking-wider">{chapter.label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </motion.nav>
        </div>

        <motion.div
          className="lg:col-span-7 order-1 lg:order-2 relative"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease }}
        >
          <div className="absolute -inset-3 md:-inset-5 border border-border translate-x-3 translate-y-3 md:translate-x-5 md:translate-y-5 pointer-events-none" />
          <div className="relative aspect-[4/5] lg:aspect-[3/4] max-h-[85vh] w-full overflow-hidden bg-surface">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
