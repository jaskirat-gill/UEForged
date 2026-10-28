import React from 'react'
import { ORDER_STEPS, orderStepIndex } from '@/lib/orderStatus'
import { cn } from '@/lib/utils'

/** Horizontal progress bar through the order pipeline (stacks vertically on phones). */
export function OrderProgress({ status }: { status: string }) {
  if (status === 'cancelled') {
    return (
      <div className="border border-red-500/40 bg-red-500/10 px-6 py-4 font-body text-sm text-red-300">
        This order was cancelled. Contact UEForged if you have questions.
      </div>
    )
  }
  const current = Math.max(orderStepIndex(status), 0)
  const percent = (current / (ORDER_STEPS.length - 1)) * 100

  return (
    <div>
      <div className="relative h-1.5 bg-surface-elevated overflow-hidden" aria-hidden="true">
        <div className="absolute inset-y-0 left-0 bg-gold transition-all" style={{ width: `${percent}%` }} />
      </div>
      <ol className="mt-5 grid grid-cols-1 sm:grid-cols-7 gap-3 sm:gap-2" aria-label="Order progress">
        {ORDER_STEPS.map((step, i) => {
          const done = i < current
          const active = i === current
          return (
            <li key={step.value} className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2" aria-current={active ? 'step' : undefined}>
              <span
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-body',
                  done && 'bg-gold border-gold text-bg',
                  active && 'border-gold text-gold ring-4 ring-gold/20',
                  !done && !active && 'border-border text-text-muted',
                )}
              >
                {done ? '✓' : i + 1}
              </span>
              <span className={cn('font-body text-xs uppercase tracking-wider', active ? 'text-gold' : done ? 'text-text' : 'text-text-muted')}>
                {step.label}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
