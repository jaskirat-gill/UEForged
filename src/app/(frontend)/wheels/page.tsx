import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { WheelsPageClient } from './WheelsPageClient'
import type { Wheel, Series } from '@/payload-types'

export const dynamic = 'force-dynamic'

async function getWheelsPageData() {
  const payload = await getPayload({ config: await config })
  const [wheels, series] = await Promise.all([
    payload.find({
      collection: 'wheels',
      limit: 100,
      depth: 2,
    }),
    payload.find({ collection: 'series', limit: 50 }),
  ])
  return {
    wheels: wheels.docs,
    series: series.docs as Series[],
  }
}

export const metadata = {
  title: 'Wheels',
  description: 'Explore UEForged custom forged wheel collections. Filter by series.',
}

export default async function WheelsPage() {
  const data = await getWheelsPageData()
  return (
    <div className="pt-20">
      <WheelsPageClient
        initialWheels={data.wheels as Wheel[]}
        series={data.series}
      />
    </div>
  )
}
