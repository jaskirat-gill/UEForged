import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Wheel } from '@/payload-types'
import { getCurrentDealer } from '@/lib/dealerAuth'
import { buildPriceChart } from '@/lib/priceChart'
import { getUsdCadRate, usdToCad } from '@/lib/exchangeRate'
import { ButtonLink } from '@/components/ui/Button'
import { logoutDealer } from './actions'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Dealer Portal',
  robots: { index: false, follow: false },
}

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  reviewing: 'Reviewing fitment',
  rendering: 'Rendering',
  awaiting_deposit: 'Awaiting deposit',
  production: 'In production',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const usd = (n: number) => `$${n.toLocaleString('en-US')}`

export default async function DealerDashboard() {
  const dealer = await getCurrentDealer()
  if (!dealer) redirect('/dealer/login')

  const payload = await getPayload({ config: await config })
  const [pricing, wheels, orders, fx] = await Promise.all([
    payload.findGlobal({ slug: 'wheel-pricing' }),
    payload.find({ collection: 'wheels', limit: 200, depth: 1, sort: 'name' }),
    payload.find({
      collection: 'orders',
      where: { dealer: { equals: dealer.id } },
      sort: '-createdAt',
      limit: 25,
      depth: 1,
    }),
    getUsdCadRate(),
  ])
  const discount = dealer.discountPercent ?? 0
  const chart = buildPriceChart(pricing, wheels.docs, discount)
  const cad = (n: number) => (fx ? `C$${usdToCad(n, fx.rate).toLocaleString('en-US')}` : null)

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-16">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.4em] text-gold">Dealer portal</p>
            <h1 className="mt-3 font-display text-5xl md:text-6xl tracking-widest text-text uppercase">
              {dealer.companyName}
            </h1>
            <p className="mt-3 font-body text-text-muted">
              Signed in as {dealer.username ?? dealer.email}
              {discount > 0 && <> · Dealer pricing: {discount}% off retail</>}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <ButtonLink href="/dealer/order" variant="primary">
              Place a dealer order
            </ButtonLink>
            <form action={logoutDealer}>
              <button type="submit" className="font-body text-sm uppercase tracking-wider text-text-muted hover:text-gold">
                Sign out
              </button>
            </form>
          </div>
        </header>

        <section>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="font-display text-3xl tracking-wider text-text uppercase">Your price chart</h2>
            <p className="font-body text-xs text-text-muted">
              {fx
                ? `1 USD = ${fx.rate.toFixed(4)} CAD (${fx.source}, ${fx.date}). CAD rounded up to the nearest $5.`
                : 'CAD rate unavailable right now; showing USD only.'}
            </p>
          </div>
          {chart.base === null || chart.rows.length === 0 ? (
            <p className="mt-6 font-body text-text-muted">
              Pricing is being finalised. Contact your UEForged representative for a quote.
            </p>
          ) : (
            <>
              <p className="mt-2 font-body text-sm text-text-muted">
                Dealer price per wheel, standard width{discount > 0 ? `, after your ${discount}% discount` : ''}.
                Set of four is 4 × per wheel. Width, finish and options are quoted per order.
              </p>
              <div className="mt-6 overflow-x-auto border border-border">
                <table className="w-full font-body text-sm">
                  <thead className="bg-surface">
                    <tr>
                      <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-wider text-text-muted">
                        Size
                      </th>
                      {chart.columns.map((c) => (
                        <th
                          scope="col"
                          key={c.value}
                          className="text-left px-4 py-3 text-xs uppercase tracking-wider text-text-muted whitespace-nowrap"
                        >
                          {c.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chart.rows.map((row) => (
                      <tr key={row.value} className="border-t border-border">
                        <th scope="row" className="text-left px-4 py-3 font-semibold text-text whitespace-nowrap">
                          {row.label}
                        </th>
                        {row.perWheel.map((p, i) => (
                          <td key={chart.columns[i]!.value} className="px-4 py-3 whitespace-nowrap">
                            <span className="block text-text">{usd(p)} USD</span>
                            {cad(p) && <span className="block text-text-muted">{cad(p)} CAD</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        <section>
          <h2 className="font-display text-3xl tracking-wider text-text uppercase">Your orders</h2>
          {orders.docs.length === 0 ? (
            <p className="mt-6 font-body text-text-muted">
              No orders yet. <Link href="/dealer/order" className="text-gold hover:text-gold-highlight">Place your first order →</Link>
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto border border-border">
              <table className="w-full font-body text-sm">
                <thead className="bg-surface">
                  <tr>
                    {['Order', 'Placed', 'Customer ref', 'Vehicle', 'Design', 'Status'].map((h) => (
                      <th key={h} scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-wider text-text-muted">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.docs.map((o) => (
                    <tr key={o.id} className="border-t border-border">
                      <td className="px-4 py-3 font-semibold text-text whitespace-nowrap">{o.orderNumber}</td>
                      <td className="px-4 py-3 text-text-muted whitespace-nowrap">
                        {new Date(o.createdAt).toLocaleDateString('en-CA')}
                      </td>
                      <td className="px-4 py-3 text-text-muted">{o.customerRef ?? '—'}</td>
                      <td className="px-4 py-3 text-text">{o.vehicleSummary ?? '—'}</td>
                      <td className="px-4 py-3 text-text">
                        {typeof o.wheel === 'object' && o.wheel ? (o.wheel as Wheel).name : 'Custom'}
                      </td>
                      <td className="px-4 py-3 text-gold whitespace-nowrap">{STATUS_LABELS[o.status] ?? o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
