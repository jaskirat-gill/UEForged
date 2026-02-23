import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { WheelDetailClient } from './WheelDetailClient'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config: await config })
  const result = await payload.find({
    collection: 'wheels',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const wheel = result.docs[0]
  if (!wheel) return { title: 'Wheel' }
  const seriesName = typeof wheel.series === 'object' && wheel.series?.name ? wheel.series.name : ''
  return {
    title: `${wheel.name}${seriesName ? ` | ${seriesName}` : ''}`,
    description: wheel.description ?? undefined,
  }
}

export default async function WheelDetailPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config: await config })
  const result = await payload.find({
    collection: 'wheels',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  const wheel = result.docs[0]
  if (!wheel) notFound()

  return (
    <div className="pt-20">
      <WheelDetailClient wheel={wheel} />
    </div>
  )
}
