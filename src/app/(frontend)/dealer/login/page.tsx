import React from 'react'
import { redirect } from 'next/navigation'
import { getCurrentDealer } from '@/lib/dealerAuth'
import { LoginForm } from './LoginForm'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Dealer Login',
  robots: { index: false, follow: false },
}

export default async function DealerLoginPage() {
  if (await getCurrentDealer()) redirect('/dealer')

  return (
    <div className="pt-20 min-h-screen flex items-center">
      <div className="w-full max-w-md mx-auto px-6 py-24">
        <p className="font-body text-xs uppercase tracking-[0.4em] text-gold">Authorized dealers</p>
        <h1 className="mt-4 font-display text-5xl tracking-widest text-text uppercase">Dealer login</h1>
        <p className="mt-4 font-body text-sm text-text-muted">
          Sign in with the username and password UEForged gave you. Need access or a password reset? Contact
          your UEForged representative.
        </p>
        <div className="mt-10 border border-border bg-surface p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
