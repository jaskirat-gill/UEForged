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
      name: 'specs',
      type: 'group',
      fields: [
        {
          name: 'sizes',
          type: 'array',
          label: 'Sizes Available',
          fields: [
            {
              name: 'size',
              type: 'text',
              required: true,
              admin: { description: 'e.g. 20x9, 21x10.5' },
            },
          ],
        },
        {
          name: 'offsets',
          type: 'array',
          label: 'Offsets',
          fields: [
            {
              name: 'offset',
              type: 'text',
              required: true,
              admin: { description: 'e.g. ET25, ET35' },
            },
          ],
        },
        {
          name: 'finishesAvailable',
          type: 'relationship',
          relationTo: 'finishes',
          hasMany: true,
          label: 'Finishes Available',
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
