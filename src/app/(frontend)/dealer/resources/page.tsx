import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Media, Series } from '@/payload-types'
import { getCurrentDealer } from '@/lib/dealerAuth'
import { applyDiscount, buildPriceChart } from '@/lib/priceChart'
import { getUsdCadRate, usdToCad } from '@/lib/exchangeRate'
import type { PricingOption } from '@/lib/wheelPricing'
import { catalog } from '@/data/catalog'
import { DealerHeader } from '@/components/dealer/DealerHeader'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Dealer Resources',
  robots: { index: false, follow: false },
}

const SECTIONS = [
  { id: 'price-chart', label: 'Price chart' },
  { id: 'adjustments', label: 'Adjustments' },
  { id: 'designs', label: 'Designs' },
  { id: 'finishes', label: 'Finishes' },
  { id: 'construction', label: 'Construction' },
  { id: 'custom', label: 'Custom options' },
  { id: 'specs', label: 'Specs & lead times' },
]

function Section({ id, title, intro, children }: { id: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="font-display text-3xl tracking-wider text-text uppercase">{title}</h2>
      {intro && <p className="mt-2 font-body text-sm text-text-muted max-w-3xl">{intro}</p>}
      <div className="mt-6">{children}</div>
    </section>
  )
}

export default async function DealerResources() {
  const dealer = await getCurrentDealer()
  if (!dealer) redirect('/dealer/login')

  const payload = await getPayload({ config: await config })
  const [pricing, wheels, fx] = await Promise.all([
    payload.findGlobal({ slug: 'wheel-pricing' }),
    payload.find({ collection: 'wheels', limit: 200, depth: 2, sort: 'name' }),
    getUsdCadRate(),
  ])
  const discount = dealer.discountPercent ?? 0
  const chart = buildPriceChart(pricing, wheels.docs, discount)

  const usd = (n: number) => `${n < 0 ? '−' : ''}$${Math.abs(n).toLocaleString('en-US')}`
  const cad = (n: number) => (fx ? `${n < 0 ? '−' : ''}C$${usdToCad(Math.abs(n), fx.rate).toLocaleString('en-US')}` : null)
  const Price = ({ amount, delta = false }: { amount: number; delta?: boolean }) =>
    delta && amount === 0 ? (
      <span className="text-text-muted">Included</span>
    ) : (
      <>
        <span className="block text-text">
          {delta && amount > 0 ? '+' : ''}
          {usd(amount)} USD
        </span>
        {cad(amount) && (
          <span className="block text-text-muted">
            {delta && amount > 0 ? '+' : ''}
            {cad(amount)} CAD
          </span>
        )}
      </>
    )

  const adjustmentGroups: { title: string; options: PricingOption[] }[] = [
    { title: 'Size', options: chart.diameters },
    { title: 'Width', options: chart.widths },
    { title: 'Construction', options: chart.constructions },
    { title: 'Beadlock', options: chart.beadlocks },
  ].filter((g) => g.options.length > 0)

  const seriesNames = Array.from(
    new Set(wheels.docs.map((w) => (typeof w.series === 'object' && w.series ? (w.series as Series).name : 'Other'))),
  )

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-10">
        <DealerHeader dealer={dealer} active="resources" />

        <nav aria-label="On this page" className="flex flex-wrap gap-x-6 gap-y-2">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="font-body text-xs uppercase tracking-[0.2em] text-text-muted hover:text-gold">
              {s.label}
            </a>
          ))}
        </nav>
        <p className="font-body text-xs text-text-muted">
          {discount > 0 ? `All prices reflect your ${discount}% dealer concession off retail list price. ` : ''}
          {fx
            ? `1 USD = ${fx.rate.toFixed(4)} CAD (${fx.source}, ${fx.date}); CAD rounded up to the nearest $5.`
            : 'CAD rate unavailable right now; showing USD only.'}
        </p>

        <div className="space-y-16">
          <Section
            id="price-chart"
            title="Price chart"
            intro="Per wheel at standard width. A set of four is 4 × per wheel. Add the adjustments below for width and options."
          >
            {chart.base === null || chart.rows.length === 0 ? (
              <p className="font-body text-text-muted">Pricing is being finalised. Contact your UEForged representative for a quote.</p>
            ) : (
              <div className="overflow-x-auto border border-border">
                <table className="w-full font-body text-sm">
                  <thead className="bg-surface">
                    <tr>
                      <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-wider text-text-muted">Size</th>
                      {chart.columns.map((c) => (
                        <th key={c.value} scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-wider text-text-muted whitespace-nowrap">
                          {c.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chart.rows.map((row) => (
                      <tr key={row.value} className="border-t border-border">
                        <th scope="row" className="text-left px-4 py-3 font-semibold text-text whitespace-nowrap">{row.label}</th>
                        {row.perWheel.map((p, i) => (
                          <td key={chart.columns[i]!.value} className="px-4 py-3 whitespace-nowrap">
                            <Price amount={p} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          {adjustmentGroups.length > 0 && (
            <Section id="adjustments" title="Adjustments" intro="Added to or taken off the per-wheel price.">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {adjustmentGroups.map((g) => (
                  <div key={g.title} className="border border-border bg-surface p-5">
                    <h3 className="font-display text-xl tracking-wider text-text uppercase">{g.title}</h3>
                    <dl className="mt-3 divide-y divide-border font-body text-sm">
                      {g.options.map((o) => (
                        <div key={o.value} className="flex justify-between gap-4 py-2">
                          <dt className="text-text">{o.label}</dt>
                          <dd className="text-right whitespace-nowrap">
                            <Price amount={applyDiscount(o.priceDelta, discount)} delta />
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </Section>
          )}

          <Section id="designs" title="Designs" intro="Every design can be made in your customer's size, fitment and finish.">
            <div className="space-y-8">
              {seriesNames.map((series) => (
                <div key={series}>
                  <p className="font-body text-xs uppercase tracking-[0.3em] text-gold">{series}</p>
                  <ul className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {wheels.docs
                      .filter((w) => (typeof w.series === 'object' && w.series ? (w.series as Series).name : 'Other') === series)
                      .map((w) => {
                        const img = w.images?.[0]?.image
                        const url = typeof img === 'object' && img ? (img as Media).url : null
                        return (
                          <li key={w.id} className="border border-border bg-surface">
                            <div className="aspect-square bg-bg overflow-hidden">
                              {url && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={url} alt={w.name} loading="lazy" className="h-full w-full object-cover" />
                              )}
                            </div>
                            <div className="p-3">
                              <p className="font-display text-lg tracking-wider text-text">{w.name}</p>
                              {typeof w.startingPricePerWheel === 'number' && (
                                <p className="font-body text-xs text-text-muted">
                                  From {usd(applyDiscount(w.startingPricePerWheel, discount))} / wheel
                                </p>
                              )}
                              <Link
                                href={`/dealer/order?wheel=${w.slug}`}
                                className="mt-2 inline-block font-body text-[11px] uppercase tracking-wider text-gold hover:text-gold-highlight"
                              >
                                Order →
                              </Link>
                            </div>
                          </li>
                        )
                      })}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section id="finishes" title="Finishes" intro="Finishes can be mixed across face, barrel and ring.">
            <ul className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6">
              {catalog.finishes.map((f) => (
                <li key={f.name} className="text-center">
                  <div className="relative mx-auto h-20 w-20 rounded-full border border-border p-1">
                    <div className="h-full w-full rounded-full" style={{ background: f.swatch }} />
                    <div className="absolute inset-[38%] rounded-full bg-bg border border-border" />
                  </div>
                  <p className="mt-3 font-display text-base tracking-wider text-text uppercase">{f.name}</p>
                  <p className="mt-1 font-body text-xs text-text-muted">{f.description}</p>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="construction" title="Construction">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {catalog.constructions.map((c) => (
                <div key={c.name} className="border border-border bg-surface p-5">
                  <h3 className="font-display text-xl tracking-wider text-text uppercase">{c.name}</h3>
                  <p className="mt-2 font-body text-sm text-text-muted">{c.description}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="custom" title="Custom options" intro="Ask for any of these in the order notes, or on the order form.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {catalog.personalisation.map((p) => (
                <div key={p.name} className="flex gap-4 border border-border bg-surface p-5">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rotate-45 bg-gold" />
                  <div>
                    <h3 className="font-body text-sm uppercase tracking-wider text-text">{p.name}</h3>
                    <p className="mt-1 font-body text-sm text-text-muted">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="specs" title="Specs & lead times">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <dl className="border-t border-border">
                {catalog.specSheet.map((row) => (
                  <div key={row.label} className="grid grid-cols-5 gap-4 py-3 border-b border-border">
                    <dt className="col-span-2 font-body text-xs uppercase tracking-[0.2em] text-gold pt-0.5">{row.label}</dt>
                    <dd className="col-span-3 font-body text-sm text-text">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <ol className="space-y-4">
                {catalog.process.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="font-serif italic text-2xl text-gold w-8 shrink-0">{i + 1}</span>
                    <div>
                      <p className="font-display text-lg tracking-wider text-text uppercase">{step.title}</p>
                      <p className="font-body text-sm text-text-muted">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}
