'use client'

import React, { useActionState } from 'react'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { addDealerComment, type CommentState } from '../../actions'

export function CommentForm({ orderNumber }: { orderNumber: string }) {
  const [state, formAction, pending] = useActionState(
    addDealerComment.bind(null, orderNumber),
    { error: null, sent: 0 } satisfies CommentState,
  )

  return (
    <form action={formAction} className="space-y-4">
      {/* Remount after each successful send so the box clears. */}
      <Textarea
        key={state.sent}
        id="dealer-comment"
        name="message"
        label="Add a comment"
        placeholder="Questions, changes or updates for UEForged…"
        maxLength={2000}
        required
      />
      {state.error && (
        <p role="alert" className="font-body text-sm text-red-500">
          {state.error}
        </p>
      )}
      <Button type="submit" variant="outline" disabled={pending}>
        {pending ? 'Sending…' : 'Send comment'}
      </Button>
    </form>
  )
}
