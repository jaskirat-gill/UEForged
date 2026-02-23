import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heroHeadline',
      type: 'text',
      defaultValue: 'FORGED TO PERFORM',
      admin: {
        description: 'Main hero headline',
      },
    },
    {
      name: 'heroSubtext',
      type: 'text',
      admin: {
        description: 'Optional subtext below headline',
      },
    },
    {
      name: 'heroMedia',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Hero background image or video thumbnail',
      },
    },
    {
      name: 'featuredWheelsBackground',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Background image for Featured Wheels section' },
    },
    {
      name: 'aboutBackground',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Background image for Why Forged section' },
    },
    {
      name: 'testimonialsBackground',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Background image for Testimonials section' },
    },
    {
      name: 'ctaBackground',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Background image for CTA / Your Build Starts Here section' },
    },
    {
      name: 'showcaseMedia',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Image for scroll parallax showcase (e.g. wheel close-up)' },
    },
    {
      name: 'statsTickerText',
      type: 'text',
      admin: {
        description: 'Optional stats or tagline for ticker bar',
      },
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'text',
          required: true,
          admin: { description: 'e.g. Instagram, Facebook' },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'contactEmail',
      type: 'email',
      admin: {
        description: 'Primary contact email for inquiries',
      },
    },
  ],
}
