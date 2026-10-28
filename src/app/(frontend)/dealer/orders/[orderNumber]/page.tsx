import React from 'react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Order, Wheel } from '@/payload-types'
import { getCurrentDealer } from '@/lib/dealerAuth'
import { orderStatusLabel } from '@/lib/orderStatus'
import { SUSPENSION_OPTIONS } from '@/lib/orderSchema'
import { OrderProgress } from '@/components/dealer/OrderProgress'
import { OrderPhotos } from '@/components/dealer/OrderPhotos'
import { OrderBilling } from '@/components/dealer/OrderBilling'
import { cn } from '@/lib/utils'
import { CommentForm } from './CommentForm'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Dealer Order',
  robots: { index: false, follow: false },
}

type Row = [label: string, value: string | null | undefined]

function DetailCard({ title, rows }: { title: string; rows: Row[] }) {
  const shown = rows.filter(([, v]) => v && String(v).trim())
  if (shown.length === 0) return null
  return (
    <section className="border border-border bg-surface p-6">
      <h2 className="font-display text-2xl tracking-wider text-text uppercase">{title}</h2>
      <dl className="mt-4 divide-y divide-border">
        {shown.map(([label, value]) => (
          <div key={label} className="grid grid-cols-5 gap-4 py-3">
            <dt className="col-span-2 font-body text-xs uppercase tracking-[0.2em] text-text-muted pt-0.5">{label}</dt>
            <dd className="col-span-3 font-body text-sm text-text whitespace-pre-wrap">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

const spec = (s?: Order['front']) =>
  s ? [s.diameter && `${s.diameter}"`, s.width && `${s.width}J`, s.offset && `ET${s.offset}`].filter(Boolean).join(' × ') : ''

export default async function DealerOrderDetail({ params }: { params: Promise<{ orderNumber: string }> }) {
  const dealer = await getCurrentDealer()
  if (!dealer) redirect('/dealer/login')

  const { orderNumber } = await params
  const payload = await getPayload({ config: await config })
  // Only this dealer's own orders. Internal staff comments are stripped by the Orders afterRead hook.
  const found = await payload.find({
    collection: 'orders',
    where: { and: [{ orderNumber: { equals: decodeURIComponent(orderNumber) } }, { dealer: { equals: dealer.id } }] },
    limit: 1,
    depth: 1,
  })
  const order = found.docs[0]
  if (!order) notFound()

  const wheel = typeof order.wheel === 'object' && order.wheel ? (order.wheel as Wheel) : null
  const m = order.modifications
  const custom = order.specMode === 'custom'
  const comments = [...(order.comments ?? [])].sort(
    (a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime(),
  )

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-12">
        <Link href="/dealer" className="inline-block font-body text-sm uppercase tracking-wider text-text-muted hover:text-gold">
          ← Dealer portal
        </Link>

        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.4em] text-gold">Order</p>
            <h1 className="mt-3 font-display text-5xl md:text-6xl tracking-widest text-text">{order.orderNumber}</h1>
            <p className="mt-3 font-body text-text-muted">
              Placed {new Date(order.createdAt).toLocaleDateString('en-CA', { dateStyle: 'long' })}
              {order.customerRef && <> · Your ref: {order.customerRef}</>}
            </p>
          </div>
          <div className="text-right">
            <p className="font-body text-xs uppercase tracking-[0.3em] text-text-muted">Status</p>
            <p className="mt-1 font-display text-3xl tracking-wider text-gold uppercase">{orderStatusLabel(order.status)}</p>
          </div>
        </header>

        <section className="border border-border bg-surface p-6 md:p-8">
          <OrderProgress status={order.status} />
        </section>

        <OrderBilling order={order} />

        <OrderPhotos photos={order.photos ?? []} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8">
            <DetailCard
              title="Vehicle"
              rows={[
                ['Vehicle', order.vehicleSummary],
                ['Suspension', SUSPENSION_OPTIONS.find((o) => o.value === m?.suspension)?.label],
                ['Big brake kit', m?.bigBrakeKit ? m.brakeDetails || 'Yes' : 'No'],
                ['Widebody', m?.widebody ? 'Yes' : 'No'],
                ['Current tyres', m?.currentTires],
                ['Other mods', m?.other],
              ]}
            />
            <DetailCard
              title="Wheels"
              rows={[
                ['Design', wheel ? wheel.name : 'Custom / undecided'],
                ['Design notes', order.designNotes],
                ['Construction', order.construction || 'UEForged to recommend'],
                ['Finish', order.finish || 'UEForged to recommend'],
                ['Specs', custom ? 'Supplied by you' : 'UEForged to recommend'],
                ['Front', custom ? spec(order.front) : ''],
                ['Rear', custom && order.staggered ? spec(order.rear) : ''],
                ['Bolt pattern', order.boltPattern],
                ['Centre bore', order.centreBore],
                ['Quantity', order.quantity ? String(order.quantity) : ''],
                ['Lip engraving', order.lipEngraving],
                ['Centre caps', order.centreCaps],
              ]}
            />
            <DetailCard
              title="Contact & delivery"
              rows={[
                ['Name', order.name],
                ['Email', order.email],
                ['Phone', order.phone],
                ['Ship to', [order.shipTo?.city, order.shipTo?.region, order.shipTo?.country].filter(Boolean).join(', ')],
                ['Budget', order.budget],
                ['Needed by', order.neededBy],
                ['Notes', order.notes],
              ]}
            />
          </div>

          <section className="lg:col-span-5 border border-border bg-surface p-6 h-fit lg:sticky lg:top-28">
            <h2 className="font-display text-2xl tracking-wider text-text uppercase">Comments</h2>
            {comments.length === 0 ? (
              <p className="mt-4 font-body text-sm text-text-muted">
                No comments yet. Ask a question or send an update and UEForged will reply here.
              </p>
            ) : (
              <ol className="mt-6 space-y-4">
                {comments.map((c) => {
                  const fromUs = c.author !== 'dealer'
                  return (
                    <li
                      key={c.id ?? `${c.createdAt}-${c.message.slice(0, 12)}`}
                      className={cn('border p-4', fromUs ? 'border-gold/40 bg-gold/5 mr-6' : 'border-border bg-bg ml-6')}
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className={cn('font-body text-xs uppercase tracking-wider', fromUs ? 'text-gold' : 'text-text')}>
                          {fromUs ? 'UEForged' : c.authorName || dealer.companyName}
                        </span>
                        {c.createdAt && (
                          <time className="font-body text-[11px] text-text-muted" dateTime={c.createdAt}>
                            {new Date(c.createdAt).toLocaleString('en-CA', { dateStyle: 'medium', timeStyle: 'short' })}
                          </time>
                        )}
                      </div>
                      <p className="mt-2 font-body text-sm text-text whitespace-pre-wrap">{c.message}</p>
                    </li>
                  )
                })}
              </ol>
            )}
            <div className="mt-8 border-t border-border pt-6">
              <CommentForm orderNumber={order.orderNumber ?? ''} />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
