import React from 'react'
import Image from 'next/image'
import { catalog } from '@/data/catalog'
import { CatalogHero } from '@/components/catalog/CatalogHero'
import { toRoman } from '@/lib/roman'
import { CatalogChapter } from '@/components/catalog/CatalogChapter'
import { DesignFeature } from '@/components/catalog/DesignFeature'
import { BuildFeature } from '@/components/catalog/BuildFeature'
import { FadeUpOnScroll } from '@/components/animations/FadeUpOnScroll'
import { ButtonLink } from '@/components/ui/Button'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'The Collection',
  description:
    'The UEForged catalog: forged wheel designs, constructions, finishes and bespoke commissions.',
  openGraph: {
    title: 'The Collection | UEForged',
    description: catalog.hero.tagline,
    images: [{ url: catalog.hero.image.src }],
  },
}

const chapters = [
  { id: 'designs', label: 'Designs' },
  { id: 'construction', label: 'Construction' },
  { id: 'finishes', label: 'Finishes' },
  { id: 'specification', label: 'Specification' },
  { id: 'commissions', label: 'Commissions' },
  { id: 'process', label: 'Process' },
]

const numeral = (id: string) => toRoman(chapters.findIndex((c) => c.id === id) + 1)

export default function CatalogPage() {
  return (
    <>
      <CatalogHero
        eyebrow={catalog.hero.eyebrow}
        title={catalog.hero.title}
        tagline={catalog.hero.tagline}
        edition={catalog.edition}
        year={catalog.year}
        image={catalog.hero.image}
        chapters={chapters}
      />

      {/* Manifesto */}
      <section className="py-24 md:py-40 px-6 border-t border-border">
        <FadeUpOnScroll className="mx-auto max-w-4xl text-center">
          <span className="block mx-auto h-16 w-px bg-gold/60" />
          <h2 className="mt-10 font-serif italic text-4xl md:text-6xl text-text">
            {catalog.manifesto.heading}
          </h2>
          {catalog.manifesto.body.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-8 font-serif text-xl md:text-2xl leading-relaxed text-text-muted"
            >
              {paragraph}
            </p>
          ))}
        </FadeUpOnScroll>
      </section>

      <CatalogChapter
        id="designs"
        numeral={numeral('designs')}
        eyebrow="The Range"
        title="Designs"
        intro="Every design is named by series and number. Each one can be re-sized, re-finished and re-engineered for your car."
      >
        {catalog.designs.map((design, i) => (
          <DesignFeature key={design.code} design={design} reverse={i % 2 === 1} />
        ))}
      </CatalogChapter>

      <CatalogChapter
        id="construction"
        numeral={numeral('construction')}
        eyebrow="Architecture"
        title="Construction"
        intro="Four ways to build a forged wheel. We will recommend the right one for how you drive."
        className="bg-bg-elevated"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-border">
          {catalog.constructions.map((item, i) => (
            <FadeUpOnScroll
              key={item.name}
              delay={0.08 * i}
              className="border-r border-b border-border p-8 md:p-10 group hover:bg-surface transition-colors"
            >
              <span className="font-display text-6xl text-outline-gold">0{i + 1}</span>
              <h3 className="mt-8 font-display text-3xl tracking-wider text-text uppercase group-hover:text-gold transition-colors">
                {item.name}
              </h3>
              <p className="mt-4 font-body text-sm leading-relaxed text-text-muted">
                {item.description}
              </p>
            </FadeUpOnScroll>
          ))}
        </div>
      </CatalogChapter>

      <CatalogChapter
        id="finishes"
        numeral={numeral('finishes')}
        eyebrow="Surface"
        title="Finishes"
        intro="From mirror polish to stealth matte. Finishes can be mixed across face, barrel and ring."
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-x-6 gap-y-14">
          {catalog.finishes.map((finish, i) => (
            <FadeUpOnScroll key={finish.name} delay={0.06 * i} className="text-center">
              <div className="relative mx-auto w-28 h-28 md:w-32 md:h-32 rounded-full p-1.5 border border-border">
                <div
                  className="w-full h-full rounded-full shadow-[inset_0_2px_12px_rgba(0,0,0,0.6)]"
                  style={{ background: finish.swatch }}
                />
                <div className="absolute inset-[38%] rounded-full bg-bg border border-border" />
              </div>
              <h3 className="mt-6 font-display text-xl tracking-wider text-text uppercase">
                {finish.name}
              </h3>
              <p className="mt-2 font-body text-xs text-text-muted">{finish.description}</p>
            </FadeUpOnScroll>
          ))}
        </div>
      </CatalogChapter>

      <CatalogChapter
        id="specification"
        numeral={numeral('specification')}
        eyebrow="Made to Measure"
        title="Specification"
        className="bg-bg-elevated"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <FadeUpOnScroll className="lg:col-span-7">
            <dl className="border-t border-border">
              {catalog.specSheet.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-6 py-6 border-b border-border"
                >
                  <dt className="sm:col-span-2 font-body text-xs uppercase tracking-[0.3em] text-gold pt-1">
                    {row.label}
                  </dt>
                  <dd className="sm:col-span-3 font-serif text-xl text-text">{row.value}</dd>
                </div>
              ))}
            </dl>
          </FadeUpOnScroll>
          <FadeUpOnScroll delay={0.15} className="lg:col-span-5">
            <h3 className="font-display text-3xl tracking-wider text-text uppercase">
              Personalisation
            </h3>
            <ul className="mt-8 space-y-8">
              {catalog.personalisation.map((item) => (
                <li key={item.name} className="flex gap-5">
                  <span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-gold" />
                  <div>
                    <p className="font-body text-sm uppercase tracking-wider text-text">
                      {item.name}
                    </p>
                    <p className="mt-1 font-body text-sm text-text-muted leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </FadeUpOnScroll>
        </div>
      </CatalogChapter>

      <CatalogChapter
        id="commissions"
        numeral={numeral('commissions')}
        eyebrow="In the Wild"
        title="Commissions"
        intro="A selection of recent sets, each one designed for its car alone."
      >
        {catalog.builds.map((build, i) => (
          <BuildFeature key={build.vehicle} build={build} index={i} />
        ))}
      </CatalogChapter>

      <CatalogChapter
        id="process"
        numeral={numeral('process')}
        eyebrow="From Brief to Delivery"
        title="Process"
        className="bg-bg-elevated"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
          {catalog.process.map((step, i) => (
            <FadeUpOnScroll key={step.title} delay={0.1 * i} className="bg-bg-elevated p-8 md:p-10 h-full">
              <span className="font-serif italic text-5xl text-gold">{toRoman(i + 1)}</span>
              <h3 className="mt-8 font-display text-3xl tracking-wider text-text uppercase">
                {step.title}
              </h3>
              <p className="mt-4 font-body text-sm leading-relaxed text-text-muted">
                {step.description}
              </p>
            </FadeUpOnScroll>
          ))}
        </div>
      </CatalogChapter>

      {/* Closing call to action */}
      <section className="relative overflow-hidden border-t border-border">
        <div className="absolute inset-0">
          <Image
            src="/catalog/cullinan-wheel.jpg"
            alt=""
            fill
            className="object-cover object-[50%_60%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/90 via-bg/80 to-bg/90" />
        </div>
        <FadeUpOnScroll className="relative mx-auto max-w-3xl px-6 py-32 md:py-48 text-center">
          <img src="/catalog/uef-emblem.svg" alt="" className="mx-auto w-16 h-16" />
          <h2 className="mt-10 font-display text-5xl md:text-7xl tracking-widest text-text uppercase">
            {catalog.cta.heading}
          </h2>
          <p className="mt-6 font-serif text-xl md:text-2xl text-text/85">{catalog.cta.body}</p>
          <div className="mt-12">
            <ButtonLink href={catalog.cta.href} variant="primary" className="text-base px-12 py-4">
              {catalog.cta.label}
            </ButtonLink>
          </div>
        </FadeUpOnScroll>
      </section>
    </>
  )
}
