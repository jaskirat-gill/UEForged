'use client'

import React from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { FINISHES } from '@/lib/finishes'
import { cn } from '@/lib/utils'

export type WheelOption = { id: string; name: string; series: string; image?: string | null }

/** Shared card styling for a visually hidden radio + label. */
function cardClass(selected: boolean) {
  return cn(
    'group block h-full cursor-pointer border bg-surface transition-colors',
    'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold',
    selected ? 'border-gold ring-1 ring-gold' : 'border-border hover:border-gold/60',
  )
}

/** Design picker: a photo card per design, grouped by series, plus a "custom / not sure" card. */
export function DesignPicker({
  wheels,
  selected,
  register,
}: {
  wheels: WheelOption[]
  selected: string | undefined
  register: UseFormRegisterReturn
}) {
  const series = Array.from(new Set(wheels.map((w) => w.series || 'Other')))
  return (
    <fieldset>
      <legend className="block font-body text-sm text-text-muted mb-3">Design</legend>
      <div className="space-y-6">
        {series.map((s) => (
          <div key={s}>
            <p className="font-body text-[11px] uppercase tracking-[0.3em] text-gold mb-2">{s}</p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {wheels
                .filter((w) => (w.series || 'Other') === s)
                .map((w) => (
                  <li key={w.id}>
                    <label className={cardClass(selected === w.id)}>
                      <input type="radio" value={w.id} className="sr-only" {...register} />
                      <span className="block aspect-square overflow-hidden bg-bg">
                        {w.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={w.image}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : null}
                      </span>
                      <span className="flex items-center justify-between gap-2 px-3 py-2">
                        <span className="font-display text-lg tracking-wider text-text">{w.name}</span>
                        {selected === w.id && <span className="font-body text-xs text-gold">✓ Selected</span>}
                      </span>
                    </label>
                  </li>
                ))}
            </ul>
          </div>
        ))}
        <label className={cn(cardClass(!selected), 'flex items-center gap-3 px-4 py-3 h-auto')}>
          <input type="radio" value="" className="sr-only" {...register} />
          <span className="font-display text-lg tracking-wider text-text uppercase">Custom design / not sure yet</span>
          {!selected && <span className="ml-auto font-body text-xs text-gold">✓ Selected</span>}
        </label>
      </div>
    </fieldset>
  )
}

/** Finish picker: a swatch per finish, plus "recommend for me". */
export function FinishPicker({
  selected,
  register,
}: {
  selected: string | undefined
  register: UseFormRegisterReturn
}) {
  const options = [
    { name: '', label: 'Recommend for me', description: 'We suggest a finish for your car and design.', swatch: '' },
    ...FINISHES.map((f) => ({ ...f, label: f.name })),
  ]
  return (
    <fieldset>
      <legend className="block font-body text-sm text-text-muted mb-3">Finish</legend>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {options.map((f) => {
          const isSelected = (selected ?? '') === f.name
          return (
            <li key={f.label}>
              <label className={cn(cardClass(isSelected), 'flex items-center gap-3 p-3')}>
                <input type="radio" value={f.name} className="sr-only" {...register} />
                <span className="relative h-11 w-11 shrink-0 rounded-full border border-border p-0.5">
                  {f.swatch ? (
                    <span className="block h-full w-full rounded-full" style={{ background: f.swatch }} />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-bg font-display text-gold">?</span>
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-base tracking-wider text-text uppercase leading-tight">
                    {f.label}
                  </span>
                  <span className="block font-body text-[11px] text-text-muted leading-snug">{f.description}</span>
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </fieldset>
  )
}
