import type { Access, CollectionConfig } from 'payload'
import { isStaffUser, staffOnly } from '../access/roles'

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
    defaultColumns: ['orderNumber', 'name', 'vehicleSummary', 'wheel', 'dealer', 'status', 'createdAt'],
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
    beforeChange: [
      ({ data, operation }) => {
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
      options: [
        { label: 'New', value: 'new' },
        { label: 'Reviewing fitment', value: 'reviewing' },
        { label: 'Rendering', value: 'rendering' },
        { label: 'Awaiting deposit', value: 'awaiting_deposit' },
        { label: 'In production', value: 'production' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
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
  ],
}
