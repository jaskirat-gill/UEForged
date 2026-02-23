import React from 'react'
import { Bebas_Neue, Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './styles.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CursorGlow } from '@/components/animations/CursorGlow'

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'UEForged | Custom Forged Wheels',
    template: '%s | UEForged',
  },
  description:
    'Luxury custom forged car wheels. Precision engineering meets art. Explore our wheel collections and request a quote.',
  openGraph: {
    type: 'website',
  },
}

export default async function FrontendLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className={`${bebas.variable} ${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col bg-bg text-text">
        <CursorGlow />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
