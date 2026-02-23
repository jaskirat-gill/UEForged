'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import type { Wheel, Media, Series } from '@/payload-types'

interface WheelCardProps {
  wheel: Wheel
}

function getFirstImageUrl(wheel: Pick<Wheel, 'images'>): string | null {
  const first = wheel.images?.[0]?.image
  if (!first) return null
  return typeof first === 'object' && first.url ? first.url : null
}

function getSeriesName(series: string | Series): string {
  return typeof series === 'object' && series.name ? series.name : 'Series'
}

export function WheelCard({ wheel }: WheelCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8])
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8])
  const [hovered, setHovered] = useState(false)

  const imageUrl = getFirstImageUrl(wheel)
  const seriesName = getSeriesName(wheel.series)
  const startingPrice = wheel.startingPricePerWheel ?? null

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const relX = (e.clientX - centerX) / rect.width
    const relY = (e.clientY - centerY) / rect.height
    x.set(relX)
    y.set(relY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: hovered ? rotateX : 0,
        rotateY: hovered ? rotateY : 0,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className="group relative rounded-lg border border-border bg-surface overflow-hidden h-full flex flex-col"
    >
      <Link href={`/wheels/${wheel.slug}`} className="block flex-1 flex flex-col">
        <div className="relative aspect-square overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={wheel.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-surface-elevated flex items-center justify-center text-text-muted font-body text-sm">
              No image
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <span className="font-body text-xs uppercase tracking-wider text-gold">
            {seriesName}
          </span>
          <h3 className="font-display text-2xl tracking-wider text-text mt-1">{wheel.name}</h3>
          {startingPrice != null && (
            <p className="font-body text-sm text-gold mt-2">
              From ${startingPrice.toLocaleString()} <span className="text-text-muted">/ wheel</span>
            </p>
          )}
          <span className="font-body text-sm text-gold mt-3 inline-block">View details →</span>
        </div>
      </Link>
    </motion.div>
  )
}
