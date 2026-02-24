'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'


type Props = {
  /** Optional context, e.g. wheel name for wheel-specific inquiries */
  context?: string | null
  /** Compact layout for use inside panels/sidebars */
  compact?: boolean
  /** Optional CTA: { label, href } */
  cta?: { label: string; href: string } | null
}

const container = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  }),
}

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function InquirySuccessView({ context, compact = false, cta = null }: Props) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={
        compact
          ? 'py-8 px-4 text-center'
          : 'py-16 md:py-24 px-6 text-center max-w-lg mx-auto'
      }
    >
      {/* Animated checkmark circle */}
      <motion.div
        variants={item}
        className="relative inline-flex items-center justify-center mb-8"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
          className={
            compact
              ? 'w-16 h-16 rounded-full border-2 border-gold'
              : 'w-24 h-24 rounded-full border-2 border-gold'
          }
        />
        <svg
          className={`absolute text-gold ${compact ? 'w-7 h-7' : 'w-12 h-12'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <motion.path
            d="M4 12l5 5 11-11"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
          />
        </svg>
      </motion.div>

      <motion.h2
        variants={item}
        className={
          compact
            ? 'font-display text-2xl tracking-widest text-gold'
            : 'font-display text-4xl md:text-5xl tracking-widest text-gold'
        }
      >
        YOU&apos;RE IN
      </motion.h2>
      {context && (
        <motion.p
          variants={item}
          className="font-display text-lg tracking-wide text-text-muted mt-1"
        >
          {context}
        </motion.p>
      )}
      <motion.p
        variants={item}
        className="font-body text-text-muted mt-4 leading-relaxed"
      >
        We&apos;ve got your details. Our team will review and reach out within 1–2
        business days.
      </motion.p>

      {/* What happens next */}
      <motion.div
        variants={item}
        className={
          compact
            ? 'mt-6 text-left space-y-3'
            : 'mt-10 text-left space-y-4 max-w-sm mx-auto'
        }
      >
        <p className="font-display text-xs tracking-widest text-gold uppercase">
          What happens next
        </p>
        <ul className="space-y-3 font-body text-sm text-text-muted">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-semibold">
              1
            </span>
            We&apos;ll confirm your build details and options
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-semibold">
              2
            </span>
            You&apos;ll get a tailored quote and lead time
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-semibold">
              3
            </span>
            We&apos;ll answer any questions and lock in your order
          </li>
        </ul>
      </motion.div>

      {cta && (
        <motion.div variants={item} className="mt-8">
          <Link
            href={cta.href}
            className="inline-block font-display text-sm tracking-widest text-gold hover:text-gold-highlight transition-colors underline underline-offset-4"
          >
            {cta.label}
          </Link>
        </motion.div>
      )}
    </motion.div>
  )
}
