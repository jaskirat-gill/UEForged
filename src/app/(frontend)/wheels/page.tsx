import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { WheelsPageClient } from './WheelsPageClient'
import type { Wheel, Finish, Series } from '@/payload-types'

async function getWheelsPageData() {
  const payload = await getPayload({ config: await config })
  const [wheels, finishes, series] = await Promise.all([
    payload.find({
      collection: 'wheels',
      limit: 100,
      depth: 2,
    }),
    payload.find({ collection: 'finishes', limit: 50 }),
    payload.find({ collection: 'series', limit: 50 }),
  ])
  return {
    wheels: wheels.docs,
    finishes: finishes.docs as Finish[],
    series: series.docs as Series[],
  }
}

export const metadata = {
  title: 'Wheels',
  description: 'Explore UEForged custom forged wheel collections. Filter by series, finish, and size.',
}

export default async function WheelsPage() {
  const data = await getWheelsPageData()
  return (
    <div className="pt-20">
      <WheelsPageClient
        initialWheels={data.wheels as Wheel[]}
        finishes={data.finishes}
        series={data.series}
      />
    </div>
  )
}
