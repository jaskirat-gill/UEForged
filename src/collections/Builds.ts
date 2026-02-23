import type { CollectionConfig } from 'payload'

export const Builds: CollectionConfig = {
  slug: 'builds',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'carMake', 'carModel', 'year', 'featured'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Display title for the build',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'carMake',
      type: 'text',
      required: true,
    },
    {
      name: 'carModel',
      type: 'text',
      required: true,
    },
    {
      name: 'year',
      type: 'number',
      required: true,
    },
    {
      name: 'wheelUsed',
      type: 'relationship',
      relationTo: 'wheels',
      hasMany: false,
    },
    {
      name: 'finish',
      type: 'text',
      admin: {
        description: 'Finish name as shown on this build',
      },
    },
    {
      name: 'photographerCredit',
      type: 'text',
    },
    {
      name: 'images',
      type: 'array',
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
    },
  ],
}
