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

/** [label, value, wide] — wide rows span both columns (long text such as notes). */
type Row = [label: string, value: string | null | undefined, wide?: boolean]

/** Compact two-column card: small label above each value. */
function DetailCard({ title, rows }: { title: string; rows: Row[] }) {
  const shown = rows.filter(([, v]) => v && String(v).trim())
  if (shown.length === 0) return null
  return (
    <section className="border border-border bg-surface p-5">
      <h2 className="font-display text-xl tracking-wider text-text uppercase">{title}</h2>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
        {shown.map(([label, value, wide]) => (
          <div key={label} className={cn('min-w-0', wide && 'col-span-2')}>
            <dt className="font-body text-[10px] uppercase tracking-[0.2em] text-text-muted">{label}</dt>
            <dd className="mt-0.5 font-body text-sm text-text whitespace-pre-wrap break-words">{value}</dd>
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
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-8">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <DetailCard
            title="Vehicle"
            rows={[
              ['Vehicle', order.vehicleSummary, true],
              ['Suspension', SUSPENSION_OPTIONS.find((o) => o.value === m?.suspension)?.label],
              ['Widebody', m?.widebody ? 'Yes' : 'No'],
              ['Big brake kit', m?.bigBrakeKit ? m.brakeDetails || 'Yes' : 'No', Boolean(m?.brakeDetails)],
              ['Current tyres', m?.currentTires, true],
              ['Other mods', m?.other, true],
            ]}
          />
          <DetailCard
            title="Wheels"
            rows={[
              ['Design', wheel ? wheel.name : 'Custom / undecided'],
              ['Quantity', order.quantity ? String(order.quantity) : ''],
              ['Construction', order.construction || 'We recommend'],
              ['Finish', order.finish || 'We recommend'],
              ['Specs', custom ? 'Supplied by you' : 'UEForged to recommend', !custom],
              ['Front', custom ? spec(order.front) : ''],
              ['Rear', custom && order.staggered ? spec(order.rear) : ''],
              ['Bolt pattern', order.boltPattern],
              ['Centre bore', order.centreBore],
              ['Lip engraving', order.lipEngraving],
              ['Centre caps', order.centreCaps],
              ['Design notes', order.designNotes, true],
            ]}
          />
          <DetailCard
            title="Contact & delivery"
            rows={[
              ['Name', order.name],
              ['Phone', order.phone],
              ['Email', order.email, true],
              ['Ship to', [order.shipTo?.city, order.shipTo?.region, order.shipTo?.country].filter(Boolean).join(', '), true],
              ['Budget', order.budget],
              ['Needed by', order.neededBy],
              ['Notes', order.notes, true],
            ]}
          />
        </div>

        <OrderPhotos photos={order.photos ?? []} />

        <OrderBilling order={order} />

        <section className="border border-border bg-surface p-6">
          <h2 className="font-display text-2xl tracking-wider text-text uppercase">Comments</h2>
          {comments.length === 0 ? (
            <p className="mt-4 font-body text-sm text-text-muted">
              No comments yet. Ask a question or send an update and UEForged will reply here.
            </p>
          ) : (
            <ol className="mt-6 space-y-4 max-w-3xl">
              {comments.map((c) => {
                const fromUs = c.author !== 'dealer'
                return (
                  <li
                    key={c.id ?? `${c.createdAt}-${c.message.slice(0, 12)}`}
                    className={cn('border p-4', fromUs ? 'border-gold/40 bg-gold/5 mr-8' : 'border-border bg-bg ml-8')}
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
          <div className="mt-8 border-t border-border pt-6 max-w-3xl">
            <CommentForm orderNumber={order.orderNumber ?? ''} />
          </div>
        </section>
      </div>
    </div>
  )
}
