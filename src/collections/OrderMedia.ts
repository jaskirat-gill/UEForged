import path from 'path'
import type { Access, CollectionConfig } from 'payload'
import { isStaffUser, staffOnly } from '../access/roles'

/**
 * Private photos attached to orders (renderings, production, finished product).
 * Kept apart from the public Media collection: files are served only to staff and to the dealer
 * who owns the order. `dealer` is kept in sync by the Orders afterChange hook.
 */
const staffOrOwningDealer: Access = ({ req }) => {
  if (isStaffUser(req)) return true
  if (req.user?.collection === 'dealers') return { dealer: { equals: req.user.id } }
  return false
}

export const OrderMedia: CollectionConfig = {
  slug: 'order-media',
  labels: { singular: 'Order photo', plural: 'Order photos' },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'order', 'dealer', 'createdAt'],
    description: 'Upload these from an order’s Photos section. Only staff and the order’s dealer can see them.',
  },
  access: {
    read: staffOrOwningDealer,
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  upload: {
    staticDir: path.join(process.cwd(), 'media', 'orders'),
    mimeTypes: ['image/*'],
  },
  fields: [
    { name: 'alt', type: 'text' },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'dealer',
      type: 'relationship',
      relationTo: 'dealers',
      admin: { readOnly: true, position: 'sidebar', description: 'Set automatically from the order' },
    },
  ],
}
