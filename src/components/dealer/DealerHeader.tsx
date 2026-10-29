import React from 'react'
import Link from 'next/link'
import type { Dealer } from '@/payload-types'
import { ButtonLink } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { logoutDealer } from '@/app/(frontend)/dealer/actions'

const TABS = [
  { key: 'orders', label: 'Orders', href: '/dealer' },
  { key: 'resources', label: 'Pricing & resources', href: '/dealer/resources' },
] as const

export type DealerTab = (typeof TABS)[number]['key']

/** Dealer portal header: company, dealer concession, actions and the Orders / Resources tabs. */
export function DealerHeader({ dealer, active }: { dealer: Dealer; active: DealerTab }) {
  const discount = dealer.discountPercent ?? 0
  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-body text-xs uppercase tracking-[0.4em] text-gold">Dealer portal</p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl tracking-widest text-text uppercase">
            {dealer.companyName}
          </h1>
          <p className="mt-3 font-body text-text-muted">
            Signed in as {dealer.username ?? dealer.email}
            {discount > 0 && <> · Dealer concession: {discount}% off retail list price</>}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink href="/dealer/order" variant="primary">
            Place a dealer order
          </ButtonLink>
          <form action={logoutDealer}>
            <button type="submit" className="font-body text-sm uppercase tracking-wider text-text-muted hover:text-gold">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <nav aria-label="Dealer portal" className="mt-10 border-b border-border">
        <ul className="flex gap-8">
          {TABS.map((tab) => {
            const isActive = tab.key === active
            return (
              <li key={tab.key}>
                <Link
                  href={tab.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'inline-block pb-3 -mb-px border-b-2 font-display text-xl tracking-wider uppercase transition-colors',
                    isActive ? 'border-gold text-text' : 'border-transparent text-text-muted hover:text-gold',
                  )}
                >
                  {tab.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
