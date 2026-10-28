/**
 * Order pricing maths, shared by the Orders hook (which stores the results) and tests.
 * All amounts are in the order's currency and rounded to cents.
 */
export type LineItem = { description?: string | null; quantity?: number | null; unitPrice?: number | null; lineTotal?: number | null }
export type Payment = { amount?: number | null }
export type BillingInput = {
  lineItems?: LineItem[] | null
  discount?: number | null
  shipping?: number | null
  taxRate?: number | null
  depositRequired?: number | null
  payments?: Payment[] | null
}
export type PaymentStatus = 'not_quoted' | 'unpaid' | 'deposit_paid' | 'partially_paid' | 'paid' | 'overpaid'

export const PAYMENT_STATUS_OPTIONS: { value: PaymentStatus; label: string }[] = [
  { value: 'not_quoted', label: 'Not quoted yet' },
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'partially_paid', label: 'Partially paid' },
  { value: 'deposit_paid', label: 'Deposit paid' },
  { value: 'paid', label: 'Paid in full' },
  { value: 'overpaid', label: 'Overpaid' },
]

export const paymentStatusLabel = (s?: string | null) =>
  PAYMENT_STATUS_OPTIONS.find((o) => o.value === s)?.label ?? '—'

const cents = (n: number) => Math.round(n * 100) / 100
const num = (n: number | null | undefined) => (typeof n === 'number' && Number.isFinite(n) ? n : 0)

export function computeBilling(b: BillingInput) {
  const lineItems = (b.lineItems ?? []).map((li) => ({
    ...li,
    lineTotal: cents(num(li.quantity ?? 1) * num(li.unitPrice)),
  }))
  const subtotal = cents(lineItems.reduce((s, li) => s + li.lineTotal, 0))
  const taxable = Math.max(subtotal - num(b.discount) + num(b.shipping), 0)
  const taxAmount = cents((taxable * num(b.taxRate)) / 100)
  const total = cents(taxable + taxAmount)
  const amountPaid = cents((b.payments ?? []).reduce((s, p) => s + num(p.amount), 0))
  const balanceDue = cents(total - amountPaid)
  const deposit = num(b.depositRequired)

  let paymentStatus: PaymentStatus
  if (total <= 0) paymentStatus = 'not_quoted'
  else if (amountPaid <= 0) paymentStatus = 'unpaid'
  else if (balanceDue < 0) paymentStatus = 'overpaid'
  else if (balanceDue === 0) paymentStatus = 'paid'
  else if (deposit > 0 && amountPaid >= deposit) paymentStatus = 'deposit_paid'
  else paymentStatus = 'partially_paid'

  return { lineItems, subtotal, taxAmount, total, amountPaid, balanceDue, paymentStatus }
}

export function formatMoney(amount: number | null | undefined, currency: string | null | undefined = 'USD') {
  const cur = currency === 'CAD' ? 'CAD' : 'USD'
  const value = num(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return `${cur === 'CAD' ? 'C$' : '$'}${value} ${cur}`
}
