'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { generatePayloadCookie } from 'payload/shared'
import config from '@/payload.config'
import { getCurrentDealer } from '@/lib/dealerAuth'
import { sendOrderCommentNotification } from '@/lib/sendOrderNotification'

export type DealerLoginState = { error: string | null; username?: string }

export async function loginDealer(_prev: DealerLoginState, formData: FormData): Promise<DealerLoginState> {
  const identifier = String(formData.get('username') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  if (!identifier || !password) return { error: 'Enter your username and password.', username: identifier }

  const payload = await getPayload({ config: await config })
  try {
    const result = await payload.login({
      collection: 'dealers',
      data: identifier.includes('@') ? { email: identifier, password } : { username: identifier, password },
    })
    if (!result.token) return { error: 'Login failed. Please try again.', username: identifier }

    const cookie = generatePayloadCookie({
      collectionAuthConfig: payload.collections.dealers.config.auth,
      cookiePrefix: payload.config.cookiePrefix,
      token: result.token,
      returnCookieAsObject: true,
    })
    ;(await cookies()).set(cookie.name, cookie.value ?? '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: cookie.expires ? new Date(cookie.expires) : undefined,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : ''
    if (message.includes('inactive')) return { error: message, username: identifier }
    return {
      error:
        'Incorrect username or password. After 5 failed attempts the account locks for 15 minutes.',
      username: identifier,
    }
  }

  redirect('/dealer')
}

export async function logoutDealer(): Promise<void> {
  const payload = await getPayload({ config: await config })
  ;(await cookies()).delete(`${payload.config.cookiePrefix}-token`)
  redirect('/dealer/login')
}

export type CommentState = { error: string | null; sent?: number }

/** Adds a dealer comment to one of their own orders. The dealer comes from the session, never the form. */
export async function addDealerComment(
  orderNumber: string,
  prev: CommentState,
  formData: FormData,
): Promise<CommentState> {
  const dealer = await getCurrentDealer()
  if (!dealer) redirect('/dealer/login')

  const message = String(formData.get('message') ?? '').trim()
  if (!message) return { error: 'Write a message first.', sent: prev.sent }
  if (message.length > 2000) return { error: 'Please keep comments under 2,000 characters.', sent: prev.sent }

  const payload = await getPayload({ config: await config })
  const found = await payload.find({
    collection: 'orders',
    where: { and: [{ orderNumber: { equals: orderNumber } }, { dealer: { equals: dealer.id } }] },
    limit: 1,
    depth: 0,
    context: { includeInternalComments: true },
  })
  const order = found.docs[0]
  if (!order) return { error: 'Order not found.', sent: prev.sent }

  const dealerName = dealer.contactName || dealer.companyName
  await payload.update({
    collection: 'orders',
    id: order.id,
    data: { comments: [...(order.comments ?? []), { message, author: 'dealer', authorName: dealerName }] },
    context: { includeInternalComments: true },
  })

  await sendOrderCommentNotification(payload, {
    orderNumber,
    dealerName: `${dealerName} (${dealer.companyName})`,
    message,
  }).catch((err) => console.error('[addDealerComment] Failed to send notification email:', err))

  revalidatePath(`/dealer/orders/${orderNumber}`)
  return { error: null, sent: (prev.sent ?? 0) + 1 }
}
