import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import type { Series } from '@/payload-types'
import type { PricingOption } from '@/lib/wheelPricing'
import { getUsdCadRate, usdToCad } from '@/lib/exchangeRate'
import { buildPriceChart } from '@/lib/priceChart'
import { isStaffUser } from '@/access/roles'

const usd = (n: number) => `$${n.toLocaleString('en-US')}`
const signed = (n: number) => (n === 0 ? '—' : `${n > 0 ? '+' : '−'}$${Math.abs(n).toLocaleString('en-US')}`)

function Money({ amount, rate, delta = false }: { amount: number; rate: number | null; delta?: boolean }) {
  if (delta && amount === 0) return <span className="price-chart__money">—</span>
  const cad = rate ? usdToCad(Math.abs(amount), rate) * Math.sign(amount) : null
  return (
    <span className="price-chart__money">
      <span>{delta ? signed(amount) : usd(amount)} <small>USD</small></span>
      {cad !== null && (
        <span className="price-chart__cad">
          {delta ? signed(cad).replace('$', 'C$') : `C${usd(cad)}`} <small>CAD</small>
        </span>
      )}
    </span>
  )
}

function AdderTable({ title, options, rate }: { title: string; options: PricingOption[]; rate: number | null }) {
  return (
    <div className="price-chart__card">
      <h3>{title}</h3>
      {options.length === 0 ? (
        <p className="price-chart__muted">None set.</p>
      ) : (
        <table className="price-chart__table">
          <tbody>
            {options.map((o) => (
              <tr key={o.value}>
                <th scope="row">{o.label}</th>
                <td>
                  <Money amount={o.priceDelta} rate={rate} delta />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export async function PriceChartView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, permissions, locale, visibleEntities } = initPageResult
  if (!req.user) redirect('/admin/login?redirect=/admin/price-chart')
  // Staff only: dealers have their own discounted chart on the dealer portal.
  if (!isStaffUser(req)) redirect('/admin/unauthorized')

  const [pricing, wheels, fx] = await Promise.all([
    req.payload.findGlobal({ slug: 'wheel-pricing', req }),
    req.payload.find({ collection: 'wheels', limit: 200, depth: 1, sort: 'name', req }),
    getUsdCadRate(),
  ])
  const rate = fx?.rate ?? null

  const { base, columns, rows, diameters, widths, constructions, beadlocks } = buildPriceChart(
    pricing,
    wheels.docs,
  )

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      searchParams={searchParams}
      user={req.user ?? undefined}
      visibleEntities={visibleEntities}
    >
      <Gutter>
        <div className="price-chart">
          <header className="price-chart__header">
            <div>
              <h1>Price Chart</h1>
              <p className="price-chart__muted">
                Per-wheel prices built from the live <Link href="/admin/globals/wheel-pricing">Wheel Pricing</Link> rules
                and each design&apos;s starting price. Staff only.
              </p>
            </div>
            <div className="price-chart__fx">
              {fx ? (
                <>
                  <strong>1 USD = {fx.rate.toFixed(4)} CAD</strong>
                  <span>
                    {fx.source}, {fx.date}. CAD prices are rounded up to the nearest $5.
                  </span>
                </>
              ) : (
                <>
                  <strong>CAD unavailable</strong>
                  <span>The Bank of Canada rate couldn&apos;t be loaded. Showing USD only; try again shortly.</span>
                </>
              )}
            </div>
          </header>

          {diameters.length === 0 || base === null ? (
            <div className="price-chart__card">
              <h3>No pricing set yet</h3>
              <p className="price-chart__muted">
                Add size, width, construction and beadlock adjustments in{' '}
                <Link href="/admin/globals/wheel-pricing">Wheel Pricing</Link>, and a starting price on each design in{' '}
                <Link href="/admin/collections/wheels">Wheels</Link>. This chart fills in automatically.
              </p>
            </div>
          ) : (
            <section className="price-chart__card">
              <h3>By size and construction</h3>
              <p className="price-chart__muted">
                From the lowest starting price ({usd(base)} USD per wheel), standard width. Add width and finish
                adjustments below. Set of four = 4 × per wheel.
              </p>
              <div className="price-chart__scroll">
                <table className="price-chart__table price-chart__matrix">
                  <thead>
                    <tr>
                      <th scope="col">Size</th>
                      {columns.map((c) => (
                        <th scope="col" key={c.value}>
                          {c.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.value}>
                        <th scope="row">{row.label}</th>
                        {row.perWheel.map((perWheel, i) => (
                          <td key={columns[i]!.value}>
                            <Money amount={perWheel} rate={rate} />
                            <span className="price-chart__set">Set {usd(perWheel * 4)}</span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <div className="price-chart__grid">
            <AdderTable title="Size adjustments" options={diameters} rate={rate} />
            <AdderTable title="Width adjustments" options={widths} rate={rate} />
            <AdderTable title="Construction" options={constructions} rate={rate} />
            <AdderTable title="Beadlock" options={beadlocks} rate={rate} />
          </div>

          <section className="price-chart__card">
            <h3>Starting price by design</h3>
            <table className="price-chart__table">
              <thead>
                <tr>
                  <th scope="col">Design</th>
                  <th scope="col">Series</th>
                  <th scope="col">From, per wheel</th>
                </tr>
              </thead>
              <tbody>
                {wheels.docs.map((w) => (
                  <tr key={w.id}>
                    <th scope="row">
                      <Link href={`/admin/collections/wheels/${w.id}`}>{w.name}</Link>
                    </th>
                    <td>{typeof w.series === 'object' && w.series ? (w.series as Series).name : '—'}</td>
                    <td>
                      {typeof w.startingPricePerWheel === 'number' ? (
                        <Money amount={w.startingPricePerWheel} rate={rate} />
                      ) : (
                        <span className="price-chart__muted">Not set</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}
