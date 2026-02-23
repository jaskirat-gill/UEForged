'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { Wheel, Media, Series, Finish } from '@/payload-types'

interface WheelDetailClientProps {
  wheel: Wheel
}

function getSeriesName(series: string | Series): string {
  return typeof series === 'object' && series?.name ? series.name : ''
}

function getFinishName(finish: string | Finish): string {
  return typeof finish === 'object' && finish?.name ? finish.name : ''
}

export function WheelDetailClient({ wheel }: WheelDetailClientProps) {
  const [galleryIndex, setGalleryIndex] = useState(0)
  const images = wheel.images ?? []
  const currentImage = images[galleryIndex]?.image
  const imageUrl =
    currentImage && typeof currentImage === 'object' && currentImage.url
      ? currentImage.url
      : images[0] && typeof images[0].image === 'object' && images[0].image?.url
        ? images[0].image.url
        : null

  const sizes = wheel.specs?.sizes?.map((s) => s.size) ?? []
  const offsets = wheel.specs?.offsets?.map((o) => o.offset) ?? []
  const finishesAvailable = wheel.specs?.finishesAvailable ?? []

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24">
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-surface border border-border">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={wheel.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-text-muted font-body">
                No image
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((item, i) => {
                const img = item.image
                const url = typeof img === 'object' && img?.url ? img.url : null
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setGalleryIndex(i)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded overflow-hidden border-2 transition-colors ${
                      i === galleryIndex ? 'border-gold' : 'border-border'
                    }`}
                  >
                    {url ? (
                      <Image src={url} alt="" fill className="object-cover" sizes="80px" />
                    ) : (
                      <div className="w-full h-full bg-surface-elevated" />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-32 h-fit">
          <span className="font-body text-xs uppercase tracking-wider text-gold">
            {getSeriesName(wheel.series)}
          </span>
          <h1 className="font-display text-4xl md:text-5xl tracking-widest text-text mt-2">
            {wheel.name}
          </h1>
          {wheel.description && (
            <p className="font-body text-text-muted mt-6 leading-relaxed">
              {wheel.description}
            </p>
          )}

          {(sizes.length > 0 || offsets.length > 0 || finishesAvailable.length > 0) && (
            <div className="mt-8 border border-border rounded-lg overflow-hidden">
              <table className="w-full font-body text-sm">
                <tbody>
                  {sizes.length > 0 && (
                    <tr className="border-b border-border">
                      <td className="px-4 py-3 text-text-muted">Sizes</td>
                      <td className="px-4 py-3 text-text">{sizes.join(', ')}</td>
                    </tr>
                  )}
                  {offsets.length > 0 && (
                    <tr className="border-b border-border">
                      <td className="px-4 py-3 text-text-muted">Offsets</td>
                      <td className="px-4 py-3 text-text">{offsets.join(', ')}</td>
                    </tr>
                  )}
                  {finishesAvailable.length > 0 && (
                    <tr>
                      <td className="px-4 py-3 text-text-muted">Finishes</td>
                      <td className="px-4 py-3 text-text">
                        {finishesAvailable.map(getFinishName).join(', ')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <Link
            href={`/quote?wheel=${encodeURIComponent(wheel.id)}`}
            className="mt-8 inline-flex items-center justify-center px-8 py-3 border border-gold text-gold font-display text-sm uppercase tracking-widest hover:bg-gold hover:text-bg transition-colors"
          >
            Request This Wheel
          </Link>
        </div>
      </div>
    </div>
  )
}
