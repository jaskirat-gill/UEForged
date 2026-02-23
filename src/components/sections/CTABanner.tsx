import React from 'react'
import Image from 'next/image'
import { FadeUpOnScroll } from '@/components/animations/FadeUpOnScroll'
import { ButtonLink } from '@/components/ui/Button'

interface CTABannerProps {
  backgroundImageUrl?: string | null
}

export function CTABanner({ backgroundImageUrl }: CTABannerProps) {
  return (
    <section className="relative py-24 px-6 border-t border-border overflow-hidden">
      {backgroundImageUrl && (
        <>
          <div className="absolute inset-0 z-0">
            <Image src={backgroundImageUrl} alt="" fill className="object-cover" sizes="100vw" />
          </div>
          <div className="absolute inset-0 z-[1] bg-bg/85" />
        </>
      )}
      <FadeUpOnScroll>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-widest text-text">
            YOUR BUILD STARTS HERE
          </h2>
          <p className="font-body text-text-muted mt-6 text-lg">
            Request a quote. Tell us your car, your style, your vision.
          </p>
          <div className="mt-10">
            <ButtonLink href="/quote" variant="primary" className="text-base px-10 py-4">
              Get a Quote
            </ButtonLink>
          </div>
        </div>
      </FadeUpOnScroll>
    </section>
  )
}
