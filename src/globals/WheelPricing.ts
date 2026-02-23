import type { GlobalConfig } from 'payload'

export const WheelPricing: GlobalConfig = {
  slug: 'wheel-pricing',
  label: 'Wheel Pricing Rules',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'diameterOptions',
      type: 'array',
      label: 'Front/Rear Diameter Options',
      admin: {
        description: 'Per-wheel price adjustments by diameter (e.g. 19\", 20\", 21\").',
      },
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
      label: 'Front/Rear Width Options',
      admin: {
        description: 'Per-wheel price adjustments by width (e.g. 9\", 10.5\").',
      },
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
      label: 'Construction Options',
      admin: {
        description: 'Monoblock vs modular construction pricing.',
      },
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
      label: 'Beadlock Options',
      admin: {
        description: 'Beadlock options (Beadlock, No beadlock, Rear only).',
      },
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
}

