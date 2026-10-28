'use client'

import React, { useActionState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { loginDealer, type DealerLoginState } from '../actions'

const initialState: DealerLoginState = { error: null }

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginDealer, initialState)

  return (
    <form action={formAction} className="space-y-6">
      <Input
        id="dealer-username"
        name="username"
        label="Username or email"
        autoComplete="username"
        defaultValue={state.username}
        key={state.username ?? ''}
        required
      />
      <Input
        id="dealer-password"
        name="password"
        type="password"
        label="Password"
        autoComplete="current-password"
        required
      />
      {state.error && (
        <p role="alert" className="font-body text-sm text-red-500">
          {state.error}
        </p>
      )}
      <Button type="submit" variant="primary" disabled={pending} className="w-full">
        {pending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}
