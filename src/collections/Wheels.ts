import type { CollectionConfig } from 'payload'

export const Wheels: CollectionConfig = {
  slug: 'wheels',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'series', 'featured'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'startingPricePerWheel',
      type: 'number',
      label: 'Starting price per wheel',
      required: false,
      admin: {
        description: 'Lowest base price per wheel for this design (in USD)',
        position: 'sidebar',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL slug for the wheel (e.g. vfs-1)',
      },
    },
    {
      name: 'series',
      type: 'relationship',
      relationTo: 'series',
      required: true,
      hasMany: false,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'pricingOverrides',
      type: 'group',
      label: 'Pricing overrides',
      admin: {
        description:
          'Override global pricing rules for this wheel. Leave empty to use global Wheel Pricing.',
      },
      fields: [
        {
          name: 'useOverrides',
          type: 'checkbox',
          label: 'Use overrides for this wheel',
          defaultValue: false,
        },
        {
          name: 'diameterOptions',
          type: 'array',
          label: 'Diameter options (overrides)',
          admin: { condition: (_, siblingData) => Boolean(siblingData.useOverrides) },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
            {
              name: 'priceDelta',
              type: 'number',
              label: 'Price delta per wheel',
              required: true,
            },
          ],
        },
        {
          name: 'widthOptions',
          type: 'array',
          label: 'Width options (overrides)',
          admin: { condition: (_, siblingData) => Boolean(siblingData.useOverrides) },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
            {
              name: 'priceDelta',
              type: 'number',
              label: 'Price delta per wheel',
              required: true,
            },
          ],
        },
        {
          name: 'constructionOptions',
          type: 'array',
          label: 'Construction options (overrides)',
          admin: { condition: (_, siblingData) => Boolean(siblingData.useOverrides) },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
            {
              name: 'priceDelta',
              type: 'number',
              label: 'Price delta per wheel',
              required: true,
            },
          ],
        },
        {
          name: 'beadlockOptions',
          type: 'array',
          label: 'Beadlock options (overrides)',
          admin: { condition: (_, siblingData) => Boolean(siblingData.useOverrides) },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
            {
              name: 'priceDelta',
              type: 'number',
              label: 'Price delta per wheel',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'images',
      type: 'array',
      label: 'Gallery',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show on homepage featured section',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
  ],
}
