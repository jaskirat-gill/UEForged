'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { orderSchema, SUSPENSION_OPTIONS, type OrderFormValues } from '@/lib/orderSchema'
import { sendOrderNotification } from '@/lib/sendOrderNotification'
import { getCurrentDealer } from '@/lib/dealerAuth'

const formatSpec = (s: { diameter?: string; width?: string; offset?: string }) =>
  [s.diameter && `${s.diameter}"`, s.width && `${s.width}J`, s.offset && `ET${s.offset}`]
    .filter(Boolean)
    .join(' × ')

export async function submitOrder(
  input: OrderFormValues,
): Promise<{ ok: true; orderNumber: string } | { ok: false; error: string }> {
  const parsed = orderSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'Some details are missing or invalid. Please check the form.' }
  }
  const d = parsed.data

  // Honeypot filled in: pretend success so bots get no signal.
  if (d.website) return { ok: true, orderNumber: 'UEF-RECEIVED' }

  try {
    const payload = await getPayload({ config: await config })
    // The dealer comes from the login session, never from the form.
    const dealer = await getCurrentDealer()

    let wheelName: string | undefined
    if (d.wheelId) {
      const wheel = await payload.findByID({ collection: 'wheels', id: d.wheelId, depth: 0 }).catch(() => null)
      wheelName = wheel?.name
    }
    const rear = d.staggered ? d.rear : d.front

    const order = await payload.create({
      collection: 'orders',
      data: {
        status: 'new',
        source: dealer ? 'dealer' : 'website',
        dealer: dealer?.id,
        customerRef: dealer ? d.customerRef || undefined : undefined,
        name: d.name,
        email: d.email,
        phone: d.phone || undefined,
        shipTo: { city: d.city || undefined, region: d.region || undefined, country: d.country || undefined },
        vehicle: {
          year: d.vehicleYear,
          make: d.vehicleMake,
          model: d.vehicleModel,
          trim: d.vehicleTrim || undefined,
        },
        modifications: {
          suspension: d.suspension,
          bigBrakeKit: d.bigBrakeKit,
          brakeDetails: d.brakeDetails || undefined,
          widebody: d.widebody,
          currentTires: d.currentTires || undefined,
          other: d.otherMods || undefined,
        },
        wheel: wheelName ? d.wheelId : undefined,
        designNotes: d.designNotes || undefined,
        construction: d.construction || undefined,
        finish: d.finish || undefined,
        specMode: d.specMode,
        staggered: d.specMode === 'custom' ? d.staggered : undefined,
        front: d.specMode === 'custom' ? d.front : undefined,
        rear: d.specMode === 'custom' ? rear : undefined,
        boltPattern: d.boltPattern || undefined,
        centreBore: d.centreBore || undefined,
        quantity: d.quantity,
        lipEngraving: d.lipEngraving || undefined,
        centreCaps: d.centreCaps || undefined,
        budget: d.budget || undefined,
        neededBy: d.neededBy || undefined,
        notes: d.notes || undefined,
      },
    })
    const orderNumber = order.orderNumber as string

    const suspension = SUSPENSION_OPTIONS.find((o) => o.value === d.suspension)?.label ?? d.suspension
    await sendOrderNotification(payload, {
      orderNumber,
      name: d.name,
      email: d.email,
      rows: [
        ['Order', orderNumber],
        ['Dealer', dealer ? `${dealer.companyName} (${dealer.username ?? dealer.email ?? ''})` : ''],
        ['Customer ref', dealer ? d.customerRef ?? '' : ''],
        ['Name', d.name],
        ['Email', d.email],
        ['Phone', d.phone ?? ''],
        ['Ship to', [d.city, d.region, d.country].filter(Boolean).join(', ')],
        ['Vehicle', [d.vehicleYear, d.vehicleMake, d.vehicleModel, d.vehicleTrim].filter(Boolean).join(' ')],
        ['Suspension', suspension],
        ['Big brake kit', d.bigBrakeKit ? d.brakeDetails || 'Yes' : 'No'],
        ['Widebody', d.widebody ? 'Yes' : 'No'],
        ['Current tyres', d.currentTires ?? ''],
        ['Other mods', d.otherMods ?? ''],
        ['Design', wheelName ?? 'Custom / undecided'],
        ['Design notes', d.designNotes ?? ''],
        ['Construction', d.construction || 'Recommend'],
        ['Finish', d.finish || 'Recommend'],
        ['Specs', d.specMode === 'custom' ? 'Customer supplied' : 'UEForged to recommend'],
        ['Front', d.specMode === 'custom' ? formatSpec(d.front) : ''],
        ['Rear', d.specMode === 'custom' ? formatSpec(rear) : ''],
        ['Bolt pattern', d.boltPattern ?? ''],
        ['Centre bore', d.centreBore ?? ''],
        ['Quantity', String(d.quantity)],
        ['Lip engraving', d.lipEngraving ?? ''],
        ['Centre caps', d.centreCaps ?? ''],
        ['Budget', d.budget ?? ''],
        ['Needed by', d.neededBy ?? ''],
        ['Notes', d.notes ?? ''],
      ],
    }).catch((err) => {
      console.error('[submitOrder] Failed to send notification email:', err)
    })

    return { ok: true, orderNumber }
  } catch (e) {
    console.error('[submitOrder]', e)
    return { ok: false, error: 'We could not place your order just now. Please try again or email us.' }
  }
}
