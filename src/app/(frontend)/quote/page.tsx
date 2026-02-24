import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { QuoteForm } from './QuoteForm'
import { FadeUpOnScroll } from '@/components/animations/FadeUpOnScroll'

export const dynamic = 'force-dynamic'

async function getWheelsForSelect() {
  const payload = await getPayload({ config: await config })
  const result = await payload.find({
    collection: 'wheels',
    limit: 100,
    depth: 0,
  })
  return result.docs.map((w) => ({ id: w.id, name: w.name }))
}

interface PageProps {
  searchParams: Promise<{ wheel?: string }>
}

export const metadata = {
  title: 'Get a Quote',
  description: 'Request a quote for UEForged custom forged wheels.',
}

export default async function QuotePage({ searchParams }: PageProps) {
  const { wheel: wheelPrefill } = await searchParams
  const wheels = await getWheelsForSelect()

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <FadeUpOnScroll>
          <h1 className="font-display text-5xl md:text-6xl tracking-widest text-text">
            GET A QUOTE
          </h1>
          <p className="font-serif text-xl text-gold mt-4">
            Tell us about your build. We&apos;ll get back to you with pricing and availability.
          </p>
        </FadeUpOnScroll>
        <div className="mt-16">
          <QuoteForm wheels={wheels} prefilledWheel={wheelPrefill ?? null} />
        </div>
      </div>
    </div>
  )
}
