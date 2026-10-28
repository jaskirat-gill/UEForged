import type { Wheel, WheelPricing } from '@/payload-types'
import type { PricingOption } from '@/lib/wheelPricing'

/**
 * Builds the size × construction price grid from the live Wheel Pricing rules.
 * Used by the staff Price Chart (admin) and the dealer portal (with the dealer's discount).
 */
export type PriceChart = {
  base: number | null
  columns: PricingOption[]
  rows: { label: string; value: string; perWheel: number[] }[]
  diameters: PricingOption[]
  widths: PricingOption[]
  constructions: PricingOption[]
  beadlocks: PricingOption[]
}

/** Applies a dealer discount and rounds to whole dollars. */
export const applyDiscount = (usd: number, discountPercent = 0) =>
  Math.round(usd * (1 - Math.min(Math.max(discountPercent, 0), 100) / 100))

export function buildPriceChart(
  pricing: WheelPricing | null,
  wheels: Pick<Wheel, 'startingPricePerWheel'>[],
  discountPercent = 0,
): PriceChart {
  const diameters = (pricing?.diameterOptions ?? []) as PricingOption[]
  const widths = (pricing?.widthOptions ?? []) as PricingOption[]
  const constructions = (pricing?.constructionOptions ?? []) as PricingOption[]
  const beadlocks = (pricing?.beadlockOptions ?? []) as PricingOption[]

  const starting = wheels
    .map((w) => w.startingPricePerWheel)
    .filter((p): p is number => typeof p === 'number' && p > 0)
  const base = starting.length ? Math.min(...starting) : null

  const columns: PricingOption[] = [
    ...(constructions.length ? constructions : [{ label: 'Base', value: 'base', priceDelta: 0 }]),
    // One beadlock column: "rear only" options use the same per-wheel price, just on fewer wheels.
    ...beadlocks
      .filter((b) => b.priceDelta > 0 && !/rear/i.test(`${b.value} ${b.label}`))
      .slice(0, 1)
      .map((b) => ({ ...b, label: `${b.label} (monoblock)` })),
  ]

  const rows =
    base === null
      ? []
      : diameters.map((d) => ({
          label: d.label,
          value: d.value,
          perWheel: columns.map((c) => applyDiscount(base + d.priceDelta + c.priceDelta, discountPercent)),
        }))

  return { base, columns, rows, diameters, widths, constructions, beadlocks }
}
