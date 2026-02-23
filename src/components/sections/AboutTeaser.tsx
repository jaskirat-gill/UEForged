import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FadeUpOnScroll } from '@/components/animations/FadeUpOnScroll'

interface AboutTeaserProps {
  backgroundImageUrl?: string | null
}

export function AboutTeaser({ backgroundImageUrl }: AboutTeaserProps) {
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
        <FadeUpOnScroll className="md:order-2">
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-widest uppercase text-outline-gold">
            WHY FORGED?
          </h2>
        </FadeUpOnScroll>
        <FadeUpOnScroll delay={0.1} className="md:order-1">
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
            href="/about"
            className="font-body text-sm uppercase tracking-wider text-gold hover:text-gold-highlight transition-colors"
          >
            Our process →
          </Link>
        </FadeUpOnScroll>
      </div>
    </section>
  )
}
