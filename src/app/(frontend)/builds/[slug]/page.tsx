import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { BuildDetailClient } from './BuildDetailClient'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config: await config })
  const result = await payload.find({
    collection: 'builds',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  const build = result.docs[0]
  if (!build) return { title: 'Build' }
  return {
    title: `${build.carMake} ${build.carModel} (${build.year})`,
    description: build.title ?? `Build featuring UEForged wheels.`,
  }
}

export default async function BuildDetailPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config: await config })
  const result = await payload.find({
    collection: 'builds',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  const build = result.docs[0]
  if (!build) notFound()

  return (
    <div className="pt-20">
      <BuildDetailClient build={build} />
    </div>
  )
}
