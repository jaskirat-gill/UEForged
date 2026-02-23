/**
 * Seed script: run with `pnpm exec tsx src/seed.ts`
 * Requires DATABASE_URL and PAYLOAD_SECRET in env.
 */
import { getPayload } from 'payload'
import config from './payload.config'

async function seed() {
  const payload = await getPayload({ config: await config })

  const series = await Promise.all([
    payload.create({
      collection: 'series',
      data: { name: 'VFS', slug: 'vfs', description: 'Signature 5-spoke forged design.' },
    }),
    payload.create({
      collection: 'series',
      data: { name: 'Razor', slug: 'razor', description: 'Sharp split-spoke aesthetic.' },
    }),
    payload.create({
      collection: 'series',
      data: { name: 'Monoblock', slug: 'monoblock', description: 'Single-piece forged monoblock.' },
    }),
  ])

  const finishes = await Promise.all([
    payload.create({
      collection: 'finishes',
      data: { name: 'Gloss Black', slug: 'gloss-black', hex: '#1a1a1a' },
    }),
    payload.create({
      collection: 'finishes',
      data: { name: 'Matte Gunmetal', slug: 'matte-gunmetal', hex: '#2c2c2c' },
    }),
    payload.create({
      collection: 'finishes',
      data: { name: 'Brushed Gold', slug: 'brushed-gold', hex: '#C9A84C' },
    }),
  ])

  const wheels = await Promise.all([
    payload.create({
      collection: 'wheels',
      data: {
        name: 'VFS-1',
        slug: 'vfs-1',
        series: series[0]!.id,
        description: 'Our flagship 5-spoke design. Lightweight and strong.',
        specs: {
          sizes: [{ size: '20x9' }, { size: '20x10.5' }, { size: '21x10' }, { size: '22x11' }],
          offsets: [{ offset: 'ET22' }, { offset: 'ET35' }],
          finishesAvailable: [finishes[0]!.id, finishes[1]!.id, finishes[2]!.id],
        },
        featured: true,
      },
    }),
    payload.create({
      collection: 'wheels',
      data: {
        name: 'VFS-2',
        slug: 'vfs-2',
        series: series[0]!.id,
        description: 'Deeper concavity, same DNA.',
        specs: {
          sizes: [{ size: '20x10' }, { size: '21x11' }],
          offsets: [{ offset: 'ET25' }],
          finishesAvailable: [finishes[0]!.id, finishes[2]!.id],
        },
        featured: true,
      },
    }),
    payload.create({
      collection: 'wheels',
      data: {
        name: 'Razor-1',
        slug: 'razor-1',
        series: series[1]!.id,
        description: 'Split-spoke design for aggressive fitment.',
        specs: {
          sizes: [{ size: '19x8.5' }, { size: '20x9' }, { size: '20x10' }],
          offsets: [{ offset: 'ET30' }, { offset: 'ET35' }],
          finishesAvailable: [finishes[0]!.id, finishes[1]!.id],
        },
        featured: true,
      },
    }),
    payload.create({
      collection: 'wheels',
      data: {
        name: 'Razor-2',
        slug: 'razor-2',
        series: series[1]!.id,
        description: 'Wide lip, sharp face.',
        specs: {
          sizes: [{ size: '20x9' }, { size: '21x10' }],
          offsets: [{ offset: 'ET22' }],
          finishesAvailable: [finishes[2]!.id],
        },
        featured: false,
      },
    }),
    payload.create({
      collection: 'wheels',
      data: {
        name: 'MB-1',
        slug: 'mb-1',
        series: series[2]!.id,
        description: 'Monoblock forged. Maximum strength.',
        specs: {
          sizes: [{ size: '20x10' }, { size: '21x11' }, { size: '22x11' }],
          offsets: [{ offset: 'ET25' }, { offset: 'ET35' }],
          finishesAvailable: [finishes[0]!.id, finishes[1]!.id, finishes[2]!.id],
        },
        featured: true,
      },
    }),
    payload.create({
      collection: 'wheels',
      data: {
        name: 'MB-2',
        slug: 'mb-2',
        series: series[2]!.id,
        description: 'Concave monoblock for wide-body applications.',
        specs: {
          sizes: [{ size: '20x11' }, { size: '21x12' }],
          offsets: [{ offset: 'ET15' }],
          finishesAvailable: [finishes[0]!.id],
        },
        featured: false,
      },
    }),
  ])

  await Promise.all([
    payload.create({
      collection: 'builds',
      data: {
        title: 'BMW M4 on VFS-1',
        slug: 'bmw-m4-vfs1',
        carMake: 'BMW',
        carModel: 'M4',
        year: 2023,
        wheelUsed: wheels[0]!.id,
        finish: 'Gloss Black',
        photographerCredit: 'UEForged',
        featured: true,
      },
    }),
    payload.create({
      collection: 'builds',
      data: {
        title: 'Porsche 911 on Razor-1',
        slug: 'porsche-911-razor1',
        carMake: 'Porsche',
        carModel: '911',
        year: 2022,
        wheelUsed: wheels[2]!.id,
        finish: 'Matte Gunmetal',
        featured: true,
      },
    }),
    payload.create({
      collection: 'builds',
      data: {
        title: 'Mercedes AMG GT on MB-1',
        slug: 'mercedes-amg-gt-mb1',
        carMake: 'Mercedes-Benz',
        carModel: 'AMG GT',
        year: 2024,
        wheelUsed: wheels[4]!.id,
        finish: 'Brushed Gold',
        featured: true,
      },
    }),
    payload.create({
      collection: 'builds',
      data: {
        title: 'Audi RS6 on VFS-2',
        slug: 'audi-rs6-vfs2',
        carMake: 'Audi',
        carModel: 'RS6',
        year: 2023,
        wheelUsed: wheels[1]!.id,
        finish: 'Gloss Black',
        featured: false,
      },
    }),
  ])

  await payload.create({
    collection: 'testimonials',
    data: {
      customerName: 'James K.',
      location: 'Los Angeles, CA',
      quote:
        'The fitment was perfect. UEForged understood exactly what I wanted and delivered. Best wheels I\'ve ever run.',
      rating: 5,
    },
  })
  await payload.create({
    collection: 'testimonials',
    data: {
      customerName: 'Mike R.',
      location: 'Miami, FL',
      quote: 'From quote to delivery, everything was professional. The finish quality is insane.',
      rating: 5,
    },
  })

  const existing = await payload.findGlobal({ slug: 'site-settings' })
  if (!existing?.heroHeadline) {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        heroHeadline: 'FORGED TO PERFORM',
        heroSubtext: 'Custom forged wheels. Built to order.',
        contactEmail: 'hello@ueforged.com',
      },
    })
  }

  console.log('Seed complete: series, finishes, wheels, builds, testimonials, site settings.')
  process.exit(0)
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
