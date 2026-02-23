'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Build, Media, Wheel } from '@/payload-types'

interface BuildsGalleryClientProps {
  builds: Build[]
}

function getFirstImageUrl(b: Build): string | null {
  const first = b.images?.[0]?.image
  if (!first) return null
  return typeof first === 'object' && first.url ? first.url : null
}

function getWheelName(wheel: string | Wheel | null | undefined): string {
  if (!wheel) return ''
  return typeof wheel === 'object' && wheel.name ? wheel.name : ''
}

/** Bento cell sizes: large (2x2), wide (2x1), tall (1x2), small (1x1). Repeating pattern for visual rhythm. */
const BENTO_PATTERN: Array<'large' | 'wide' | 'tall' | 'small'> = [
  'large',
  'wide',
  'tall',
  'small',
  'wide',
  'small',
  'tall',
  'small',
  'wide',
  'large',
]

function getBentoSize(index: number): 'large' | 'wide' | 'tall' | 'small' {
  return BENTO_PATTERN[index % BENTO_PATTERN.length]
}

const sizeClasses = {
  large: 'col-span-2 row-span-2',
  wide: 'col-span-2 row-span-1',
  tall: 'col-span-1 row-span-2',
  small: 'col-span-1 row-span-1',
}

export function BuildsGalleryClient({ builds }: BuildsGalleryClientProps) {
  if (builds.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="font-body text-text-muted">No builds yet. Check back soon.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="px-6 pt-24 pb-12 max-w-7xl mx-auto">
        <motion.h1
          className="font-display text-4xl md:text-6xl tracking-widest text-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          BUILDS
        </motion.h1>
        <motion.p
          className="font-serif text-xl text-text-muted mt-4 max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Select a build to explore the full gallery and details.
        </motion.p>
      </div>

      <div className="px-4 md:px-6 pb-24 max-w-7xl mx-auto">
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[220px]"
          style={{ gridAutoFlow: 'dense' }}
        >
          {builds.map((build, i) => {
            const imageUrl = getFirstImageUrl(build)
            const wheelName = getWheelName(build.wheelUsed ?? undefined)
            const size = getBentoSize(i)
            const hasMultipleImages = (build.images?.length ?? 0) > 1

            return (
              <motion.div
                key={build.id}
                className={sizeClasses[size]}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.6,
                  delay: Math.min(i * 0.08, 0.4),
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={`/builds/${build.slug}`}
                  className="group block h-full w-full rounded-xl overflow-hidden bg-surface border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  <div className="relative w-full h-full min-h-full">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={build.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-text-muted font-body text-sm">
                        No image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent opacity-90 md:opacity-0 md:group-hover:opacity-90 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
                      <span className="font-display text-lg md:text-xl lg:text-2xl tracking-wider text-text drop-shadow-sm">
                        {build.carMake} {build.carModel}
                      </span>
                      <span className="font-body text-sm text-gold mt-0.5">
                        {build.year}
                        {wheelName ? ` · ${wheelName}` : ''}
                      </span>
                      <span className="font-body text-xs text-text-muted mt-2 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                        View build {hasMultipleImages ? `· ${build.images?.length} photos` : ''}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
