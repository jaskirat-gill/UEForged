import type { Wheel, WheelPricing } from '@/payload-types'

export type PricingOption = {
  label: string
  value: string
  priceDelta: number
}

export type EffectivePricing = {
  diameterOptions: PricingOption[]
  widthOptions: PricingOption[]
  constructionOptions: PricingOption[]
  beadlockOptions: PricingOption[]
}

export function mergeWheelPricing(
  wheel: Wheel,
  globalPricing: WheelPricing | null,
): EffectivePricing {
  const globalDiameter = (globalPricing?.diameterOptions ?? []) as PricingOption[]
  const globalWidth = (globalPricing?.widthOptions ?? []) as PricingOption[]
  const globalConstruction = (globalPricing?.constructionOptions ?? []) as PricingOption[]
  const globalBeadlock = (globalPricing?.beadlockOptions ?? []) as PricingOption[]

  const overrides = wheel.pricingOverrides
  const useOverrides = overrides?.useOverrides ?? false

  if (!useOverrides || !overrides) {
    return {
      diameterOptions: globalDiameter,
      widthOptions: globalWidth,
      constructionOptions: globalConstruction,
      beadlockOptions: globalBeadlock,
    }
  }

  return {
    diameterOptions: (overrides.diameterOptions ?? globalDiameter) as PricingOption[],
    widthOptions: (overrides.widthOptions ?? globalWidth) as PricingOption[],
    constructionOptions: (overrides.constructionOptions ?? globalConstruction) as PricingOption[],
    beadlockOptions: (overrides.beadlockOptions ?? globalBeadlock) as PricingOption[],
  }
}

export type WheelSideSelection = {
  diameter?: string
  width?: string
}

export type WheelSelectionConfig = {
  front: WheelSideSelection
  rear: WheelSideSelection
  construction?: string
  beadlock?: string
}

export type PriceComputationResult = {
  frontPricePerWheel?: number
  rearPricePerWheel?: number
  displayPricePerWheel?: number
}

function sumAdjustmentsForSide(
  sideKey: 'front' | 'rear',
  side: WheelSideSelection,
  construction: string | undefined,
  beadlock: string | undefined,
  rules: EffectivePricing,
): number {
  let delta = 0

  if (side.diameter) {
    const match = rules.diameterOptions.find((opt) => opt.value === side.diameter)
    if (match) delta += match.priceDelta
  }

  if (side.width) {
    const match = rules.widthOptions.find((opt) => opt.value === side.width)
    if (match) delta += match.priceDelta
  }

  if (construction) {
    const match = rules.constructionOptions.find((opt) => opt.value === construction)
    if (match) delta += match.priceDelta
  }

  if (beadlock) {
    // Special case: rear-only beadlock only affects rear wheels
    if (beadlock === 'rear_only' && sideKey === 'front') return delta
    const match = rules.beadlockOptions.find((opt) => opt.value === beadlock)
    if (match) delta += match.priceDelta
  }

  return delta
}

export function computePerWheelPrices(
  basePrice: number | null | undefined,
  selection: WheelSelectionConfig,
  rules: EffectivePricing,
): PriceComputationResult {
  if (!basePrice || basePrice <= 0) {
    return {}
  }

  const frontDelta = sumAdjustmentsForSide(
    'front',
    selection.front,
    selection.construction,
    selection.beadlock,
    rules,
  )
  const rearDelta = sumAdjustmentsForSide(
    'rear',
    selection.rear,
    selection.construction,
    selection.beadlock,
    rules,
  )

  const frontPrice = selection.front.diameter || selection.front.width ? basePrice + frontDelta : undefined
  const rearPrice = selection.rear.diameter || selection.rear.width ? basePrice + rearDelta : undefined

  let display: number | undefined
  if (frontPrice != null && rearPrice != null) {
    display = Math.min(frontPrice, rearPrice)
  } else {
    display = frontPrice ?? rearPrice
  }

  return {
    frontPricePerWheel: frontPrice,
    rearPricePerWheel: rearPrice,
    displayPricePerWheel: display,
  }
}

