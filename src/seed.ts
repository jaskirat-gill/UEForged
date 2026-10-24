/**
 * Seed script: run with `pnpm exec tsx src/seed.ts`
 * Requires DATABASE_URL and PAYLOAD_SECRET in env.
 *
 * Naming scheme: each design is a series plus a model code "UE-<series letter><number>".
 * No model names.
 *   Street      (UE-S..) forged monoblocks for performance cars
 *   Competition (UE-C..) beadlock / drag
 *   Prestige    (UE-P..) polished luxury multi-spoke
 *   Modular     (UE-M2.. two-piece, UE-M3.. three-piece)
 * New designs take the next number in their series (UE-S09, UE-P03, UE-M205, UE-M301, ...).
 *
 * Images are not seeded; upload them in /admin or via the REST API.
 */
import { getPayload } from 'payload'
import config from './payload.config'

async function seed() {
  const payload = await getPayload({ config: await config })

  const [street, competition, prestige, modular] = await Promise.all([
    payload.create({
      collection: 'series',
      data: {
        name: 'Street',
        slug: 'street',
        description:
          'Forged monoblocks for performance cars: clean, lightweight designs made to measure for each car.',
      },
    }),
    payload.create({
      collection: 'series',
      data: {
        name: 'Competition',
        slug: 'competition',
        description: 'Beadlock and drag-spec wheels built for launch, track and strip.',
      },
    }),
    payload.create({
      collection: 'series',
      data: {
        name: 'Prestige',
        slug: 'prestige',
        description:
          'Statement multi-spoke designs in polished and machined finishes for luxury vehicles.',
      },
    }),
    payload.create({
      collection: 'series',
      data: {
        name: 'Modular',
        slug: 'modular',
        description:
          'Two- and three-piece forged wheels. Codes carry the piece count: UE-M2xx for two-piece, UE-M3xx for three-piece.',
      },
    }),
  ])

  await Promise.all(
    [
      { name: 'Gloss Black', slug: 'gloss-black', hex: '#0d0d0d', description: 'Deep, liquid and timeless.' },
      { name: 'Matte Black', slug: 'matte-black', hex: '#1a1a1a', description: 'Stealth, with no reflection.' },
      { name: 'Brushed Aluminium', slug: 'brushed-aluminium', hex: '#b5b5b5', description: 'Fine grain, clear sealed.' },
      { name: 'High Polish', slug: 'high-polish', hex: '#e6e6e6', description: 'A mirror face with a machined edge.' },
      { name: 'Chrome', slug: 'chrome', hex: '#d9e1e6', description: 'Brilliant, bright and bold.' },
      { name: 'Carbon Fibre', slug: 'carbon-fibre', hex: '#222222', description: 'For beadlock rings and accents.' },
      { name: 'Custom Colour', slug: 'custom-colour', hex: '#c9a84c', description: 'Any shade, matched to your car.' },
    ].map((data) => payload.create({ collection: 'finishes', data })),
  )

  await Promise.all([
    payload.create({
      collection: 'wheels',
      data: {
        name: 'UE-M201',
        slug: 'ue-m201',
        series: modular.id,
        description:
          'A two-piece forged wheel with ten split spokes, a bolted outer lip and black hardware, finished in gloss black.',
        featured: true,
      },
    }),
    payload.create({
      collection: 'wheels',
      data: {
        name: 'UE-S01',
        slug: 'ue-s01',
        series: street.id,
        description:
          'Five pairs of knife-edge spokes run from a machined centre to the outer lip. Forged monoblock, brushed and sealed under clear.',
        featured: true,
      },
    }),
    payload.create({
      collection: 'wheels',
      data: {
        name: 'UE-S02',
        slug: 'ue-s02',
        series: street.id,
        description:
          'Five split spokes sweep from a concave centre to the lip, forged as a monoblock and finished in dark glaze high polish.',
        featured: true,
      },
    }),
    payload.create({
      collection: 'wheels',
      data: {
        name: 'UE-S03',
        slug: 'ue-s03',
        series: street.id,
        description:
          'Five Y-shaped spokes in a clean, open face, forged as a monoblock and finished in gold.',
        featured: true,
      },
    }),
    payload.create({
      collection: 'wheels',
      data: {
        name: 'UE-M202',
        slug: 'ue-m202',
        series: modular.id,
        description:
          'A two-piece forged wheel: a layered mesh face of split spokes in brushed aluminium, bolted to a high-polish outer lip.',
        featured: true,
      },
    }),
    payload.create({
      collection: 'wheels',
      data: {
        name: 'UE-C01',
        slug: 'ue-c01',
        series: competition.id,
        description:
          'A monoblock beadlock for the drag strip. The bolted ring locks the tyre for low-pressure launches and the notched hub keeps weight to a minimum.',
        featured: true,
      },
    }),
    payload.create({
      collection: 'wheels',
      data: {
        name: 'UE-P01',
        slug: 'ue-p01',
        series: prestige.id,
        description:
          'Dozens of fine turbine spokes in high polish with a machined face and maximum concave. Shown in 24 inches with floating centre caps.',
        featured: true,
      },
    }),
    payload.create({
      collection: 'wheels',
      data: {
        name: 'UE-S04',
        slug: 'ue-s04',
        series: street.id,
        description:
          'Ten thin spokes in five split pairs, forged as a monoblock in brushed aluminium. Built for a BMW G80 M3.',
        featured: true,
      },
    }),
    payload.create({
      collection: 'wheels',
      data: {
        name: 'UE-S05',
        slug: 'ue-s05',
        series: street.id,
        description:
          'Forked spokes split again towards the lip to form an open mesh, forged as a monoblock in brushed aluminium. Built for a Ford Mustang.',
        featured: true,
      },
    }),
    payload.create({
      collection: 'wheels',
      data: {
        name: 'UE-S06',
        slug: 'ue-s06',
        series: street.id,
        description:
          'Branching spokes form a dense mesh across the face, forged as a monoblock in gloss black. Built for a Ford F-150.',
        featured: true,
      },
    }),
    payload.create({
      collection: 'wheels',
      data: {
        name: 'UE-S07',
        slug: 'ue-s07',
        series: street.id,
        description:
          'Y-shaped spokes divide into a layered mesh, forged as a monoblock and finished in gloss black.',
        featured: true,
      },
    }),
    payload.create({
      collection: 'wheels',
      data: {
        name: 'UE-S08',
        slug: 'ue-s08',
        series: street.id,
        description:
          'Swept, split spokes fan out from the centre, forged as a monoblock in high polish. Built for a Mercedes-AMG GLC 43 Coupe.',
        featured: true,
      },
    }),
    payload.create({
      collection: 'wheels',
      data: {
        name: 'UE-P02',
        slug: 'ue-p02',
        series: prestige.id,
        description:
          'A fine mesh of interlaced spokes in high polish, finished with a floating centre cap. Built for a Mercedes-AMG S63.',
        featured: true,
      },
    }),
    payload.create({
      collection: 'wheels',
      data: {
        name: 'UE-M203',
        slug: 'ue-m203',
        series: modular.id,
        description:
          'A polished lattice face bolted to a deep outer lip. Two-piece construction, built for a Chevrolet Corvette.',
        featured: true,
      },
    }),
    payload.create({
      collection: 'wheels',
      data: {
        name: 'UE-M204',
        slug: 'ue-m204',
        series: modular.id,
        description:
          'Directional, twisted spokes and a deep polished lip with a knurled edge, in two-piece construction.',
        featured: true,
      },
    }),
  ])

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

  console.log('Seed complete: series, finishes, wheels, site settings.')
  process.exit(0)
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
