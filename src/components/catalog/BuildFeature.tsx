import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FadeUpOnScroll } from '@/components/animations/FadeUpOnScroll'
import type { CatalogBuild } from '@/data/catalog'
import { cn } from '@/lib/utils'

interface BuildFeatureProps {
  build: CatalogBuild
  index: number
}

export function BuildFeature({ build, index }: BuildFeatureProps) {
  const [lead, ...supporting] = build.images
  const reverse = index % 2 === 1

  return (
    <article className="mb-24 md:mb-36 last:mb-0">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6">
        {lead && (
          <FadeUpOnScroll
            className={cn(
              'md:col-span-7',
              supporting.length === 0 && 'md:col-span-12',
              reverse && 'md:order-2'
            )}
          >
            <div className="group relative aspect-[4/5] overflow-hidden bg-surface">
              <Image
                src={lead.src}
                alt={lead.alt}
                fill
                style={{ objectPosition: lead.focus }}
                className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 58vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                <p className="font-body text-xs uppercase tracking-[0.4em] text-gold">
                  {build.maker}
                </p>
                <h3 className="mt-2 font-display text-5xl md:text-7xl tracking-wider text-text uppercase leading-none">
                  {build.vehicle}
                </h3>
                <p className="mt-3 font-serif italic text-xl md:text-2xl text-text/90">
                  {build.setup}
                </p>
              </div>
            </div>
          </FadeUpOnScroll>
        )}

        {supporting.length > 0 && (
          <div
            className={cn(
              'md:col-span-5 grid gap-3 md:gap-6',
              supporting.length >= 2 ? 'grid-cols-2 md:grid-cols-1' : 'grid-cols-1',
              reverse && 'md:order-1'
            )}
          >
            {supporting.slice(0, 2).map((image, i) => (
              <FadeUpOnScroll key={image.src} delay={0.1 * (i + 1)}>
                <div
                  className={cn(
                    'group relative overflow-hidden bg-surface',
                    supporting.length >= 2 ? 'aspect-[3/4] md:aspect-[5/4]' : 'aspect-[3/4] md:aspect-auto md:h-full'
                  )}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    style={{ objectPosition: image.focus }}
                    className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 40vw"
                  />
                </div>
              </FadeUpOnScroll>
            ))}
          </div>
        )}
      </div>

      <FadeUpOnScroll delay={0.2}>
        <div
          className={cn(
            'mt-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10',
            reverse && 'sm:flex-row-reverse sm:justify-start'
          )}
        >
          <ul className="flex flex-wrap gap-2">
            {build.specs.map((spec) => (
              <li
                key={spec}
                className="font-body text-[11px] uppercase tracking-[0.2em] text-text-muted border border-border px-3 py-1.5"
              >
                {spec}
              </li>
            ))}
          </ul>
          {build.buildSlug && (
            <Link
              href={`/builds/${build.buildSlug}`}
              className="font-body text-sm uppercase tracking-wider text-gold hover:text-gold-highlight transition-colors whitespace-nowrap"
            >
              View the build →
            </Link>
          )}
        </div>
      </FadeUpOnScroll>
    </article>
  )
}
