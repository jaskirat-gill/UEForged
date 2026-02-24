import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import 'dotenv/config'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Finishes } from './collections/Finishes'
import { Series } from './collections/Series'
import { Wheels } from './collections/Wheels'
import { Builds } from './collections/Builds'
import { Testimonials } from './collections/Testimonials'
import { Inquiries } from './collections/Inquiries'
import { SiteSettings } from './globals/SiteSettings'
import { WheelPricing } from './globals/WheelPricing'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Finishes, Series, Wheels, Builds, Testimonials, Inquiries],
  globals: [SiteSettings, WheelPricing],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  email: resendAdapter({
    defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'onboarding@resend.dev',
    defaultFromName: process.env.EMAIL_FROM_NAME || 'UEForged',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      // Client uploads bypass Vercel serverless 4.5MB limit by uploading directly from the browser.
      clientUploads: true,
    }),
  ],
})
