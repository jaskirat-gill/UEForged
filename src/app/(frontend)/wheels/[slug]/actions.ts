'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Wheel, WheelPricing } from '@/payload-types'
import { computePerWheelPrices, mergeWheelPricing } from '@/lib/wheelPricing'

export type WheelInquiryData = {
  wheelId: string

  firstName: string
  lastName: string
  email: string
  phone?: string

  carYear: string
  carMake: string
  carModel: string

  frontDiameter: string
  frontWidth: string
  frontOffset?: string

  rearDiameter: string
  rearWidth: string
  rearOffset?: string

  construction: 'monoblock' | 'modular'
  beadlock: 'none' | 'beadlock' | 'rear_only'

  additionalDetails: string
}

export async function submitWheelInquiry(
  data: WheelInquiryData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const payload = await getPayload({ config: await config })

    const [wheelRes, pricing] = await Promise.all([
      payload.findByID({ collection: 'wheels', id: data.wheelId, depth: 2 }),
      payload.findGlobal({ slug: 'wheel-pricing' }).catch(() => null),
    ])

    const wheel = wheelRes as Wheel
    const globalPricing = pricing as WheelPricing | null

    const basePrice = wheel.startingPricePerWheel ?? null
    const effectivePricing = globalPricing ? mergeWheelPricing(wheel, globalPricing) : null

    const priceResult =
      basePrice && effectivePricing
        ? computePerWheelPrices(
            basePrice,
            {
              front: { diameter: data.frontDiameter, width: data.frontWidth },
              rear: { diameter: data.rearDiameter, width: data.rearWidth },
              construction: data.construction,
              beadlock: data.beadlock,
            },
            effectivePricing,
          )
        : {}

    const front = priceResult.frontPricePerWheel
    const rear = priceResult.rearPricePerWheel
    const estimatedPerWheel = priceResult.displayPricePerWheel

    let estimatedSet: number | undefined
    if (front != null && rear != null) {
      estimatedSet = front * 2 + rear * 2
    } else if (estimatedPerWheel != null) {
      estimatedSet = estimatedPerWheel * 4
    }

    await payload.create({
      collection: 'inquiries',
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        phone: data.phone || undefined,
        carDetails: {
          year: data.carYear,
          make: data.carMake,
          model: data.carModel,
        },
        wheelInterest: data.wheelId,
        frontSpecs: {
          diameter: data.frontDiameter,
          width: data.frontWidth,
          offset: data.frontOffset || undefined,
        },
        rearSpecs: {
          diameter: data.rearDiameter,
          width: data.rearWidth,
          offset: data.rearOffset || undefined,
        },
        construction: data.construction,
        beadlock: data.beadlock,
        notes: data.additionalDetails,
        estimatedPricePerWheel: estimatedPerWheel,
        estimatedSetPrice: estimatedSet,
        status: 'new',
      },
    })

    return { ok: true }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to submit inquiry'
    return { ok: false, error: message }
  }
}

