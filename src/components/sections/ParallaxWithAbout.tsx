'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useScroll, useMotionValue } from 'framer-motion'
import { ScrollParallaxShowcase } from './ScrollParallaxShowcase'
import { AboutTeaserReveal } from './AboutTeaserReveal'

interface ParallaxWithAboutProps {
  parallaxImageUrl: string | null
  aboutBackgroundUrl: string | null
}

export function ParallaxWithAbout({
  parallaxImageUrl,
  aboutBackgroundUrl,
}: ParallaxWithAboutProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const fallbackProgress = useMotionValue(0.6)

  useEffect(() => {
    setReady(true)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  return (
    <div ref={containerRef}>
      <ScrollParallaxShowcase
        imageUrl={parallaxImageUrl}
        scrollProgress={ready ? scrollYProgress : null}
      />
      <AboutTeaserReveal
        backgroundImageUrl={aboutBackgroundUrl}
        scrollProgress={ready ? scrollYProgress : fallbackProgress}
      />
    </div>
  )
}
