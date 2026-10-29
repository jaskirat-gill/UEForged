import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Wheel } from '@/payload-types'
import { getCurrentDealer } from '@/lib/dealerAuth'
import { orderStatusLabel } from '@/lib/orderStatus'
import { formatMoney } from '@/lib/orderBilling'
import { DealerHeader } from '@/components/dealer/DealerHeader'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Dealer Portal',
  robots: { index: false, follow: false },
}

export default async function DealerDashboard() {
  const dealer = await getCurrentDealer()
  if (!dealer) redirect('/dealer/login')

  const payload = await getPayload({ config: await config })
  const orders = await payload.find({
    collection: 'orders',
    where: { dealer: { equals: dealer.id } },
    sort: '-createdAt',
    limit: 50,
    depth: 1,
  })

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-10">
        <DealerHeader dealer={dealer} active="orders" />

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
                    {['Order', 'Placed', 'Customer ref', 'Vehicle', 'Design', 'Status', 'Balance', ''].map((h) => (
                      <th key={h} scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-wider text-text-muted">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.docs.map((o) => (
                    <tr key={o.id} className="border-t border-border hover:bg-surface transition-colors">
                      <td className="px-4 py-3 font-semibold whitespace-nowrap">
                        <Link href={`/dealer/orders/${o.orderNumber}`} className="text-text hover:text-gold">
                          {o.orderNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-text-muted whitespace-nowrap">
                        {new Date(o.createdAt).toLocaleDateString('en-CA')}
                      </td>
                      <td className="px-4 py-3 text-text-muted">{o.customerRef ?? '—'}</td>
                      <td className="px-4 py-3 text-text">{o.vehicleSummary ?? '—'}</td>
                      <td className="px-4 py-3 text-text">
                        {typeof o.wheel === 'object' && o.wheel ? (o.wheel as Wheel).name : 'Custom'}
                      </td>
                      <td className="px-4 py-3 text-gold whitespace-nowrap">{orderStatusLabel(o.status)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-text">
                        {o.billing?.total ? formatMoney(o.billing.balanceDue, o.billing.currency) : <span className="text-text-muted">Quote pending</span>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <Link
                          href={`/dealer/orders/${o.orderNumber}`}
                          className="font-body text-xs uppercase tracking-wider text-gold hover:text-gold-highlight"
                        >
                          View details →
                        </Link>
                      </td>
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
