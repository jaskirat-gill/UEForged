'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import {
  orderSchema,
  CONSTRUCTION_OPTIONS,
  FINISH_OPTIONS,
  SUSPENSION_OPTIONS,
  type OrderFormValues,
} from '@/lib/orderSchema'
import { submitOrder } from './actions'

export type WheelOption = { id: string; name: string; series: string }

export type DealerContext = { companyName: string; contactName?: string | null; email?: string | null; phone?: string | null }

interface OrderFormProps {
  wheels: WheelOption[]
  prefilledWheelId?: string | null
  /** Set on the dealer portal: pre-fills contact details and shows the customer reference field. */
  dealer?: DealerContext | null
}

function Section({ step, title, intro, children }: { step: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border pt-10">
      <div className="flex items-baseline gap-4">
        <span className="font-serif italic text-2xl text-gold">{step}</span>
        <h2 className="font-display text-3xl tracking-wider text-text uppercase">{title}</h2>
      </div>
      {intro && <p className="mt-2 font-body text-sm text-text-muted max-w-2xl">{intro}</p>}
      <div className="mt-8 space-y-6">{children}</div>
    </section>
  )
}

function Check({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex items-center gap-3 font-body text-sm text-text cursor-pointer">
      <input type="checkbox" className="h-4 w-4 accent-[var(--color-gold)]" {...props} />
      {label}
    </label>
  )
}

export function OrderForm({ wheels, prefilledWheelId, dealer }: OrderFormProps) {
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      suspension: 'stock',
      bigBrakeKit: false,
      widebody: false,
      specMode: 'recommend',
      staggered: false,
      front: { diameter: '', width: '', offset: '' },
      rear: { diameter: '', width: '', offset: '' },
      quantity: 4,
      wheelId: prefilledWheelId ?? '',
      website: '',
      name: dealer ? dealer.contactName || dealer.companyName : undefined,
      email: dealer?.email ?? undefined,
      phone: dealer?.phone ?? undefined,
    },
  })

  const specMode = watch('specMode')
  const staggered = watch('staggered')
  const bigBrakeKit = watch('bigBrakeKit')

  const onSubmit = async (data: OrderFormValues) => {
    setSubmitError(null)
    const result = await submitOrder(data)
    if (result.ok) {
      setOrderNumber(result.orderNumber)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setSubmitError(result.error)
    }
  }

  if (orderNumber) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-border bg-surface p-10 md:p-14 text-center"
      >
        <p className="font-body text-xs uppercase tracking-[0.4em] text-gold">Order received</p>
        <p className="mt-4 font-display text-5xl md:text-6xl tracking-widest text-text">{orderNumber}</p>
        <p className="mt-6 font-serif text-xl text-text-muted max-w-xl mx-auto">
          Thank you. We will review your fitment and come back to you with specs, a 3D rendering and a
          quote. Nothing is charged until you approve the rendering.
        </p>
        <p className="mt-4 font-body text-sm text-text-muted">Keep this reference for any follow-up.</p>
        <Link
          href={dealer ? '/dealer' : '/catalog'}
          className="mt-10 inline-block font-body text-sm uppercase tracking-wider text-gold hover:text-gold-highlight"
        >
          {dealer ? 'Back to the dealer portal →' : 'Back to the collection →'}
        </Link>
      </motion.div>
    )
  }

  const specError = (side: 'front' | 'rear', field: 'diameter' | 'width' | 'offset') =>
    errors[side]?.[field]?.message

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-14" noValidate>
      {/* Honeypot: hidden from people, tempting to bots */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-0 w-0 overflow-hidden">
        <label htmlFor="order-website">Website</label>
        <input id="order-website" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <Section step="I" title="Your vehicle">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Input id="vehicle-year" label="Year *" placeholder="2024" {...register('vehicleYear')} error={errors.vehicleYear?.message} />
          <Input id="vehicle-make" label="Make *" placeholder="Lamborghini" {...register('vehicleMake')} error={errors.vehicleMake?.message} />
          <Input id="vehicle-model" label="Model *" placeholder="Huracán" {...register('vehicleModel')} error={errors.vehicleModel?.message} />
          <Input id="vehicle-trim" label="Trim / chassis" placeholder="Tecnica" {...register('vehicleTrim')} />
        </div>
      </Section>

      <Section
        step="II"
        title="Modifications"
        intro="Anything that changes fitment: brakes, suspension, arches or tyres. This helps us get offset and clearance right first time."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select id="mods-suspension" label="Suspension" options={[...SUSPENSION_OPTIONS]} {...register('suspension')} />
          <Input id="mods-tires" label="Current tyre sizes" placeholder="245/30R20 front, 305/30R20 rear" {...register('currentTires')} />
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-4">
          <Check label="Big brake kit fitted" {...register('bigBrakeKit')} />
          <Check label="Widebody / wider arches" {...register('widebody')} />
        </div>
        {bigBrakeKit && (
          <Input id="mods-brakes" label="Brake kit details" placeholder="e.g. Brembo GT 6-piston, 380 mm front" {...register('brakeDetails')} />
        )}
        <Textarea id="mods-other" label="Other relevant modifications" placeholder="Spacers, camber kits, aero, track use…" {...register('otherMods')} />
      </Section>

      <Section step="III" title="Design">
        <Select
          id="design-wheel"
          label="Design"
          placeholder="Custom design / not sure yet"
          options={wheels.map((w) => ({ value: w.id, label: `${w.name} · ${w.series}` }))}
          {...register('wheelId')}
        />
        <Textarea
          id="design-notes"
          label="Design notes or reference"
          placeholder="Describe the look you want, or a design you have in mind."
          {...register('designNotes')}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select id="design-construction" label="Construction" options={[...CONSTRUCTION_OPTIONS]} {...register('construction')} />
          <Select id="design-finish" label="Finish" options={[...FINISH_OPTIONS]} {...register('finish')} />
        </div>
      </Section>

      <Section step="IV" title="Specification">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="radiogroup" aria-label="Specification">
          {[
            { value: 'recommend', title: 'Recommend my specs', body: 'Our team works out diameter, width and offset for a flush, safe fitment on your car.' },
            { value: 'custom', title: 'I have my own specs', body: 'Enter the sizes and offsets you want. We will still check them against your car.' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={specMode === opt.value}
              onClick={() => setValue('specMode', opt.value as 'custom' | 'recommend', { shouldValidate: true })}
              className={cn(
                'text-left border p-6 transition-colors',
                specMode === opt.value ? 'border-gold bg-surface-elevated' : 'border-border bg-surface hover:border-gold/60',
              )}
            >
              <span className="font-display text-xl tracking-wider text-text uppercase">{opt.title}</span>
              <span className="mt-2 block font-body text-sm text-text-muted">{opt.body}</span>
            </button>
          ))}
        </div>

        {specMode === 'custom' && (
          <div className="space-y-6">
            <Check label="Staggered (different front and rear sizes)" {...register('staggered')} />
            {(['front', 'rear'] as const)
              .filter((side) => side === 'front' || staggered)
              .map((side) => (
                <div key={side}>
                  <p className="font-body text-xs uppercase tracking-[0.3em] text-gold mb-3">
                    {staggered ? `${side} wheels` : 'All wheels'}
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <Input id={`${side}-diameter`} label="Diameter (in) *" placeholder="20" inputMode="decimal" {...register(`${side}.diameter`)} error={specError(side, 'diameter')} />
                    <Input id={`${side}-width`} label="Width (J) *" placeholder="8.5" inputMode="decimal" {...register(`${side}.width`)} error={specError(side, 'width')} />
                    <Input id={`${side}-offset`} label="Offset (ET)" placeholder="40" {...register(`${side}.offset`)} />
                  </div>
                </div>
              ))}
            <div className="grid grid-cols-2 gap-4">
              <Input id="spec-pcd" label="Bolt pattern" placeholder="5x112" {...register('boltPattern')} />
              <Input id="spec-bore" label="Centre bore (mm)" placeholder="57.1" {...register('centreBore')} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            id="spec-quantity"
            label="Quantity"
            type="number"
            min={1}
            max={8}
            {...register('quantity', { valueAsNumber: true })}
            error={errors.quantity?.message}
          />
          <Input id="spec-engraving" label="Lip engraving" placeholder="UEFORGED, a name…" {...register('lipEngraving')} />
          <Input id="spec-caps" label="Centre caps" placeholder="UEF, factory crest, floating…" {...register('centreCaps')} />
        </div>
      </Section>

      <Section step="V" title={dealer ? `Dealer: ${dealer.companyName}` : 'Your details'}>
        {dealer && (
          <Input
            id="dealer-customer-ref"
            label="Your customer reference"
            placeholder="Your customer's name or job number"
            {...register('customerRef')}
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input id="cust-name" label="Name *" autoComplete="name" {...register('name')} error={errors.name?.message} />
          <Input id="cust-email" label="Email *" type="email" autoComplete="email" {...register('email')} error={errors.email?.message} />
          <Input id="cust-phone" label="Phone" type="tel" autoComplete="tel" {...register('phone')} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input id="ship-city" label="City" autoComplete="address-level2" {...register('city')} />
          <Input id="ship-region" label="Province / State" autoComplete="address-level1" {...register('region')} />
          <Input id="ship-country" label="Country" autoComplete="country-name" {...register('country')} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input id="order-budget" label="Budget (optional)" placeholder="Per set" {...register('budget')} />
          <Input id="order-needed" label="Needed by (optional)" placeholder="e.g. before June" {...register('neededBy')} />
        </div>
        <Textarea id="order-notes" label="Anything else?" {...register('notes')} />
      </Section>

      <div className="border-t border-border pt-10 space-y-6">
        <label className="flex items-start gap-3 font-body text-sm text-text-muted cursor-pointer max-w-2xl">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-[var(--color-gold)]" {...register('agree')} />
          <span>
            I understand this places an order request. UEForged will confirm fitment, send a 3D rendering and a
            quote, and nothing is charged until I approve the rendering.
          </span>
        </label>
        {errors.agree && <p className="font-body text-sm text-red-500">{errors.agree.message}</p>}
        {submitError && <p className="font-body text-sm text-red-500">{submitError}</p>}
        {Object.keys(errors).length > 0 && !errors.agree && (
          <p className="font-body text-sm text-red-500">Please fill in the highlighted fields.</p>
        )}
        <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full md:w-auto px-12 py-4 text-base">
          {isSubmitting ? 'Placing order…' : 'Place order'}
        </Button>
      </div>
    </form>
  )
}
