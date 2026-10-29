import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getCurrentDealer } from '@/lib/dealerAuth'
import { OrderForm } from '../../order/OrderForm'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Dealer Order',
  robots: { index: false, follow: false },
}

interface PageProps {
  searchParams: Promise<{ wheel?: string }>
}

export default async function DealerOrderPage({ searchParams }: PageProps) {
  const dealer = await getCurrentDealer()
  if (!dealer) redirect('/dealer/login')

  const { wheel } = await searchParams
  const payload = await getPayload({ config: await config })
  const result = await payload.find({ collection: 'wheels', limit: 200, depth: 1, sort: 'name' })
  const wheels = result.docs.map((w) => ({
    id: w.id,
    name: w.name,
    series: typeof w.series === 'object' && w.series ? w.series.name : '',
    slug: w.slug,
  }))
  const prefill = wheel ? wheels.find((w) => w.id === wheel || w.slug === wheel)?.id : undefined

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <Link href="/dealer" className="font-body text-sm uppercase tracking-wider text-text-muted hover:text-gold">
          ← Dealer portal
        </Link>
        <p className="mt-10 font-body text-xs uppercase tracking-[0.4em] text-gold">Dealer order</p>
        <h1 className="mt-4 font-display text-5xl md:text-7xl tracking-widest text-text uppercase">Place an order</h1>
        <p className="mt-6 font-serif text-xl text-text-muted max-w-2xl">
          Orders placed here are linked to {dealer.companyName} and priced with your dealer concession. Track their status
          on your dealer portal.
        </p>
        <div className="mt-16">
          <OrderForm
            wheels={wheels.map(({ id, name, series }) => ({ id, name, series }))}
            prefilledWheelId={prefill ?? null}
            dealer={{
              companyName: dealer.companyName,
              contactName: dealer.contactName,
              email: dealer.email,
              phone: dealer.phone,
            }}
          />
        </div>
      </div>
    </div>
  )
}
