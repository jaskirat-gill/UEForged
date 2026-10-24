import React from 'react'
import { FadeUpOnScroll } from '@/components/animations/FadeUpOnScroll'
import { cn } from '@/lib/utils'

interface CatalogChapterProps {
  id: string
  numeral: string
  eyebrow: string
  title: string
  intro?: string
  className?: string
  children: React.ReactNode
}

export function CatalogChapter({
  id,
  numeral,
  eyebrow,
  title,
  intro,
  className,
  children,
}: CatalogChapterProps) {
  return (
    <section id={id} className={cn('scroll-mt-24 py-24 md:py-32 px-6 border-t border-border', className)}>
      <div className="mx-auto max-w-7xl">
        <FadeUpOnScroll>
          <header className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 mb-16 md:mb-24">
            <div className="md:col-span-5">
              <div className="flex items-center gap-4">
                <span className="font-serif italic text-3xl text-gold">{numeral}</span>
                <span className="h-px flex-1 max-w-24 bg-gold/60" />
                <span className="font-body text-xs uppercase tracking-[0.4em] text-text-muted">
                  {eyebrow}
                </span>
              </div>
              <h2 className="mt-6 font-display text-5xl md:text-7xl tracking-wider text-text uppercase leading-none">
                {title}
              </h2>
            </div>
            {intro && (
              <p className="md:col-span-6 md:col-start-7 self-end font-serif text-xl md:text-2xl text-text-muted leading-relaxed">
                {intro}
              </p>
            )}
          </header>
        </FadeUpOnScroll>
        {children}
      </div>
    </section>
  )
}
