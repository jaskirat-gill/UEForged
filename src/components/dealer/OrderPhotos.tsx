import React from 'react'
import type { Order, OrderMedia } from '@/payload-types'
import { ORDER_PHOTO_STAGES } from '@/lib/orderStatus'

type Photo = NonNullable<Order['photos']>[number]

const stageOrder = (stage?: string | null) => {
  const i = ORDER_PHOTO_STAGES.findIndex((s) => s.value === stage)
  return i === -1 ? ORDER_PHOTO_STAGES.length : i
}

/**
 * Order photos in one row across the page, ordered by stage (rendering → production → finished)
 * and then by date, each tagged with its stage. Scrolls sideways when there are more than fit.
 * Uses plain <img> (not next/image) so the browser sends the dealer's login cookie: these files
 * are private and Payload checks access on every request.
 */
export function OrderPhotos({ photos }: { photos: Photo[] }) {
  const withFiles = photos
    .filter((p) => typeof p.image === 'object' && p.image?.url)
    .sort(
      (a, b) =>
        stageOrder(a.stage) - stageOrder(b.stage) ||
        new Date(a.addedAt ?? 0).getTime() - new Date(b.addedAt ?? 0).getTime(),
    )
  if (withFiles.length === 0) return null

  return (
    <section className="border border-border bg-surface p-5">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-xl tracking-wider text-text uppercase">Photos</h2>
        <span className="font-body text-xs text-text-muted">
          {withFiles.length} photo{withFiles.length === 1 ? '' : 's'} · click to enlarge
        </span>
      </div>
      <ul className="mt-4 flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2" aria-label="Order photos">
        {withFiles.map((p) => {
          const img = p.image as OrderMedia
          const stage = ORDER_PHOTO_STAGES.find((s) => s.value === p.stage)?.label ?? 'Photo'
          return (
            <li key={p.id ?? img.id} className="w-56 shrink-0 snap-start">
              <a href={img.url!} target="_blank" rel="noopener" className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-bg border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url!}
                    alt={p.caption || img.alt || `${stage} photo`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-2 top-2 bg-bg/80 px-2 py-0.5 font-body text-[10px] uppercase tracking-[0.2em] text-gold">
                    {stage}
                  </span>
                </div>
                <p className="mt-1.5 font-body text-xs text-text-muted truncate">
                  {p.caption}
                  {p.caption && p.addedAt && ' · '}
                  {p.addedAt && new Date(p.addedAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                </p>
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
