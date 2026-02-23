import React from 'react'
import { FadeUpOnScroll } from '@/components/animations/FadeUpOnScroll'

export const metadata = {
  title: 'About',
  description:
    'UEForged — luxury custom forged wheels. Our process from design to finish.',
}

export default function AboutPage() {
  return (
    <div className="pt-20">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <FadeUpOnScroll>
          <h1 className="font-display text-5xl md:text-6xl tracking-widest text-text">
            ABOUT UEFORGED
          </h1>
        </FadeUpOnScroll>
        <FadeUpOnScroll delay={0.1}>
          <p className="font-serif text-xl text-gold mt-8">
            Precision engineering meets art. Every wheel we make is forged from a single billet —
            no casting, no compromise.
          </p>
        </FadeUpOnScroll>
        <FadeUpOnScroll delay={0.2}>
          <div className="mt-16 space-y-12 font-body text-text-muted leading-relaxed">
            <p>
              UEForged was born from a simple idea: the best wheels are forged, not cast. We use
              aerospace-grade aluminum and CNC precision to create wheels that are stronger and
              lighter than anything off the shelf. Each design is engineered for fitment, performance,
              and aesthetics — and every order is built to your exact specifications.
            </p>
            <p>
              Our process starts with your vision. You tell us the car, the look, and the driving
              you do. We take it from design through forging and finishing. The result is a wheel
              that looks like art and performs like a tool.
            </p>
          </div>
        </FadeUpOnScroll>

        <FadeUpOnScroll delay={0.3} className="mt-24">
          <h2 className="font-display text-3xl tracking-widest text-text mb-8">
            THE FORGING PROCESS
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Design',
                body: 'We work with you on fitment, offset, and style. Our team translates your vision into a production-ready design.',
              },
              {
                step: '02',
                title: 'Forge',
                body: 'A single billet of 6061-T6 aluminum is forged and CNC-machined into your wheel. One piece, no welds.',
              },
              {
                step: '03',
                title: 'Finish',
                body: 'Your choice of finish — gloss, matte, brushed, or custom. We apply the same standards to every detail.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="border border-border rounded-lg p-6 bg-surface"
              >
                <span className="font-display text-gold text-2xl">{item.step}</span>
                <h3 className="font-display text-xl tracking-wider text-text mt-2">
                  {item.title}
                </h3>
                <p className="font-body text-text-muted mt-4 text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </FadeUpOnScroll>
      </div>
    </div>
  )
}
