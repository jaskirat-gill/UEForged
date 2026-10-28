import React from 'react'
import Link from 'next/link'

/** Adds a "Price Chart" entry to the admin sidebar, below the collections and globals. */
export function PriceChartNavLink() {
  return (
    <Link href="/admin/price-chart" className="nav__link price-chart__nav-link">
      <span className="nav__link-label">Price Chart</span>
    </Link>
  )
}
