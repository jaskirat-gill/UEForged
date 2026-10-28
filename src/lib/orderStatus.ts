/** Order status pipeline, in order. Shared by the Orders collection, admin and the dealer portal. */
export const ORDER_STEPS = [
  { value: 'new', label: 'New' },
  { value: 'reviewing', label: 'Reviewing fitment' },
  { value: 'rendering', label: 'Rendering' },
  { value: 'awaiting_deposit', label: 'Awaiting deposit' },
  { value: 'production', label: 'In production' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
] as const

export const ORDER_STATUS_OPTIONS = [...ORDER_STEPS, { value: 'cancelled', label: 'Cancelled' }]

export const orderStatusLabel = (status: string | null | undefined) =>
  ORDER_STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status ?? '—'

/** Index of the status in ORDER_STEPS, or -1 for cancelled/unknown. */
export const orderStepIndex = (status: string | null | undefined) =>
  ORDER_STEPS.findIndex((s) => s.value === status)

/** Stages for order photos, in the order they're shown to dealers. */
export const ORDER_PHOTO_STAGES = [
  { value: 'rendering', label: 'Rendering' },
  { value: 'production', label: 'In production' },
  { value: 'finished', label: 'Finished product' },
  { value: 'other', label: 'Other' },
] as const
