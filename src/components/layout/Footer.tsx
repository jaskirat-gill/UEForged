import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'

async function getSiteSettings() {
  const payload = await getPayload({ config: await config })
  const settings = await payload.findGlobal({
    slug: 'site-settings',
  })
  return settings
}

export async function Footer() {
  const settings = await getSiteSettings()
  const socialLinks = settings?.socialLinks ?? []

  return (
    <footer className="border-t border-border bg-surface-elevated">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link
              href="/"
              className="font-display text-2xl tracking-[0.2em] text-gold no-underline"
            >
              UE FORGED
            </Link>
            <p className="mt-4 font-body text-sm text-text-muted max-w-md">
              Custom forged wheels. Precision engineering meets art. Your build starts here.
            </p>
          </div>
          <div>
            <h3 className="font-display text-sm tracking-widest text-text mb-4">Navigate</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/wheels" className="font-body text-sm text-text-muted hover:text-gold">
                  Wheels
                </Link>
              </li>
              <li>
                <Link href="/builds" className="font-body text-sm text-text-muted hover:text-gold">
                  Builds
                </Link>
              </li>
              <li>
                <Link href="/about" className="font-body text-sm text-text-muted hover:text-gold">
                  About
                </Link>
              </li>
              <li>
                <Link href="/quote" className="font-body text-sm text-text-muted hover:text-gold">
                  Get a Quote
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-sm tracking-widest text-text mb-4">Connect</h3>
            {socialLinks.length > 0 ? (
              <ul className="space-y-2">
                {socialLinks.map((item) =>
                  item.platform && item.url ? (
                    <li key={item.platform}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-body text-sm text-text-muted hover:text-gold transition-colors"
                      >
                        {item.platform}
                      </a>
                    </li>
                  ) : null
                )}
              </ul>
            ) : (
              <p className="font-body text-sm text-text-muted">Follow us on social.</p>
            )}
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border">
          <p className="font-body text-xs text-text-muted">
            © {new Date().getFullYear()} UEForged. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
