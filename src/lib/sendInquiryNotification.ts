import type { Payload } from 'payload'

export type InquiryNotificationSummary = {
  name: string
  email: string
  phone?: string | null
  carDetails?: {
    make?: string | null
    model?: string | null
    year?: string | null
  }
  wheelName?: string
  frontSpecs?: { diameter?: string; width?: string; offset?: string }
  rearSpecs?: { diameter?: string; width?: string; offset?: string }
  construction?: string | null
  beadlock?: string | null
  estimatedPricePerWheel?: number | null
  estimatedSetPrice?: number | null
  notes?: string | null
}

function formatCar(car?: InquiryNotificationSummary['carDetails']): string {
  if (!car) return '—'
  const parts = [car.year, car.make, car.model].filter(Boolean)
  return parts.length ? parts.join(' ') : '—'
}

function formatSpecs(specs?: InquiryNotificationSummary['frontSpecs']): string {
  if (!specs) return '—'
  const parts = [specs.diameter, specs.width, specs.offset].filter(Boolean)
  return parts.length ? parts.join(' × ') : '—'
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function sendInquiryNotification(
  payload: Payload,
  summary: InquiryNotificationSummary,
): Promise<void> {
  const settings = await payload.findGlobal({ slug: 'site-settings' })
  const contactEmail = settings?.contactEmail as string | undefined
  if (!contactEmail?.trim()) {
    console.warn(
      '[sendInquiryNotification] No contact email configured. Set "Primary contact email for inquiries" in Payload Admin → Globals → Site Settings. No notification email sent.',
    )
    return
  }

  const subject = `New inquiry from ${summary.name}`

  const isWheelInquiry =
    Boolean(summary.wheelName) ||
    Boolean(summary.frontSpecs) ||
    summary.estimatedPricePerWheel != null ||
    summary.estimatedSetPrice != null

  const rows: [string, string][] = [
    ['Name', summary.name],
    ['Email', summary.email],
    ['Phone', summary.phone || '—'],
    ['Car', formatCar(summary.carDetails)],
  ]

  if (summary.wheelName) rows.push(['Wheel', summary.wheelName])
  if (summary.frontSpecs) {
    rows.push(['Front specs', formatSpecs(summary.frontSpecs)])
  }
  if (summary.rearSpecs) {
    rows.push(['Rear specs', formatSpecs(summary.rearSpecs)])
  }
  if (summary.construction) {
    rows.push(['Construction', summary.construction])
  }
  if (summary.beadlock && summary.beadlock !== 'none') {
    rows.push(['Beadlock', summary.beadlock])
  }
  if (summary.estimatedPricePerWheel != null) {
    rows.push([
      'Est. per wheel',
      '$' + summary.estimatedPricePerWheel.toLocaleString(),
    ])
  }
  if (summary.estimatedSetPrice != null) {
    rows.push(['Est. set', '$' + summary.estimatedSetPrice.toLocaleString()])
  }
  if (summary.notes) rows.push(['Notes', summary.notes])

  const tableRows = rows
    .map(
      ([label, value]) =>
        '<tr><td style="padding:6px 12px 6px 0;vertical-align:top;font-weight:600;">' +
        escapeHtml(label) +
        '</td><td style="padding:6px 0;">' +
        escapeHtml(String(value)) +
        '</td></tr>',
    )
    .join('')

  const html =
    '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#333;">' +
    '<p>You received a new ' +
    (isWheelInquiry ? 'wheel ' : '') +
    'inquiry from the website.</p>' +
    '<table style="border-collapse:collapse;">' +
    tableRows +
    '</table>' +
    '<p style="margin-top:16px;font-size:14px;color:#666;">Reply to: <a href="mailto:' +
    escapeHtml(summary.email) +
    '">' +
    escapeHtml(summary.email) +
    '</a></p></body></html>'

  await payload.sendEmail({
    to: contactEmail,
    subject,
    html,
  })
  console.log(`[sendInquiryNotification] Email sent to ${contactEmail} re: ${summary.name}`)
}
