/**
 * Migrate media from local disk to Vercel Blob.
 *
 * Run from project root with BLOB_READ_WRITE_TOKEN and DATABASE_URL set:
 *   pnpm exec tsx src/scripts/migrate-media-to-vercel-blob.ts
 *
 * Expects local files in ./media/ (or set LOCAL_MEDIA_DIR). Skips docs that
 * already have a Blob URL. Updates each media doc with the new url.
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import { put } from '@vercel/blob'
import config from '../payload.config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '../..')
const defaultMediaDir = path.join(projectRoot, 'media')

function isBlobUrl(url: string | null | undefined): boolean {
  if (!url) return false
  return url.includes('blob.vercel-storage.com')
}

async function run() {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    console.error('Missing BLOB_READ_WRITE_TOKEN. Set it in .env or the environment.')
    process.exit(1)
  }

  const localDir = process.env.LOCAL_MEDIA_DIR || defaultMediaDir
  if (!fs.existsSync(localDir)) {
    console.error(`Local media directory not found: ${localDir}`)
    process.exit(1)
  }

  const payload = await getPayload({ config: await config })
  const result = await payload.find({
    collection: 'media',
    limit: 500,
    depth: 0,
  })

  const docs = result.docs
  if (docs.length === 0) {
    console.log('No media documents found.')
    return
  }

  let migrated = 0
  let skipped = 0
  let failed = 0

  for (const doc of docs) {
    const filename = doc.filename
    if (!filename) {
      console.warn(`[${doc.id}] No filename, skipping`)
      skipped++
      continue
    }

    if (isBlobUrl(doc.url)) {
      console.log(`[${doc.id}] ${filename} – already on Blob, skipping`)
      skipped++
      continue
    }

    const localPath = path.join(localDir, filename)
    if (!fs.existsSync(localPath)) {
      console.warn(`[${doc.id}] ${filename} – file not found at ${localPath}, skipping`)
      failed++
      continue
    }

    try {
      const buffer = fs.readFileSync(localPath)
      const fileKey = path.posix.join('media', filename)
      const blobResult = await put(fileKey, buffer, {
        access: 'public',
        contentType: doc.mimeType || undefined,
        token,
      })

      await payload.update({
        collection: 'media',
        id: doc.id,
        data: { url: blobResult.url },
      })

      console.log(`[${doc.id}] ${filename} → ${blobResult.url}`)
      migrated++
    } catch (err) {
      console.error(`[${doc.id}] ${filename} –`, err instanceof Error ? err.message : err)
      failed++
    }
  }

  console.log('\nDone:', { migrated, skipped, failed })
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
