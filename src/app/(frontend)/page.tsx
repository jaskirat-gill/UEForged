import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Hero } from '@/components/sections/Hero'
import { FeaturedWheels } from '@/components/sections/FeaturedWheels'
import { ParallaxWithAbout } from '@/components/sections/ParallaxWithAbout'
import { TestimonialCarousel } from '@/components/sections/TestimonialCarousel'
import { CTABanner } from '@/components/sections/CTABanner'

function getMediaUrl(media: unknown): string | null {
  if (media && typeof media === 'object' && 'url' in media && typeof (media as { url: unknown }).url === 'string') {
    return (media as { url: string }).url
  }
  return null
}

async function getHomeData() {
  const payload = await getPayload({ config: await config })
  const [settings, testimonials] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', depth: 1 }),
    payload.find({
      collection: 'testimonials',
      limit: 5,
    }),
  ])
  return { settings, testimonials: testimonials.docs }
}

export default async function HomePage() {
  const { settings, testimonials } = await getHomeData()

  return (
    <>
      <Hero
        headline={settings?.heroHeadline ?? 'FORGED TO PERFORM'}
        subtext={settings?.heroSubtext ?? null}
        heroMedia={
          settings?.heroMedia && typeof settings.heroMedia === 'object'
            ? { url: settings.heroMedia.url ?? null }
            : null
        }
      />
      <FeaturedWheels backgroundImageUrl={getMediaUrl(settings?.featuredWheelsBackground)} />
      <ParallaxWithAbout
        parallaxImageUrl={getMediaUrl(settings?.showcaseMedia)}
        aboutBackgroundUrl={getMediaUrl(settings?.aboutBackground)}
      />
      <TestimonialCarousel
        testimonials={testimonials}
        backgroundImageUrl={getMediaUrl(settings?.testimonialsBackground)}
      />
      <CTABanner backgroundImageUrl={getMediaUrl(settings?.ctaBackground)} />
    </>
  )
}
