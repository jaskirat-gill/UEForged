import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { BuildsGalleryClient } from './BuildsGalleryClient'

async function getBuilds() {
  const payload = await getPayload({ config: await config })
  const result = await payload.find({
    collection: 'builds',
    limit: 50,
    depth: 2,
  })
  return result.docs
}

export const metadata = {
  title: 'Builds',
  description: 'Gallery of builds featuring UEForged wheels.',
}

export default async function BuildsPage() {
  const builds = await getBuilds()
  return (
    <div className="pt-20">
      <BuildsGalleryClient builds={builds} />
    </div>
  )
}
