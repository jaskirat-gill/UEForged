import type { Payload } from 'payload'

export type OrderNotificationRow = [label: string, value: string]

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function sendOrderNotification(
  payload: Payload,
  order: { orderNumber: string; name: string; email: string; rows: OrderNotificationRow[] },
): Promise<void> {
  const settings = await payload.findGlobal({ slug: 'site-settings' })
  const contactEmail = settings?.contactEmail as string | undefined
  if (!contactEmail?.trim()) {
    console.warn(
      '[sendOrderNotification] No contact email configured in Site Settings. No notification email sent.',
    )
    return
  }

  const tableRows = order.rows
    .filter(([, value]) => value && value.trim())
    .map(
      ([label, value]) =>
        '<tr><td style="padding:6px 12px 6px 0;vertical-align:top;font-weight:600;white-space:nowrap;">' +
        escapeHtml(label) +
        '</td><td style="padding:6px 0;white-space:pre-wrap;">' +
        escapeHtml(value) +
        '</td></tr>',
    )
    .join('')

  const html =
    '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#333;">' +
    '<p>New order <strong>' +
    escapeHtml(order.orderNumber) +
    '</strong> was placed on the website.</p>' +
    '<table style="border-collapse:collapse;">' +
    tableRows +
    '</table>' +
    '<p style="margin-top:16px;font-size:14px;color:#666;">Reply to: <a href="mailto:' +
    escapeHtml(order.email) +
    '">' +
    escapeHtml(order.email) +
    '</a> · Manage it in Admin → Orders.</p></body></html>'

  await payload.sendEmail({
    to: contactEmail,
    subject: `New order ${order.orderNumber} from ${order.name}`,
    html,
  })
}
