'use client'

import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WheelCard } from '@/components/sections/WheelCard'
import type { Wheel, Finish, Series } from '@/payload-types'

interface WheelsPageClientProps {
  initialWheels: Wheel[]
  finishes: Finish[]
  series: Series[]
}

export function WheelsPageClient({
  initialWheels,
  finishes,
  series,
}: WheelsPageClientProps) {
  const [filterSeries, setFilterSeries] = useState<string | null>(null)
  const [filterFinish, setFilterFinish] = useState<string | null>(null)

  const filteredWheels = useMemo(() => {
    return initialWheels.filter((w) => {
      if (filterSeries && (typeof w.series === 'object' ? w.series.id : w.series) !== filterSeries)
        return false
      if (filterFinish) {
        const ids = w.specs?.finishesAvailable?.map((f) => (typeof f === 'object' ? f.id : f))
        if (!ids?.includes(filterFinish)) return false
      }
      return true
    })
  }, [initialWheels, filterSeries, filterFinish])

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <motion.h1
        className="font-display text-5xl md:text-6xl tracking-widest text-text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        WHEELS
      </motion.h1>
      <motion.p
        className="font-body text-text-muted mt-4 max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Filter by series or finish. Each wheel is forged to order.
      </motion.p>

      <motion.div
        className="flex flex-wrap gap-4 mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <select
          className="bg-surface border border-border text-text font-body px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gold"
          value={filterSeries ?? ''}
          onChange={(e) => setFilterSeries(e.target.value || null)}
          aria-label="Filter by series"
        >
          <option value="">All series</option>
          {series.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <select
          className="bg-surface border border-border text-text font-body px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gold"
          value={filterFinish ?? ''}
          onChange={(e) => setFilterFinish(e.target.value || null)}
          aria-label="Filter by finish"
        >
          <option value="">All finishes</option>
          {finishes.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16"
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredWheels.map((wheel, i) => (
            <motion.div
              key={wheel.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
            >
              <WheelCard wheel={wheel} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredWheels.length === 0 && (
        <motion.p
          className="font-body text-text-muted text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No wheels match your filters.
        </motion.p>
      )}
    </div>
  )
}
