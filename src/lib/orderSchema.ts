import { z } from 'zod'

/** Shared by the /order form (client) and the submitOrder action (server). */

const short = z.string().trim().max(120)
const optionalShort = short.optional().or(z.literal(''))
const optionalLong = z.string().trim().max(2000).optional().or(z.literal(''))

export const SUSPENSION_OPTIONS = [
  { value: 'stock', label: 'Stock' },
  { value: 'springs', label: 'Lowering springs' },
  { value: 'coilovers', label: 'Coilovers' },
  { value: 'air', label: 'Air suspension' },
  { value: 'lifted', label: 'Lifted' },
] as const

export const CONSTRUCTION_OPTIONS = [
  { value: '', label: 'Recommend for me' },
  { value: 'Monoblock', label: 'Monoblock' },
  { value: 'Two-piece', label: 'Two-piece' },
  { value: 'Three-piece', label: 'Three-piece' },
  { value: 'Beadlock', label: 'Beadlock' },
  { value: 'Beadlock rear only', label: 'Beadlock rear only' },
] as const

export const FINISH_OPTIONS = [
  { value: '', label: 'Recommend for me' },
  { value: 'Gloss Black', label: 'Gloss Black' },
  { value: 'Matte Black', label: 'Matte Black' },
  { value: 'Brushed Aluminium', label: 'Brushed Aluminium' },
  { value: 'High Polish', label: 'High Polish' },
  { value: 'Chrome', label: 'Chrome' },
  { value: 'Carbon Fibre accents', label: 'Carbon Fibre accents' },
  { value: 'Custom Colour', label: 'Custom Colour (describe in notes)' },
] as const

const spec = z.object({
  diameter: optionalShort,
  width: optionalShort,
  offset: optionalShort,
})

export const orderSchema = z
  .object({
    name: short.min(1, 'Name is required'),
    email: z.string().trim().email('Valid email is required'),
    phone: optionalShort,
    city: optionalShort,
    region: optionalShort,
    country: optionalShort,

    vehicleYear: short.min(1, 'Year is required'),
    vehicleMake: short.min(1, 'Make is required'),
    vehicleModel: short.min(1, 'Model is required'),
    vehicleTrim: optionalShort,

    suspension: z.enum(['stock', 'springs', 'coilovers', 'air', 'lifted']),
    bigBrakeKit: z.boolean(),
    brakeDetails: optionalShort,
    widebody: z.boolean(),
    currentTires: optionalShort,
    otherMods: optionalLong,

    wheelId: optionalShort,
    designNotes: optionalLong,
    construction: optionalShort,
    finish: optionalShort,

    specMode: z.enum(['custom', 'recommend']),
    staggered: z.boolean(),
    front: spec,
    rear: spec,
    boltPattern: optionalShort,
    centreBore: optionalShort,
    quantity: z.number().int().min(1).max(8),
    lipEngraving: optionalShort,
    centreCaps: optionalShort,
    budget: optionalShort,
    neededBy: optionalShort,
    notes: optionalLong,
    /** Dealer portal only: the dealer's own reference for their end customer. */
    customerRef: optionalShort,

    agree: z.literal(true, { message: 'Please confirm to continue' }),
    /** Honeypot: real visitors never see or fill this field. */
    website: z.string().max(500).optional(),
  })
  // Required sizes when the customer supplies their own specs. `when` makes these run even if
  // other fields are invalid, so every error shows on the first submit.
  .refine((d) => d.specMode !== 'custom' || Boolean(d.front?.diameter), {
    path: ['front', 'diameter'],
    message: 'Diameter is required',
    when: () => true,
  })
  .refine((d) => d.specMode !== 'custom' || Boolean(d.front?.width), {
    path: ['front', 'width'],
    message: 'Width is required',
    when: () => true,
  })
  .refine((d) => d.specMode !== 'custom' || !d.staggered || Boolean(d.rear?.diameter), {
    path: ['rear', 'diameter'],
    message: 'Diameter is required',
    when: () => true,
  })
  .refine((d) => d.specMode !== 'custom' || !d.staggered || Boolean(d.rear?.width), {
    path: ['rear', 'width'],
    message: 'Width is required',
    when: () => true,
  })

export type OrderFormValues = z.input<typeof orderSchema>
export type OrderData = z.output<typeof orderSchema>
