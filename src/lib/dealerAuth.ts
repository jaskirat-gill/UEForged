import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Dealer } from '@/payload-types'

/** The signed-in dealer for this request, or null (not signed in, staff, or deactivated). */
export async function getCurrentDealer(): Promise<Dealer | null> {
  const payload = await getPayload({ config: await config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.collection !== 'dealers') return null
  const dealer = user as unknown as Dealer
  return dealer.active === false ? null : dealer
}
