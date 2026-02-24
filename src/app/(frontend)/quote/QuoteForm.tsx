'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { InquirySuccessView } from '@/components/InquirySuccessView'
import { submitInquiry } from './actions'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  carMake: z.string().optional(),
  carModel: z.string().optional(),
  carYear: z.string().optional(),
  wheelInterest: z.string().optional(),
  finishPreference: z.string().optional(),
  boltPattern: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface QuoteFormProps {
  wheels: { id: string; name: string }[]
  prefilledWheel?: string | null
}

export function QuoteForm({ wheels, prefilledWheel }: QuoteFormProps) {
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      wheelInterest: prefilledWheel ?? undefined,
    },
  })

  React.useEffect(() => {
    if (prefilledWheel) {
      const wheel = wheels.find((w) => w.id === prefilledWheel || w.name === prefilledWheel)
      if (wheel) setValue('wheelInterest', wheel.id)
    }
  }, [prefilledWheel, wheels, setValue])

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null)
    const result = await submitInquiry({
      name: data.name,
      email: data.email,
      phone: data.phone,
      carMake: data.carMake,
      carModel: data.carModel,
      carYear: data.carYear,
      wheelInterest: data.wheelInterest,
      finishPreference: data.finishPreference,
      boltPattern: data.boltPattern,
      notes: data.notes,
    })
    if (result.ok) {
      setSuccess(true)
    } else {
      setSubmitError(result.error)
    }
  }

  if (success) {
    return (
      <InquirySuccessView
        cta={{ label: 'Explore our wheels', href: '/wheels' }}
      />
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto space-y-6"
    >
      <Input
        label="Name"
        {...register('name')}
        error={errors.name?.message}
        placeholder="Your name"
        required
      />
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        placeholder="you@example.com"
        required
      />
      <Input
        label="Phone"
        type="tel"
        {...register('phone')}
        error={errors.phone?.message}
        placeholder="Optional"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Car make"
          {...register('carMake')}
          error={errors.carMake?.message}
          placeholder="e.g. BMW"
        />
        <Input
          label="Car model"
          {...register('carModel')}
          error={errors.carModel?.message}
          placeholder="e.g. M4"
        />
        <Input
          label="Year"
          {...register('carYear')}
          error={errors.carYear?.message}
          placeholder="e.g. 2024"
        />
      </div>
      <Select
        label="Wheel series interest"
        options={wheels.map((w) => ({ value: w.id, label: w.name }))}
        placeholder="Select a wheel (optional)"
        {...register('wheelInterest')}
        error={errors.wheelInterest?.message}
      />
      <Input
        label="Finish preference"
        {...register('finishPreference')}
        error={errors.finishPreference?.message}
        placeholder="e.g. Gloss Black, Matte Bronze"
      />
      <Input
        label="Bolt pattern"
        {...register('boltPattern')}
        error={errors.boltPattern?.message}
        placeholder="e.g. 5x112"
      />
      <Textarea
        label="Additional notes"
        {...register('notes')}
        error={errors.notes?.message}
        placeholder="Tell us about your build..."
      />
      {submitError && (
        <p className="font-body text-sm text-red-500">{submitError}</p>
      )}
      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting ? 'Sending...' : 'Submit inquiry'}
      </Button>
    </motion.form>
  )
}
