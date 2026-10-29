import { APIError, type Access, type CollectionConfig } from 'payload'
import { isStaffUser, staffOnly } from '../access/roles'

/** Staff see every dealer; a signed-in dealer can read only their own record. */
const staffOrSelf: Access = ({ req }) => {
  if (isStaffUser(req)) return true
  if (req.user?.collection === 'dealers') return { id: { equals: req.user.id } }
  return false
}

export const Dealers: CollectionConfig = {
  slug: 'dealers',
  labels: { singular: 'Dealer', plural: 'Dealers' },
  admin: {
    useAsTitle: 'companyName',
    defaultColumns: ['companyName', 'username', 'contactName', 'discountPercent', 'active'],
    description:
      'Authorized dealer accounts for the dealer portal at /dealer. Create the username and password here and send them to the dealer.',
  },
  auth: {
    loginWithUsername: { allowEmailLogin: true, requireEmail: false },
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    tokenExpiration: 60 * 60 * 12,
  },
  access: {
    read: staffOrSelf,
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
    unlock: staffOnly,
  },
  hooks: {
    beforeLogin: [
      ({ user }) => {
        if (user?.active === false) {
          throw new APIError('This dealer account is inactive. Please contact UEForged.', 403)
        }
      },
    ],
  },
  fields: [
    { name: 'companyName', type: 'text', required: true },
    { name: 'contactName', type: 'text' },
    { name: 'phone', type: 'text' },
    { name: 'region', type: 'text', admin: { description: 'City, province / state or territory served' } },
    {
      name: 'discountPercent',
      type: 'number',
      label: 'Dealer concession (%)',
      defaultValue: 0,
      min: 0,
      max: 60,
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Percentage off retail list price, applied to this dealer’s prices in the dealer portal.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Untick to block this dealer from logging in.' },
    },
    {
      name: 'notes',
      type: 'textarea',
      access: { read: ({ req }) => isStaffUser(req) },
      admin: { description: 'Internal only. Dealers never see this.' },
    },
  ],
}
