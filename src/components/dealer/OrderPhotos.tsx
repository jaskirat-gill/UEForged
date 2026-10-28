import React from 'react'
import type { Order, OrderMedia } from '@/payload-types'
import { ORDER_PHOTO_STAGES } from '@/lib/orderStatus'

type Photo = NonNullable<Order['photos']>[number]

/**
 * Order photos grouped by stage. Uses plain <img> (not next/image) so the browser sends the
 * dealer's login cookie: these files are private and Payload checks access on every request.
 */
export function OrderPhotos({ photos }: { photos: Photo[] }) {
  const withFiles = photos.filter((p) => typeof p.image === 'object' && p.image?.url)
  if (withFiles.length === 0) return null

  return (
    <section className="border border-border bg-surface p-6 md:p-8">
      <h2 className="font-display text-2xl tracking-wider text-text uppercase">Photos</h2>
      <div className="mt-6 space-y-10">
        {ORDER_PHOTO_STAGES.map((stage) => {
          const group = withFiles.filter((p) => p.stage === stage.value)
          if (group.length === 0) return null
          return (
            <div key={stage.value}>
              <p className="font-body text-xs uppercase tracking-[0.3em] text-gold">{stage.label}</p>
              <ul className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {group.map((p) => {
                  const img = p.image as OrderMedia
                  return (
                    <li key={p.id ?? img.id}>
                      <a href={img.url!} target="_blank" rel="noopener" className="group block">
                        <div className="aspect-[4/3] overflow-hidden bg-bg border border-border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.url!}
                            alt={p.caption || img.alt || `${stage.label} photo`}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        {(p.caption || p.addedAt) && (
                          <p className="mt-2 font-body text-xs text-text-muted">
                            {p.caption}
                            {p.caption && p.addedAt && ' · '}
                            {p.addedAt && new Date(p.addedAt).toLocaleDateString('en-CA', { dateStyle: 'medium' })}
                          </p>
                        )}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
