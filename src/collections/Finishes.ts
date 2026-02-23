import type { CollectionConfig } from 'payload'

export const Finishes: CollectionConfig = {
  slug: 'finishes',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  access: {
    read: () => true,
  },
  fields: [
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
        description: 'URL-friendly identifier (e.g. gloss-black, matte-bronze)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'hex',
      type: 'text',
      admin: {
        description: 'Hex color code for swatch preview (e.g. #C9A84C)',
      },
    },
    {
      name: 'swatchImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional swatch image',
      },
    },
  ],
}
