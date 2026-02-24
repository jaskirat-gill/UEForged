'use client'

import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { InquirySuccessView } from '@/components/InquirySuccessView'
import type { EffectivePricing } from '@/lib/wheelPricing'
import { submitWheelInquiry } from './actions'

const DEFAULT_CONSTRUCTION_OPTIONS = [
  { value: 'monoblock', label: 'Monoblock' },
  { value: 'modular', label: 'Modular' },
] as const

const DEFAULT_BEADLOCK_OPTIONS = [
  { value: 'none', label: 'No beadlock' },
  { value: 'beadlock', label: 'Beadlock' },
  { value: 'rear_only', label: 'Rear only' },
] as const

function buildSchema(
  constructionValues: readonly string[],
  beadlockValues: readonly string[],
) {
  const constructionSchema =
    constructionValues.length > 0
      ? z.string().refine((v) => constructionValues.includes(v), {
          message: 'Please select a valid construction option',
        })
      : z.string()
  const beadlockSchema =
    beadlockValues.length > 0
      ? z.string().refine((v) => beadlockValues.includes(v), {
          message: 'Please select a valid beadlock option',
        })
      : z.string()
  return z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().optional(),

    carYear: z.string().min(1, 'Year is required'),
    carMake: z.string().min(1, 'Make is required'),
    carModel: z.string().min(1, 'Model is required'),

    frontDiameter: z.string().min(1, 'Front diameter is required'),
    frontWidth: z.string().min(1, 'Front width is required'),
    frontOffset: z.string().optional(),

    rearDiameter: z.string().min(1, 'Rear diameter is required'),
    rearWidth: z.string().min(1, 'Rear width is required'),
    rearOffset: z.string().optional(),

    construction: constructionSchema,
    beadlock: beadlockSchema,

    additionalDetails: z.string().min(1, 'Additional details are required'),
  })
}

type FormValues = {
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
  construction: string
  beadlock: string
  additionalDetails: string
}

type Props = {
  wheelId: string
  wheelName?: string | null
  pricing: EffectivePricing | null
  onConfigChange: (config: {
    frontDiameter?: string
    frontWidth?: string
    rearDiameter?: string
    rearWidth?: string
    construction?: string
    beadlock?: string
  }) => void
  onSubmitted?: () => void
}

export function WheelInquiryForm({ wheelId, wheelName, pricing, onConfigChange, onSubmitted }: Props) {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const constructionOptions = useMemo(() => {
    if (!pricing?.constructionOptions?.length) return [...DEFAULT_CONSTRUCTION_OPTIONS]
    return pricing.constructionOptions.map((o) => ({ value: o.value, label: o.label }))
  }, [pricing])

  const beadlockOptions = useMemo(() => {
    if (!pricing?.beadlockOptions?.length) return [...DEFAULT_BEADLOCK_OPTIONS]
    return pricing.beadlockOptions.map((o) => ({ value: o.value, label: o.label }))
  }, [pricing])

  const schema = useMemo(
    () =>
      buildSchema(
        constructionOptions.map((o) => o.value),
        beadlockOptions.map((o) => o.value),
      ),
    [constructionOptions, beadlockOptions],
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      beadlock: beadlockOptions[0]?.value ?? 'none',
    },
  })

  const watched = watch([
    'frontDiameter',
    'frontWidth',
    'rearDiameter',
    'rearWidth',
    'construction',
    'beadlock',
  ])

  React.useEffect(() => {
    onConfigChange({
      frontDiameter: watched[0] || undefined,
      frontWidth: watched[1] || undefined,
      rearDiameter: watched[2] || undefined,
      rearWidth: watched[3] || undefined,
      construction: watched[4] || undefined,
      beadlock: watched[5] || undefined,
    })
  }, [onConfigChange, watched])

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null)
    const result = await submitWheelInquiry({
      wheelId,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      carYear: values.carYear,
      carMake: values.carMake,
      carModel: values.carModel,
      frontDiameter: values.frontDiameter,
      frontWidth: values.frontWidth,
      frontOffset: values.frontOffset,
      rearDiameter: values.rearDiameter,
      rearWidth: values.rearWidth,
      rearOffset: values.rearOffset,
      construction: values.construction,
      beadlock: values.beadlock,
      additionalDetails: values.additionalDetails,
    })
    if (result.ok) {
      setSuccess(true)
      onSubmitted?.()
    } else {
      setSubmitError(result.error)
    }
  }

  if (!pricing) {
    return (
      <p className="font-body text-sm text-text-muted">
        Pricing options aren’t configured yet. Please use the main quote form.
      </p>
    )
  }

  if (success) {
    return (
      <InquirySuccessView
        context={wheelName ? `Your ${wheelName} inquiry` : undefined}
        compact
        cta={{ label: 'Browse more wheels', href: '/wheels' }}
      />
    )
  }

  const diameterOptions = pricing.diameterOptions.map((o) => ({ value: o.value, label: o.label }))
  const widthOptions = pricing.widthOptions.map((o) => ({ value: o.value, label: o.label }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-8 space-y-10">
      <div className="grid gap-6 md:grid-cols-2">
        <Input label="First Name *" {...register('firstName')} error={errors.firstName?.message} />
        <Input label="Last Name *" {...register('lastName')} error={errors.lastName?.message} />
        <Input label="Email *" type="email" {...register('email')} error={errors.email?.message} />
        <Input label="Phone" type="tel" {...register('phone')} error={errors.phone?.message} />
      </div>

      <div>
        <h4 className="font-display text-lg tracking-widest text-text">Vehicle Details</h4>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <Input label="Year *" {...register('carYear')} error={errors.carYear?.message} />
          <Input label="Make *" {...register('carMake')} error={errors.carMake?.message} />
          <Input label="Model *" {...register('carModel')} error={errors.carModel?.message} />
        </div>
      </div>

      <div>
        <h4 className="font-display text-lg tracking-widest text-text">Wheel Specifications</h4>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="font-display tracking-widest text-gold">Front Wheel</p>
            <Select
              label="Front Diameter *"
              placeholder="Please select"
              options={diameterOptions}
              {...register('frontDiameter')}
              error={errors.frontDiameter?.message}
            />
            <Select
              label="Front Width *"
              placeholder="Please select"
              options={widthOptions}
              {...register('frontWidth')}
              error={errors.frontWidth?.message}
            />
            <Input
              label="Front Offset"
              placeholder="Front wheel offset (e.g. +7)"
              {...register('frontOffset')}
              error={errors.frontOffset?.message}
            />
          </div>

          <div className="space-y-4">
            <p className="font-display tracking-widest text-gold">Rear Wheel</p>
            <Select
              label="Rear Diameter *"
              placeholder="Please select"
              options={diameterOptions}
              {...register('rearDiameter')}
              error={errors.rearDiameter?.message}
            />
            <Select
              label="Rear Width *"
              placeholder="Please select"
              options={widthOptions}
              {...register('rearWidth')}
              error={errors.rearWidth?.message}
            />
            <Input
              label="Rear Offset"
              placeholder="Rear wheel offset (e.g. +7)"
              {...register('rearOffset')}
              error={errors.rearOffset?.message}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Select
          label="Monoblock/Modular *"
          placeholder="Please select"
          options={constructionOptions}
          {...register('construction')}
          error={errors.construction?.message}
        />
        <Select
          label="Beadlock *"
          placeholder="Please select"
          options={beadlockOptions}
          {...register('beadlock')}
          error={errors.beadlock?.message}
        />
      </div>

      <Textarea
        label="Additional Details *"
        placeholder="Any information you think we'd like to know?"
        {...register('additionalDetails')}
        error={errors.additionalDetails?.message}
      />

      {submitError && <p className="font-body text-sm text-red-500">{submitError}</p>}

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? 'Sending…' : 'Submit Inquiry'}
        </Button>
      </div>
    </form>
  )
}

