'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { generatePayloadCookie } from 'payload/shared'
import config from '@/payload.config'

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
