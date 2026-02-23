'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Build, Media, Wheel } from '@/payload-types'

interface BuildDetailClientProps {
  build: Build
}

function getWheelName(wheel: string | Wheel | null | undefined): string {
  if (!wheel) return ''
  return typeof wheel === 'object' && wheel.name ? wheel.name : ''
}

function getImageUrl(item: { image: string | Media }): string | null {
  const img = item.image
  return typeof img === 'object' && img?.url ? img.url : null
}

export function BuildDetailClient({ build }: BuildDetailClientProps) {
  const [galleryIndex, setGalleryIndex] = useState(0)
  const images = build.images ?? []
  const currentImage = images[galleryIndex]
  const imageUrl = currentImage ? getImageUrl(currentImage) : null
  const wheelName = getWheelName(build.wheelUsed ?? undefined)

  return (
    <div className="max-w-5xl mx-auto px-6 pb-24">
      <Link
        href="/builds"
        className="inline-flex items-center gap-2 font-body text-sm text-text-muted hover:text-gold mb-8 transition-colors"
      >
        ← Back to builds
      </Link>

      <div className="space-y-8">
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-surface border border-border">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={build.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
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
              const url = getImageUrl(item)
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setGalleryIndex(i)}
                  className={`relative w-24 h-24 flex-shrink-0 rounded overflow-hidden border-2 transition-colors ${
                    i === galleryIndex ? 'border-gold' : 'border-border'
                  }`}
                >
                  {url ? (
                    <Image src={url} alt="" fill className="object-cover" sizes="96px" />
                  ) : (
                    <div className="w-full h-full bg-surface-elevated" />
                  )}
                </button>
              )
            })}
          </div>
        )}

        <div className="border-t border-border pt-8">
          <h1 className="font-display text-4xl md:text-5xl tracking-widest text-text">
            {build.carMake} {build.carModel} ({build.year})
          </h1>
          {build.title && build.title !== `${build.carMake} ${build.carModel}` && (
            <p className="font-body text-text-muted mt-2">{build.title}</p>
          )}
          {wheelName && (
            <p className="font-body text-gold text-lg mt-4">Wheels: {wheelName}</p>
          )}
          {build.finish && (
            <p className="font-body text-text-muted mt-1">Finish: {build.finish}</p>
          )}
          {build.photographerCredit && (
            <p className="font-body text-text-muted text-sm mt-4">
              Photo: {build.photographerCredit}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
