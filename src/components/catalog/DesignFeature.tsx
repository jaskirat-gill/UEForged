import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FadeUpOnScroll } from '@/components/animations/FadeUpOnScroll'
import type { CatalogDesign } from '@/data/catalog'
import { cn } from '@/lib/utils'

interface DesignFeatureProps {
  design: CatalogDesign
  reverse?: boolean
}

export function DesignFeature({ design, reverse = false }: DesignFeatureProps) {
  return (
    <article className="mb-24 md:mb-40 last:mb-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <FadeUpOnScroll
          className={cn('lg:col-span-7', reverse && 'lg:order-2')}
        >
          <div className="group relative aspect-[3/4] overflow-hidden bg-surface">
            <Image
              src={design.hero.src}
              alt={design.hero.alt}
              fill
              style={{ objectPosition: design.hero.focus }}
              className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
            <span className="absolute top-6 left-6 font-body text-[10px] uppercase tracking-[0.4em] text-text/80 bg-bg/40 backdrop-blur-sm px-3 py-1.5">
              {design.finish}
            </span>
          </div>
        </FadeUpOnScroll>

        <FadeUpOnScroll delay={0.15} className={cn('lg:col-span-5', reverse && 'lg:order-1')}>
          <p className="font-body text-xs uppercase tracking-[0.4em] text-gold">
            {design.series}
          </p>
          <h3 className="mt-3 font-display text-7xl md:text-8xl leading-none text-outline-gold">
            {design.code}
          </h3>
          <p className="mt-2 font-serif italic text-2xl text-gold">{design.finish}</p>
          <p className="mt-8 font-body text-text-muted leading-relaxed">{design.summary}</p>

          <dl className="mt-10 border-t border-border">
            {design.specs.map((spec) => (
              <div
                key={spec.label}
                className="grid grid-cols-5 gap-4 py-4 border-b border-border"
              >
                <dt className="col-span-2 font-body text-[11px] uppercase tracking-[0.25em] text-text-muted pt-0.5">
                  {spec.label}
                </dt>
                <dd className="col-span-3 font-body text-sm text-text">{spec.value}</dd>
              </div>
            ))}
          </dl>

          {design.wheelSlug && (
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              <Link
                href={`/order?wheel=${design.wheelSlug}`}
                className="font-body text-sm uppercase tracking-wider text-gold hover:text-gold-highlight transition-colors"
              >
                Order this design →
              </Link>
              <Link
                href={`/wheels/${design.wheelSlug}`}
                className="font-body text-sm uppercase tracking-wider text-text-muted hover:text-gold transition-colors"
              >
                View details
              </Link>
            </div>
          )}
        </FadeUpOnScroll>
      </div>

      <div
        className={cn(
          'mt-6 md:mt-10 grid grid-cols-2 gap-3 md:gap-6',
          design.gallery.length >= 4 ? 'md:grid-cols-4' : 'md:grid-cols-2 lg:w-7/12',
          design.gallery.length < 4 && reverse && 'lg:ml-auto'
        )}
      >
        {design.gallery.map((image, i) => (
          <FadeUpOnScroll key={image.src} delay={0.08 * i}>
            <figure className="group relative aspect-[3/4] overflow-hidden bg-surface">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                style={{ objectPosition: image.focus }}
                className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-bg/90 to-transparent font-body text-xs text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                {image.alt}
              </figcaption>
            </figure>
          </FadeUpOnScroll>
        ))}
      </div>
    </article>
  )
}
