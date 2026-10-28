import type { Access, CollectionConfig } from 'payload'
import { isStaffUser, staffOnly } from '../access/roles'
import { ORDER_PHOTO_STAGES, ORDER_STATUS_OPTIONS } from '../lib/orderStatus'
import { computeBilling, PAYMENT_STATUS_OPTIONS } from '../lib/orderBilling'

/** Order references look like UEF-2611-7K3Q (year+month, then 4 random characters). */
function generateOrderNumber(): string {
  const now = new Date()
  const yymm = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, '0')}`
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let suffix = ''
  for (let i = 0; i < 4; i++) suffix += alphabet[Math.floor(Math.random() * alphabet.length)]
  return `UEF-${yymm}-${suffix}`
}

const specFields = [
  { name: 'diameter', type: 'text' as const },
  { name: 'width', type: 'text' as const },
  { name: 'offset', type: 'text' as const },
]

/** Staff see every order; a signed-in dealer sees only orders placed under their account. */
const staffOrOwnDealer: Access = ({ req }) => {
  if (isStaffUser(req)) return true
  if (req.user?.collection === 'dealers') return { dealer: { equals: req.user.id } }
  return false
}

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'name', 'vehicleSummary', 'dealer', 'status', 'paymentStatus', 'balanceDue', 'createdAt'],
    description: 'Orders placed through the /order page on the website.',
  },
  access: {
    read: staffOrOwnDealer,
    // Website and dealer orders are saved server-side by submitOrder (Local API), not through REST.
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  hooks: {
    // Dealers never receive internal staff notes, whether through the portal or the API.
    afterRead: [
      ({ doc, req, context }) => {
        // Server code that rewrites the comments array (e.g. a dealer reply) opts in to the full list.
        if (context?.includeInternalComments) return doc
        if (!isStaffUser(req)) {
          if (Array.isArray(doc?.comments)) {
            doc.comments = doc.comments.filter((c: { internal?: boolean }) => !c.internal)
          }
          if (Array.isArray(doc?.photos)) {
            doc.photos = doc.photos.filter((p: { internal?: boolean }) => !p.internal)
          }
        }
        return doc
      },
    ],
    // Give each photo file the order's dealer, so only that dealer (and staff) can open it.
    // Internal photos get no dealer, so dealers can't open them even with the file link.
    afterChange: [
      async ({ doc, req }) => {
        const photos = (doc.photos ?? []) as { image?: string | { id: string }; internal?: boolean }[]
        const dealerId = typeof doc.dealer === 'object' && doc.dealer ? doc.dealer.id : (doc.dealer ?? null)
        for (const p of photos) {
          const id = typeof p.image === 'object' && p.image ? p.image.id : p.image
          if (!id) continue
          await req.payload.update({
            collection: 'order-media',
            id,
            data: { order: doc.id, dealer: p.internal ? null : dealerId },
            req,
          })
        }
        return doc
      },
    ],
    beforeChange: [
      ({ data, operation, req, originalDoc }) => {
        // Recalculate pricing whenever billing or costs change. Totals are stored so the
        // admin list and dealer portal can show them without recomputing.
        if (data.billing || data.costs) {
          const billing = { ...(originalDoc?.billing ?? {}), ...(data.billing ?? {}) }
          const result = computeBilling(billing)
          data.billing = {
            ...billing,
            lineItems: result.lineItems,
            subtotal: result.subtotal,
            taxAmount: result.taxAmount,
            total: result.total,
            amountPaid: result.amountPaid,
            balanceDue: result.balanceDue,
          }
          data.paymentStatus = result.paymentStatus
          data.balanceDue = result.balanceDue
          const costs = { ...(originalDoc?.costs ?? {}), ...(data.costs ?? {}) }
          const totalCost = ['supplierCost', 'freightCost', 'otherCost'].reduce(
            (sum, k) => sum + (Number(costs[k]) || 0),
            0,
          )
          const net = result.total - result.taxAmount
          data.costs = {
            ...costs,
            totalCost: Math.round(totalCost * 100) / 100,
            margin: Math.round((net - totalCost) * 100) / 100,
            marginPercent: net > 0 ? Math.round(((net - totalCost) / net) * 1000) / 10 : null,
          }
        }
        // Stamp new comments. Dealer comments arrive with author 'dealer' from the portal;
        // anything added in the admin panel is from UEForged staff.
        if (Array.isArray(data.comments)) {
          data.comments = data.comments.map((c: Record<string, unknown>) => {
            if (c.createdAt) return c
            const fromStaff = c.author !== 'dealer' && isStaffUser(req)
            return {
              ...c,
              author: fromStaff ? 'staff' : c.author ?? 'staff',
              authorName: c.authorName ?? (fromStaff ? 'UEForged' : undefined),
              createdAt: new Date().toISOString(),
            }
          })
        }
        if (Array.isArray(data.photos)) {
          data.photos = data.photos.map((p: Record<string, unknown>) =>
            p.addedAt ? p : { ...p, addedAt: new Date().toISOString() },
          )
        }
        if (operation === 'create' && !data.orderNumber) {
          data.orderNumber = generateOrderNumber()
        }
        const v = data.vehicle
        if (v) {
          data.vehicleSummary = [v.year, v.make, v.model, v.trim].filter(Boolean).join(' ')
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      unique: true,
      index: true,
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: ORDER_STATUS_OPTIONS.map(({ label, value }) => ({ label, value })),
      admin: { position: 'sidebar' },
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'website',
      options: [
        { label: 'Website', value: 'website' },
        { label: 'Dealer portal', value: 'dealer' },
      ],
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'dealer',
      type: 'relationship',
      relationTo: 'dealers',
      hasMany: false,
      admin: { readOnly: true, position: 'sidebar', description: 'Set when a dealer places the order' },
    },
    {
      name: 'customerRef',
      type: 'text',
      label: 'Dealer’s customer reference',
      admin: { position: 'sidebar' },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'not_quoted',
      options: PAYMENT_STATUS_OPTIONS.map(({ label, value }) => ({ label, value })),
      admin: { readOnly: true, position: 'sidebar', description: 'Calculated from Pricing & payments' },
    },
    {
      name: 'balanceDue',
      type: 'number',
      label: 'Balance due',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'vehicleSummary',
      type: 'text',
      admin: { readOnly: true, position: 'sidebar' },
    },

    // Customer
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    {
      name: 'shipTo',
      type: 'group',
      label: 'Ship to',
      fields: [
        { name: 'city', type: 'text' },
        { name: 'region', type: 'text', label: 'Province / State' },
        { name: 'country', type: 'text' },
      ],
    },

    // Vehicle
    {
      name: 'vehicle',
      type: 'group',
      fields: [
        { name: 'year', type: 'text', required: true },
        { name: 'make', type: 'text', required: true },
        { name: 'model', type: 'text', required: true },
        { name: 'trim', type: 'text', label: 'Trim / chassis code' },
      ],
    },
    {
      name: 'modifications',
      type: 'group',
      fields: [
        {
          name: 'suspension',
          type: 'select',
          options: [
            { label: 'Stock', value: 'stock' },
            { label: 'Lowering springs', value: 'springs' },
            { label: 'Coilovers', value: 'coilovers' },
            { label: 'Air suspension', value: 'air' },
            { label: 'Lifted', value: 'lifted' },
          ],
        },
        { name: 'bigBrakeKit', type: 'checkbox', label: 'Big brake kit fitted' },
        { name: 'brakeDetails', type: 'text', label: 'Brake kit details' },
        { name: 'widebody', type: 'checkbox', label: 'Widebody / wider arches' },
        { name: 'currentTires', type: 'text', label: 'Current tyre sizes' },
        { name: 'other', type: 'textarea', label: 'Other relevant modifications' },
      ],
    },

    // Wheel
    {
      name: 'wheel',
      type: 'relationship',
      relationTo: 'wheels',
      hasMany: false,
      admin: { description: 'Design chosen by the customer, if any' },
    },
    {
      name: 'designNotes',
      type: 'textarea',
      admin: { description: 'Custom design request or reference, if no catalog design was chosen' },
    },
    { name: 'construction', type: 'text' },
    { name: 'finish', type: 'text' },
    {
      name: 'specMode',
      type: 'select',
      required: true,
      defaultValue: 'recommend',
      label: 'Specs',
      options: [
        { label: 'Customer supplied specs', value: 'custom' },
        { label: 'UEForged to recommend specs', value: 'recommend' },
      ],
    },
    { name: 'staggered', type: 'checkbox' },
    { name: 'front', type: 'group', label: 'Front wheel specs', fields: specFields },
    { name: 'rear', type: 'group', label: 'Rear wheel specs', fields: specFields },
    { name: 'boltPattern', type: 'text' },
    { name: 'centreBore', type: 'text' },
    { name: 'quantity', type: 'number', defaultValue: 4, min: 1, max: 8 },
    { name: 'lipEngraving', type: 'text' },
    { name: 'centreCaps', type: 'text' },
    { name: 'budget', type: 'text' },
    { name: 'neededBy', type: 'text', label: 'Needed by' },
    { name: 'notes', type: 'textarea' },
    {
      name: 'billing',
      type: 'group',
      label: 'Pricing & payments',
      admin: {
        description:
          'Shown to the dealer on their order page. Totals, tax and balance are calculated when you save.',
      },
      fields: [
        {
          name: 'currency',
          type: 'select',
          defaultValue: 'USD',
          options: [
            { label: 'USD', value: 'USD' },
            { label: 'CAD', value: 'CAD' },
          ],
        },
        {
          name: 'lineItems',
          type: 'array',
          labels: { singular: 'Line item', plural: 'Line items' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'description', type: 'text', required: true, admin: { width: '50%' } },
                { name: 'quantity', type: 'number', defaultValue: 1, min: 0, admin: { width: '15%' } },
                { name: 'unitPrice', type: 'number', label: 'Unit price', required: true, admin: { width: '17.5%' } },
                { name: 'lineTotal', type: 'number', label: 'Line total', admin: { readOnly: true, width: '17.5%' } },
              ],
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'discount', type: 'number', min: 0, admin: { width: '25%', description: 'Amount off the subtotal' } },
            { name: 'shipping', type: 'number', min: 0, admin: { width: '25%' } },
            { name: 'taxRate', type: 'number', label: 'Tax rate (%)', min: 0, max: 30, admin: { width: '25%', description: 'e.g. 5 for GST, 12 for GST + BC PST' } },
            { name: 'depositRequired', type: 'number', label: 'Deposit required', min: 0, admin: { width: '25%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'subtotal', type: 'number', admin: { readOnly: true, width: '20%' } },
            { name: 'taxAmount', type: 'number', label: 'Tax', admin: { readOnly: true, width: '20%' } },
            { name: 'total', type: 'number', admin: { readOnly: true, width: '20%' } },
            { name: 'amountPaid', type: 'number', label: 'Paid', admin: { readOnly: true, width: '20%' } },
            { name: 'balanceDue', type: 'number', label: 'Balance due', admin: { readOnly: true, width: '20%' } },
          ],
        },
        {
          name: 'payments',
          type: 'array',
          labels: { singular: 'Payment', plural: 'Payments received' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'date', type: 'date', required: true, admin: { width: '25%', date: { pickerAppearance: 'dayOnly' } } },
                { name: 'amount', type: 'number', required: true, admin: { width: '20%' } },
                {
                  name: 'method',
                  type: 'select',
                  options: ['E-transfer', 'Wire / T/T', 'Credit card', 'PayPal', 'Cash', 'Cheque', 'Other'].map((m) => ({ label: m, value: m })),
                  admin: { width: '25%' },
                },
                { name: 'reference', type: 'text', admin: { width: '30%' } },
              ],
            },
          ],
        },
        {
          name: 'paymentInstructions',
          type: 'textarea',
          admin: { description: 'Shown to the dealer, e.g. how to pay the deposit or balance.' },
        },
      ],
    },
    {
      name: 'costs',
      type: 'group',
      label: 'Internal costs (staff only)',
      // Never sent to dealers, through the portal or the API.
      access: { read: ({ req }) => isStaffUser(req) },
      admin: { description: 'Your costs and margin. Hidden from dealers.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'supplierCost', type: 'number', label: 'Supplier cost', admin: { width: '25%' } },
            { name: 'freightCost', type: 'number', label: 'Freight / duties', admin: { width: '25%' } },
            { name: 'otherCost', type: 'number', label: 'Other costs', admin: { width: '25%' } },
            { name: 'totalCost', type: 'number', label: 'Total cost', admin: { readOnly: true, width: '25%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'margin', type: 'number', label: 'Margin (before tax)', admin: { readOnly: true, width: '50%' } },
            { name: 'marginPercent', type: 'number', label: 'Margin %', admin: { readOnly: true, width: '50%' } },
          ],
        },
        { name: 'costNotes', type: 'textarea', label: 'Cost notes' },
      ],
    },
    {
      name: 'photos',
      type: 'array',
      labels: { singular: 'Photo', plural: 'Photos' },
      admin: {
        description:
          'Renderings, production and finished photos. Dealers see these on their order page, grouped by stage. Tick "Internal" to keep a photo staff-only.',
      },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'order-media', required: true },
        {
          type: 'row',
          fields: [
            {
              name: 'stage',
              type: 'select',
              required: true,
              defaultValue: 'production',
              options: ORDER_PHOTO_STAGES.map(({ label, value }) => ({ label, value })),
              admin: { width: '25%' },
            },
            { name: 'caption', type: 'text', admin: { width: '40%' } },
            {
              name: 'addedAt',
              type: 'date',
              label: 'Added',
              admin: { readOnly: true, width: '20%', date: { pickerAppearance: 'dayAndTime' } },
            },
            {
              name: 'internal',
              type: 'checkbox',
              label: 'Internal',
              defaultValue: false,
              admin: { width: '15%' },
            },
          ],
        },
      ],
    },
    {
      name: 'comments',
      type: 'array',
      label: 'Comments',
      labels: { singular: 'Comment', plural: 'Comments' },
      admin: {
        description:
          'Conversation with the dealer, shown on their order page. Add a row to reply. Tick "Internal" to hide a note from the dealer.',
      },
      fields: [
        { name: 'message', type: 'textarea', required: true },
        {
          type: 'row',
          fields: [
            {
              name: 'author',
              type: 'select',
              defaultValue: 'staff',
              options: [
                { label: 'UEForged', value: 'staff' },
                { label: 'Dealer', value: 'dealer' },
              ],
              admin: { readOnly: true, width: '25%' },
            },
            { name: 'authorName', type: 'text', label: 'Name', admin: { readOnly: true, width: '25%' } },
            {
              name: 'createdAt',
              type: 'date',
              label: 'Posted',
              admin: { readOnly: true, width: '25%', date: { pickerAppearance: 'dayAndTime' } },
            },
            {
              name: 'internal',
              type: 'checkbox',
              label: 'Internal (hidden from dealer)',
              defaultValue: false,
              admin: { width: '25%' },
            },
          ],
        },
      ],
    },
  ],
}
