import React from 'react'
import type { Order } from '@/payload-types'
import { formatMoney, paymentStatusLabel } from '@/lib/orderBilling'
import { cn } from '@/lib/utils'

/** Quote, payments and balance for one order, as shown to the dealer. Internal costs are never included. */
export function OrderBilling({ order }: { order: Order }) {
  const b = order.billing
  const cur = b?.currency ?? 'USD'
  const money = (n?: number | null) => formatMoney(n ?? 0, cur)
  const items = b?.lineItems ?? []

  if (items.length === 0) {
    return (
      <section className="border border-border bg-surface p-6 md:p-8">
        <h2 className="font-display text-2xl tracking-wider text-text uppercase">Pricing & payments</h2>
        <p className="mt-4 font-body text-sm text-text-muted">
          Your quote is being prepared. Pricing will appear here once fitment and the rendering are confirmed.
        </p>
      </section>
    )
  }

  const balance = b?.balanceDue ?? 0
  const status = order.paymentStatus ?? 'unpaid'

  return (
    <section className="border border-border bg-surface p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="font-display text-2xl tracking-wider text-text uppercase">Pricing & payments</h2>
        <span
          className={cn(
            'font-body text-xs uppercase tracking-[0.2em] border px-3 py-1',
            status === 'paid' ? 'border-green-500/50 text-green-400' : 'border-gold/50 text-gold',
          )}
        >
          {paymentStatusLabel(status)}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 overflow-x-auto">
          <table className="w-full font-body text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-text-muted">
                <th scope="col" className="pb-3 pr-4">Item</th>
                <th scope="col" className="pb-3 pr-4 text-right">Qty</th>
                <th scope="col" className="pb-3 pr-4 text-right">Unit</th>
                <th scope="col" className="pb-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((li, i) => (
                <tr key={li.id ?? i} className="border-t border-border">
                  <td className="py-3 pr-4 text-text">{li.description}</td>
                  <td className="py-3 pr-4 text-right text-text-muted">{li.quantity ?? 1}</td>
                  <td className="py-3 pr-4 text-right text-text-muted whitespace-nowrap">{money(li.unitPrice)}</td>
                  <td className="py-3 text-right text-text whitespace-nowrap">{money(li.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {(b?.payments?.length ?? 0) > 0 && (
            <>
              <h3 className="mt-10 font-body text-xs uppercase tracking-[0.3em] text-gold">Payments received</h3>
              <ul className="mt-3 divide-y divide-border border-t border-b border-border">
                {b!.payments!.map((p, i) => (
                  <li key={p.id ?? i} className="flex flex-wrap justify-between gap-2 py-3 font-body text-sm">
                    <span className="text-text-muted">
                      {/* Payment dates are calendar days, stored at UTC midnight */}
                      {new Date(p.date).toLocaleDateString('en-CA', { dateStyle: 'medium', timeZone: 'UTC' })}
                      {p.method && ` · ${p.method}`}
                      {p.reference && ` · ${p.reference}`}
                    </span>
                    <span className="text-text whitespace-nowrap">{money(p.amount)}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <dl className="lg:col-span-5 font-body text-sm border border-border bg-bg p-5 h-fit">
          {(
            [
              ['Subtotal', b?.subtotal],
              b?.discount ? ['Discount', -(b.discount)] : null,
              b?.shipping ? ['Shipping', b.shipping] : null,
              b?.taxAmount ? [`Tax (${b?.taxRate ?? 0}%)`, b.taxAmount] : null,
            ].filter(Boolean) as [string, number][]
          ).map(([label, value]) => (
            <div key={label} className="flex justify-between py-1.5 text-text-muted">
              <dt>{label}</dt>
              <dd className="whitespace-nowrap">{money(value)}</dd>
            </div>
          ))}
          <div className="flex justify-between border-t border-border mt-2 pt-3 text-text font-semibold">
            <dt>Total</dt>
            <dd className="whitespace-nowrap">{money(b?.total)}</dd>
          </div>
          {b?.depositRequired ? (
            <div className="flex justify-between py-1.5 text-text-muted">
              <dt>Deposit required</dt>
              <dd className="whitespace-nowrap">{money(b.depositRequired)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between py-1.5 text-text-muted">
            <dt>Paid</dt>
            <dd className="whitespace-nowrap">{money(b?.amountPaid)}</dd>
          </div>
          <div className="flex justify-between border-t border-border mt-2 pt-3">
            <dt className="font-display text-xl tracking-wider uppercase text-text">Balance due</dt>
            <dd className={cn('font-display text-xl tracking-wider whitespace-nowrap', balance > 0 ? 'text-gold' : 'text-green-400')}>
              {money(balance)}
            </dd>
          </div>
          {b?.paymentInstructions && (
            <p className="mt-4 border-t border-border pt-4 text-xs text-text-muted whitespace-pre-wrap">
              {b.paymentInstructions}
            </p>
          )}
        </dl>
      </div>
    </section>
  )
}
