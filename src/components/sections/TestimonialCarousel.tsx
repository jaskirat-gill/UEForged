'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeUpOnScroll } from '@/components/animations/FadeUpOnScroll'

interface Testimonial {
  id: string
  customerName: string
  location?: string | null
  quote: string
  rating?: number | null
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
  backgroundImageUrl?: string | null
}

export function TestimonialCarousel({ testimonials, backgroundImageUrl }: TestimonialCarouselProps) {
  const [index, setIndex] = useState(0)
  const total = testimonials.length

  if (total === 0) return null

  const current = testimonials[index]!

  return (
    <section className={`relative py-24 px-6 border-t border-border overflow-hidden ${!backgroundImageUrl ? 'bg-surface' : ''}`}>
      {backgroundImageUrl && (
        <>
          <div className="absolute inset-0 z-0">
            <Image src={backgroundImageUrl} alt="" fill className="object-cover" sizes="100vw" />
          </div>
          <div className="absolute inset-0 z-[1] bg-bg/80" />
        </>
      )}
      <div className="relative z-10 max-w-4xl mx-auto">
        <FadeUpOnScroll>
          <h2 className="font-display text-4xl md:text-5xl tracking-widest text-text text-center">
            WHAT DRIVERS SAY
          </h2>
        </FadeUpOnScroll>
        <FadeUpOnScroll delay={0.1}>
          <div className="relative mt-16 p-8 md:p-12 rounded-lg border border-border bg-surface-elevated">
            <span className="absolute top-6 left-8 text-6xl text-gold/30 font-serif">&ldquo;</span>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <p className="font-serif text-xl md:text-2xl text-text leading-relaxed">
                  {current.quote}
                </p>
                <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="font-display text-gold tracking-wider">{current.customerName}</p>
                    {current.location && (
                      <p className="font-body text-sm text-text-muted">{current.location}</p>
                    )}
                  </div>
                  {current.rating != null && (
                    <p className="font-body text-gold text-sm">
                      {'★'.repeat(current.rating)}{'☆'.repeat(5 - current.rating)}
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
            {total > 1 && (
              <div className="flex gap-2 justify-center mt-8">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === index ? 'bg-gold' : 'bg-border'
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </FadeUpOnScroll>
      </div>
    </section>
  )
}
