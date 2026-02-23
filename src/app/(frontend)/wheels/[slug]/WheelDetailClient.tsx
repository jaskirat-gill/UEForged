'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { Wheel, Series, Finish, WheelPricing } from '@/payload-types'
import { mergeWheelPricing, computePerWheelPrices } from '@/lib/wheelPricing'
import { WheelInquiryForm } from './WheelInquiryForm'

interface WheelDetailClientProps {
  wheel: Wheel
  pricing: WheelPricing | null
}

function getSeriesName(series: string | Series): string {
  return typeof series === 'object' && series?.name ? series.name : ''
}

function getFinishName(finish: string | Finish): string {
  return typeof finish === 'object' && finish?.name ? finish.name : ''
}

export function WheelDetailClient({ wheel, pricing }: WheelDetailClientProps) {
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [panelOpen, setPanelOpen] = useState(false)
  const [frontDiameter, setFrontDiameter] = useState<string | undefined>()
  const [frontWidth, setFrontWidth] = useState<string | undefined>()
  const [rearDiameter, setRearDiameter] = useState<string | undefined>()
  const [rearWidth, setRearWidth] = useState<string | undefined>()
  const [construction, setConstruction] = useState<string | undefined>()
  const [beadlock, setBeadlock] = useState<string | undefined>()

  const images = wheel.images ?? []
  const currentImage = images[galleryIndex]?.image
  const imageUrl =
    currentImage && typeof currentImage === 'object' && currentImage.url
      ? currentImage.url
      : images[0] && typeof images[0].image === 'object' && images[0].image?.url
        ? images[0].image.url
        : null

  const basePrice = wheel.startingPricePerWheel ?? null
  const effectivePricing = pricing ? mergeWheelPricing(wheel, pricing) : null
  const priceResult =
    basePrice && effectivePricing
      ? computePerWheelPrices(
          basePrice,
          {
            front: { diameter: frontDiameter, width: frontWidth },
            rear: { diameter: rearDiameter, width: rearWidth },
            construction,
            beadlock,
          },
          effectivePricing,
        )
      : {}

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

        <div className="lg:sticky lg:top-32 h-fit space-y-6">
          <div>
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
          </div>

          {basePrice && (
            <div className="border border-border rounded-lg p-4 bg-surface">
              <p className="font-body text-xs uppercase tracking-wider text-text-muted">
                Starting at
              </p>
              <p className="font-display text-2xl tracking-widest text-gold mt-1">
                ${priceResult.displayPricePerWheel?.toLocaleString() ??
                  basePrice.toLocaleString()}{' '}
                <span className="font-body text-xs text-text-muted tracking-normal">
                  / wheel
                </span>
              </p>
              <p className="font-body text-xs text-text-muted mt-2">
                Estimate updates as you configure your setup.
              </p>
            </div>
          )}

          <div className="mt-8">
            <button
              type="button"
              onClick={() => setPanelOpen((v) => !v)}
              className="w-full inline-flex items-center justify-center px-8 py-3 border border-gold text-gold font-display text-sm uppercase tracking-widest hover:bg-gold hover:text-bg transition-colors"
            >
              {panelOpen ? 'Hide Inquiry' : 'Configure & Request Quote'}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {panelOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: 16 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: 16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 border border-border rounded-lg bg-surface overflow-hidden"
          >
            <div className="px-6 py-6 border-b border-border">
              <p className="font-display text-sm tracking-[0.2em] text-text">
                WHEEL INQUIRY
              </p>
              {basePrice && (
                <p className="font-body text-sm text-text-muted mt-1">
                  Estimated from{' '}
                  <span className="text-gold font-semibold">
                    $
                    {priceResult.displayPricePerWheel?.toLocaleString() ??
                      basePrice.toLocaleString()}{' '}
                    / wheel
                  </span>
                </p>
              )}
            </div>
            <WheelInquiryForm
              wheelId={wheel.id}
              pricing={effectivePricing}
              onConfigChange={(cfg) => {
                setFrontDiameter(cfg.frontDiameter)
                setFrontWidth(cfg.frontWidth)
                setRearDiameter(cfg.rearDiameter)
                setRearWidth(cfg.rearWidth)
                setConstruction(cfg.construction)
                setBeadlock(cfg.beadlock)
              }}
              onSubmitted={() => {
                // Keep the panel open to show success state
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
