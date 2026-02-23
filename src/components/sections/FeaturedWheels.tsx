import React from 'react'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { FadeUpOnScroll } from '@/components/animations/FadeUpOnScroll'
import { WheelCard } from './WheelCard'

async function getFeaturedWheels() {
  const payload = await getPayload({ config: await config })
  const result = await payload.find({
    collection: 'wheels',
    where: { featured: { equals: true } },
    limit: 6,
    depth: 2,
  })
  return result.docs
}

interface FeaturedWheelsProps {
  backgroundImageUrl?: string | null
}

export async function FeaturedWheels({ backgroundImageUrl }: FeaturedWheelsProps) {
  const wheels = await getFeaturedWheels()
  if (wheels.length === 0) return null

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {backgroundImageUrl && (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={backgroundImageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 z-[1] bg-bg/75" />
        </>
      )}
      <div className="relative z-10 max-w-7xl mx-auto">
        <FadeUpOnScroll>
          <h2 className="font-display text-4xl md:text-5xl tracking-widest text-text text-center">
            FEATURED WHEELS
          </h2>
          <p className="font-serif text-xl text-text-muted text-center mt-4 max-w-2xl mx-auto">
            Hand-forged. Precision-engineered. Built to perform.
          </p>
        </FadeUpOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {wheels.slice(0, 6).map((wheel, i) => (
            <FadeUpOnScroll key={wheel.id} delay={i * 0.1}>
              <WheelCard wheel={wheel} />
            </FadeUpOnScroll>
          ))}
        </div>
        <FadeUpOnScroll className="text-center mt-12">
          <a
            href="/wheels"
            className="font-body text-sm uppercase tracking-wider text-gold hover:text-gold-highlight"
          >
            View all wheels →
          </a>
        </FadeUpOnScroll>
      </div>
    </section>
  )
}
