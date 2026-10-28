import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { FadeUpOnScroll } from '@/components/animations/FadeUpOnScroll'
import { OrderForm, type WheelOption } from './OrderForm'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Place an Order',
  description:
    'Order UEForged custom forged wheels. Tell us your vehicle and modifications, and supply your own specs or let us recommend them.',
}

async function getWheelOptions(): Promise<(WheelOption & { slug: string })[]> {
  const payload = await getPayload({ config: await config })
  const result = await payload.find({ collection: 'wheels', limit: 200, depth: 1, sort: 'name' })
  return result.docs.map((w) => ({
    id: w.id,
    name: w.name,
    series: typeof w.series === 'object' && w.series ? w.series.name : '',
    slug: w.slug,
  }))
}

interface PageProps {
  searchParams: Promise<{ wheel?: string }>
}

export default async function OrderPage({ searchParams }: PageProps) {
  const { wheel } = await searchParams
  const wheels = await getWheelOptions()
  const prefill = wheel
    ? wheels.find((w) => w.id === wheel || w.slug === wheel)?.id
    : undefined

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-20 md:py-28">
        <FadeUpOnScroll>
          <p className="font-body text-xs uppercase tracking-[0.4em] text-gold">Commission</p>
          <h1 className="mt-4 font-display text-5xl md:text-7xl tracking-widest text-text uppercase">
            Place an order
          </h1>
          <p className="mt-6 font-serif text-xl md:text-2xl text-text-muted max-w-2xl">
            Tell us about your car and how you want it to sit. Supply your own specs, or let our team
            recommend them. Nothing is charged until you approve your 3D rendering.
          </p>
        </FadeUpOnScroll>
        <div className="mt-16">
          <OrderForm wheels={wheels.map(({ id, name, series }) => ({ id, name, series }))} prefilledWheelId={prefill ?? null} />
        </div>
      </div>
    </div>
  )
}
