'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'

export type InquiryFormData = {
  name: string
  email: string
  phone?: string
  carMake?: string
  carModel?: string
  carYear?: string
  wheelInterest?: string
  finishPreference?: string
  boltPattern?: string
  notes?: string
}

export async function submitInquiry(data: InquiryFormData): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const payload = await getPayload({ config: await config })
    await payload.create({
      collection: 'inquiries',
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        carDetails: {
          make: data.carMake || undefined,
          model: data.carModel || undefined,
          year: data.carYear || undefined,
        },
        wheelInterest: data.wheelInterest || undefined,
        finishPreference: data.finishPreference || undefined,
        boltPattern: data.boltPattern || undefined,
        notes: data.notes || undefined,
        status: 'new',
      },
    })
    return { ok: true }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to submit inquiry'
    return { ok: false, error: message }
  }
}
