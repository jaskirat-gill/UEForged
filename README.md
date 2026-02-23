# UEForged — Premium Portfolio & Quotation Website

Luxury custom forged car wheel company site. Built with **Payload CMS v3**, **Next.js 15** (App Router), **TypeScript**, **Tailwind CSS v4**, and **Framer Motion**.

## Tech Stack

- **Payload CMS 3** — Headless CMS (Wheels, Builds, Finishes, Series, Testimonials, Inquiries, Site Settings)
- **Next.js 15** — App Router, server components
- **TypeScript** — Strict typing; types from `payload generate:types`
- **Tailwind CSS v4** — Design tokens (obsidian black, molten gold)
- **Framer Motion** — Hero, scroll reveals, parallax, cursor glow
- **React Hook Form + Zod** — Quote form validation
- **Vercel** — Deployment target

## Design

- **Palette**: Background `#080808` / `#0D0D0D`, surface `#111` / `#1A1A1A`, gold `#C9A84C` / `#E8C96A` / `#8B6914`, text `#F5F5F5` / `#9A9A9A`
- **Fonts**: Bebas Neue (display), Cormorant Garamond (serif), DM Sans (body) via `next/font`

## Getting Started

1. **Install**  
   `pnpm install`

2. **Environment**  
   Copy `.env.example` to `.env` and set:
   - `DATABASE_URL` — MongoDB connection string
   - `PAYLOAD_SECRET` — Random secret for Payload

3. **Dev**  
   `pnpm dev`  
   - Frontend: [http://localhost:3000](http://localhost:3000)  
   - Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

4. **Seed (optional)**  
   After the app has run at least once (so the DB exists), seed wheels, builds, and site settings:
   ```bash
   pnpm run seed
   ```
   Then create an admin user in `/admin` if you haven’t already.

5. **Build**  
   `pnpm build` && `pnpm start`

## Scripts

- `pnpm dev` — Next.js dev server
- `pnpm build` — Production build
- `pnpm start` — Production server
- `pnpm run generate:types` — Regenerate Payload TypeScript types
- `pnpm run seed` — Seed CMS (6 wheels, 4 builds, testimonials, site settings)

## Site Structure

| Route       | Description                          |
|------------|--------------------------------------|
| `/`        | Home — Hero, featured wheels, about teaser, process, testimonials, CTA |
| `/wheels`  | Filterable wheel grid (series, finish) |
| `/wheels/[slug]` | Wheel detail, gallery, specs, “Request This Wheel” → quote |
| `/builds`  | Horizontal scroll gallery of builds   |
| `/about`   | Brand story and forging process      |
| `/quote`   | Inquiry form (RHF + Zod → Payload Inquiries) |

## Payload Collections

- **Wheels** — name, slug, series, specs (sizes, offsets, finishes), images, featured
- **Builds** — car make/model/year, wheel used, images, photographer credit
- **Finishes** — name, slug, hex, swatch image
- **Series** — name, slug, description
- **Testimonials** — customer name, quote, rating, location
- **Inquiries** — form submissions (name, email, car, wheel interest, notes, status)
- **Site Settings** (global) — hero headline/subtext, social links, contact email

## Code Quality

- TypeScript strict; no `any`
- Payload types from `payload generate:types`
- Server components by default; client only for interactivity/animation
- `next/image` for images; hero priority
- Metadata via Next.js Metadata API
