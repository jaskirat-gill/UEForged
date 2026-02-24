import type { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'wheelInterest', 'status', 'createdAt'],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'carDetails',
      type: 'group',
      label: 'Car Details',
      fields: [
        {
          name: 'make',
          type: 'text',
        },
        {
          name: 'model',
          type: 'text',
        },
        {
          name: 'year',
          type: 'text',
        },
      ],
    },
    {
      name: 'wheelInterest',
      type: 'relationship',
      relationTo: 'wheels',
      hasMany: false,
      admin: {
        description: 'Wheel series or specific wheel of interest',
      },
    },
    {
      name: 'finishPreference',
      type: 'text',
    },
    {
      name: 'boltPattern',
      type: 'text',
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'frontSpecs',
      type: 'group',
      label: 'Front Wheel Specs',
      fields: [
        { name: 'diameter', type: 'text' },
        { name: 'width', type: 'text' },
        { name: 'offset', type: 'text' },
      ],
    },
    {
      name: 'rearSpecs',
      type: 'group',
      label: 'Rear Wheel Specs',
      fields: [
        { name: 'diameter', type: 'text' },
        { name: 'width', type: 'text' },
        { name: 'offset', type: 'text' },
      ],
    },
    {
      name: 'construction',
      type: 'text',
      admin: {
        description: 'Construction type (e.g. monoblock, modular). Options come from Wheel Pricing.',
      },
    },
    {
      name: 'beadlock',
      type: 'text',
      admin: {
        description: 'Beadlock option (e.g. none, beadlock, rear_only). Options come from Wheel Pricing.',
      },
    },
    {
      name: 'estimatedPricePerWheel',
      type: 'number',
      label: 'Estimated price per wheel',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'estimatedSetPrice',
      type: 'number',
      label: 'Estimated set price',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Quoted', value: 'quoted' },
        { label: 'Closed', value: 'closed' },
      ],
      defaultValue: 'new',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
