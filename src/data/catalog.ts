/**
 * Content for the /catalog page.
 *
 * Everything shown in the catalog lives here so copy, images and ordering can be
 * changed without touching layout code. Images are served from /public/catalog.
 */

export interface CatalogImage {
  src: string
  alt: string
  /** CSS object-position focal point used when the photo is cropped, e.g. '50% 80%' */
  focus?: string
}

export interface CatalogSpec {
  label: string
  value: string
}

export interface CatalogDesign {
  /** Model code, e.g. 'UE-S01' (series letter + number) */
  code: string
  series: string
  finish: string
  summary: string
  hero: CatalogImage
  gallery: CatalogImage[]
  specs: CatalogSpec[]
  /** Slug of the matching entry in the Wheels collection */
  wheelSlug?: string
}

export interface CatalogConstruction {
  name: string
  description: string
}

export interface CatalogFinish {
  name: string
  description: string
  /** CSS background for the swatch */
  swatch: string
}

export interface CatalogBuild {
  vehicle: string
  maker: string
  setup: string
  specs: string[]
  images: CatalogImage[]
  /** Slug of the matching entry in the Builds collection, if one exists */
  buildSlug?: string
}

export interface CatalogStep {
  title: string
  description: string
}

const img = (file: string, alt: string, focus?: string): CatalogImage => ({
  src: `/catalog/${file}`,
  alt,
  focus,
})

export const catalog = {
  edition: 'Volume I',
  year: '2026',

  hero: {
    eyebrow: 'Upper Echelon Forged',
    title: 'The Collection',
    tagline: 'Bespoke forged wheels, engineered for one car at a time.',
    image: img('twin-spoke-hero.jpg', 'UE-S01 in brushed aluminium in the studio'),
  },

  manifesto: {
    heading: 'Nothing off the shelf.',
    body: [
      'Every UEForged wheel begins as a conversation about one car. Its fitment, its brakes, its stance and the way its owner wants it to feel.',
      'From there we render, refine and forge a single set to that brief, measured to the millimetre.',
    ],
  },

  designs: [
    {
      code: 'UE-S01',
      series: 'Street',
      finish: 'Brushed Aluminium',
      summary:
        'Five pairs of knife-edge spokes run from a machined centre to the outer lip, so the face looks lighter than its forged strength would suggest. A brushed grain, sealed under clear, keeps its lustre for years.',
      hero: img('twin-spoke-face.jpg', 'UE-S01 in brushed aluminium, face on'),
      gallery: [
        img('twin-spoke-three-quarter.jpg', 'UE-S01, three-quarter view'),
        img('twin-spoke-centre.jpg', 'Machined centre bore and UEF centre cap'),
        img('twin-spoke-barrel.jpg', 'Brushed barrel and lip profile'),
        img('twin-spoke-detail.jpg', 'Spoke detail with UEForged engraving'),
      ],
      specs: [
        { label: 'Construction', value: 'Forged monoblock' },
        { label: 'Diameters', value: 'Made to order' },
        { label: 'Fitment', value: 'Made to your PCD, offset and hub bore' },
        { label: 'Finish', value: 'Brushed aluminium, clear sealed' },
      ],
      wheelSlug: 'ue-s01',
    },
    {
      code: 'UE-S02',
      series: 'Street',
      finish: 'Dark Glaze High Polish',
      summary:
        'Five split spokes sweep from a deeply concave centre to the lip. The dark glaze over a high polish reads black in shade and chrome in sun. Shown staggered at 20 x 9.5 and 21 x 12 for a Corvette C8.',
      hero: img('s02-face.jpg', 'UE-S02 in dark glaze high polish, face on'),
      gallery: [
        img('s02-three-quarter.jpg', 'UE-S02, three-quarter view'),
        img('s02-spoke.jpg', 'UE-S02 split-spoke detail'),
        img('s02-barrel.jpg', 'UE-S02 barrel and lip'),
      ],
      specs: [
        { label: 'Construction', value: 'Forged monoblock' },
        { label: 'Fitment', value: 'Staggered, made to your PCD, offset and hub bore' },
        { label: 'Finish', value: 'Dark glaze over high polish' },
      ],
      wheelSlug: 'ue-s02',
    },
    {
      code: 'UE-S03',
      series: 'Street',
      finish: 'Gold',
      summary:
        'Five Y-shaped spokes in a clean, open face, forged as a monoblock and finished in gold. Shown staggered at 20 x 9 and 21 x 11.5 for a Porsche 911.',
      hero: img('s03-face.jpg', 'UE-S03 in gold, face on'),
      gallery: [
        img('s03-three-quarter.jpg', 'UE-S03, three-quarter view'),
        img('s03-centre.jpg', 'UE-S03 centre and UEF cap'),
        img('s03-lip.jpg', 'UE-S03 spoke and lip with UEForged engraving'),
      ],
      specs: [
        { label: 'Construction', value: 'Forged monoblock' },
        { label: 'Fitment', value: 'Staggered, made to your PCD, offset and hub bore' },
        { label: 'Finish', value: 'Gold, or any custom colour' },
      ],
      wheelSlug: 'ue-s03',
    },
    {
      code: 'UE-S04',
      series: 'Street',
      finish: 'Brushed Aluminium',
      summary:
        'Ten thin spokes in five split pairs, forged as a monoblock in brushed aluminium. Built for a BMW G80 M3.',
      hero: img('s04-1.jpg', 'UE-S04, face on'),
      gallery: [
        img('s04-2.jpg', 'UE-S04, view 2'),
        img('s04-3.jpg', 'UE-S04, view 3'),
        img('s04-4.jpg', 'UE-S04, view 4'),
      ],
      specs: [
        { label: 'Construction', value: 'Forged monoblock' },
        { label: 'Fitment', value: 'Made to your PCD, offset and hub bore' },
        { label: 'Finish', value: 'Brushed aluminium' },
      ],
      wheelSlug: 'ue-s04',
    },
    {
      code: 'UE-S05',
      series: 'Street',
      finish: 'Brushed Aluminium',
      summary:
        'Forked spokes split again towards the lip to form an open mesh, forged as a monoblock in brushed aluminium. Built for a Ford Mustang.',
      hero: img('s05-1.jpg', 'UE-S05, face on'),
      gallery: [
        img('s05-2.jpg', 'UE-S05, view 2'),
        img('s05-3.jpg', 'UE-S05, view 3'),
        img('s05-4.jpg', 'UE-S05, view 4'),
      ],
      specs: [
        { label: 'Construction', value: 'Forged monoblock' },
        { label: 'Fitment', value: 'Made to your PCD, offset and hub bore' },
        { label: 'Finish', value: 'Brushed aluminium' },
      ],
      wheelSlug: 'ue-s05',
    },
    {
      code: 'UE-S06',
      series: 'Street',
      finish: 'Gloss Black',
      summary:
        'Branching spokes form a dense mesh across the face, forged as a monoblock in gloss black. Built for a Ford F-150.',
      hero: img('s06-1.jpg', 'UE-S06, face on'),
      gallery: [
        img('s06-2.jpg', 'UE-S06, view 2'),
        img('s06-3.jpg', 'UE-S06, view 3'),
        img('s06-4.jpg', 'UE-S06, view 4'),
      ],
      specs: [
        { label: 'Construction', value: 'Forged monoblock' },
        { label: 'Fitment', value: 'Made to your PCD, offset and hub bore' },
        { label: 'Finish', value: 'Gloss black' },
      ],
      wheelSlug: 'ue-s06',
    },
    {
      code: 'UE-S07',
      series: 'Street',
      finish: 'Gloss Black',
      summary:
        'Y-shaped spokes divide into a layered mesh, forged as a monoblock and finished in gloss black.',
      hero: img('s07-1.jpg', 'UE-S07, face on'),
      gallery: [
        img('s07-2.jpg', 'UE-S07, view 2'),
        img('s07-3.jpg', 'UE-S07, view 3'),
        img('s07-4.jpg', 'UE-S07, view 4'),
      ],
      specs: [
        { label: 'Construction', value: 'Forged monoblock' },
        { label: 'Fitment', value: 'Made to your PCD, offset and hub bore' },
        { label: 'Finish', value: 'Gloss black' },
      ],
      wheelSlug: 'ue-s07',
    },
    {
      code: 'UE-S08',
      series: 'Street',
      finish: 'High Polish',
      summary:
        'Swept, split spokes fan out from the centre, forged as a monoblock in high polish. Built for a Mercedes-AMG GLC 43 Coupe.',
      hero: img('s08-1.jpg', 'UE-S08, face on'),
      gallery: [
        img('s08-2.jpg', 'UE-S08, view 2'),
        img('s08-3.jpg', 'UE-S08, view 3'),
        img('s08-4.jpg', 'UE-S08, view 4'),
      ],
      specs: [
        { label: 'Construction', value: 'Forged monoblock' },
        { label: 'Fitment', value: 'Made to your PCD, offset and hub bore' },
        { label: 'Finish', value: 'High polish' },
      ],
      wheelSlug: 'ue-s08',
    },
    {
      code: 'UE-C01',
      series: 'Competition',
      finish: 'Gloss Black',
      summary:
        'Built for the drag strip. A forged beadlock ring clamps the tyre bead so it can run at low pressure under full launch, and the notched hub keeps rotating mass to a minimum.',
      hero: img('beadlock-face.jpg', 'UE-C01 beadlock in gloss black, face on'),
      gallery: [
        img('beadlock-three-quarter.jpg', 'Beadlock wheel, three-quarter view'),
        img('beadlock-centre.jpg', 'Beadlock centre and UEF cap'),
        img('beadlock-barrel.jpg', 'Beadlock ring hardware and barrel'),
        img('beadlock-profile.jpg', 'Beadlock wheel in profile'),
      ],
      specs: [
        { label: 'Construction', value: 'Monoblock beadlock' },
        { label: 'Diameters', value: '15" – 20"' },
        { label: 'Ring options', value: 'Gloss black, brushed, carbon fibre' },
        { label: 'Hub', value: 'Notched for minimum weight' },
      ],
      wheelSlug: 'ue-c01',
    },
    {
      code: 'UE-P02',
      series: 'Prestige',
      finish: 'High Polish',
      summary:
        'A fine mesh of interlaced spokes in high polish, finished with a floating centre cap. Built for a Mercedes-AMG S63.',
      hero: img('p02-1.jpg', 'UE-P02, face on'),
      gallery: [
        img('p02-2.jpg', 'UE-P02, view 2'),
        img('p02-3.jpg', 'UE-P02, view 3'),
        img('p02-4.jpg', 'UE-P02, view 4'),
      ],
      specs: [
        { label: 'Construction', value: 'Forged monoblock' },
        { label: 'Fitment', value: 'Made to your PCD, offset and hub bore' },
        { label: 'Finish', value: 'High polish, floating cap' },
      ],
      wheelSlug: 'ue-p02',
    },
    {
      code: 'UE-M201',
      series: 'Modular',
      finish: 'Gloss Black',
      summary:
        'Ten split spokes on a forged centre, bolted to a separate outer lip with black hardware. Two-piece construction allows a deep, staggered fitment, shown here at 20 x 10 and 21 x 12 on a Corvette C7 Z06.',
      hero: img('z06-wheel.jpg', 'UE-M201 in gloss black on a Corvette C7 Z06', '50% 60%'),
      gallery: [
        img('m201-factory.jpg', 'UE-M201 at the factory with black hardware and UEF centre cap'),
        img('z06-front.jpg', 'Corvette C7 Z06 on UE-M201', '50% 70%'),
      ],
      specs: [
        { label: 'Construction', value: 'Two-piece forged' },
        { label: 'Fitment', value: 'Staggered, made to your PCD, offset and hub bore' },
        { label: 'Hardware', value: 'Black' },
        { label: 'Finish', value: 'Gloss black' },
      ],
      wheelSlug: 'ue-m201',
    },
    {
      code: 'UE-M202',
      series: 'Modular',
      finish: 'Brushed Aluminium',
      summary:
        'Split spokes branch and interlock as they reach the lip, building a layered mesh face with real depth. The brushed face is bolted to a high-polish outer lip.',
      hero: img('mesh-face.jpg', 'UE-M202 in brushed aluminium, face on'),
      gallery: [
        img('mesh-three-quarter.jpg', 'UE-M202, three-quarter view'),
        img('mesh-centre.jpg', 'UE-M202 centre cap detail'),
      ],
      specs: [
        { label: 'Construction', value: 'Two-piece forged' },
        { label: 'Diameters', value: 'Made to order' },
        { label: 'Fitment', value: 'Made to your PCD, offset and hub bore' },
        { label: 'Finish', value: 'Brushed face, high-polish lip' },
      ],
      wheelSlug: 'ue-m202',
    },
    {
      code: 'UE-M203',
      series: 'Modular',
      finish: 'High Polish',
      summary:
        'A polished lattice face bolted to a deep outer lip. Two-piece construction, built for a Chevrolet Corvette.',
      hero: img('m203-1.jpg', 'UE-M203, face on'),
      gallery: [
        img('m203-2.jpg', 'UE-M203, view 2'),
        img('m203-3.jpg', 'UE-M203, view 3'),
        img('m203-4.jpg', 'UE-M203, view 4'),
      ],
      specs: [
        { label: 'Construction', value: 'Two-piece forged' },
        { label: 'Fitment', value: 'Made to your PCD, offset and hub bore' },
        { label: 'Finish', value: 'High polish' },
      ],
      wheelSlug: 'ue-m203',
    },
    {
      code: 'UE-M204',
      series: 'Modular',
      finish: 'High Polish',
      summary:
        'Directional, twisted spokes and a deep polished lip with a knurled edge, in two-piece construction.',
      hero: img('m204-1.jpg', 'UE-M204, face on'),
      gallery: [
        img('m204-2.jpg', 'UE-M204, view 2'),
        img('m204-3.jpg', 'UE-M204, view 3'),
      ],
      specs: [
        { label: 'Construction', value: 'Two-piece forged' },
        { label: 'Fitment', value: 'Made to your PCD, offset and hub bore' },
        { label: 'Finish', value: 'High polish, knurled lip' },
      ],
      wheelSlug: 'ue-m204',
    },
  ] satisfies CatalogDesign[],

  constructions: [
    {
      name: 'Monoblock',
      description:
        'One piece, forged and machined from a single aluminium blank. The strongest and lightest way to build a wheel.',
    },
    {
      name: 'Two-Piece',
      description:
        'A forged centre joined to a forged barrel, opening up deeper lips and more aggressive concave profiles.',
    },
    {
      name: 'Three-Piece',
      description:
        'Centre, inner and outer barrel bolted together, so width and offset can be tuned with complete freedom.',
    },
    {
      name: 'Beadlock',
      description:
        'A bolted ring locks the tyre to the wheel for low-pressure launches. Available in monoblock and multi-piece.',
    },
  ] satisfies CatalogConstruction[],

  finishes: [
    { name: 'Gloss Black', description: 'Deep, liquid and timeless.', swatch: 'linear-gradient(135deg,#2a2a2a 0%,#050505 55%,#1c1c1c 100%)' },
    { name: 'Matte Black', description: 'Stealth, with no reflection.', swatch: '#151515' },
    { name: 'Brushed Aluminium', description: 'Fine grain, clear sealed.', swatch: 'repeating-linear-gradient(90deg,#b9b9b9 0 2px,#a3a3a3 2px 4px,#c8c8c8 4px 5px)' },
    { name: 'High Polish', description: 'A mirror face with a machined edge.', swatch: 'linear-gradient(135deg,#f4f4f4 0%,#9a9a9a 40%,#ffffff 60%,#8a8a8a 100%)' },
    { name: 'Chrome', description: 'Brilliant, bright and bold.', swatch: 'linear-gradient(160deg,#ffffff 0%,#7c8a96 35%,#e9eef2 55%,#46525c 100%)' },
    { name: 'Carbon Fibre', description: 'For beadlock rings and accents.', swatch: 'repeating-linear-gradient(45deg,#1b1b1b 0 4px,#2b2b2b 4px 8px)' },
    { name: 'Custom Colour', description: 'Any shade, matched to your car.', swatch: 'conic-gradient(from 90deg,#c9a84c,#8b1d1d,#1d3a8b,#1d8b5a,#c9a84c)' },
  ] satisfies CatalogFinish[],

  specSheet: [
    { label: 'Diameters', value: '15" to 28"' },
    { label: 'Widths', value: 'Made to order, square or staggered' },
    { label: 'Bolt patterns', value: 'Any PCD, drilled to your vehicle' },
    { label: 'Offset & hub bore', value: 'Calculated for flush fitment and brake clearance' },
    { label: 'Concave', value: 'Subtle through to maximum' },
    { label: 'Lead time', value: 'About 25–35 days of production after render approval' },
    { label: 'Warranty', value: 'Five-year structural warranty' },
  ] satisfies CatalogSpec[],

  personalisation: [
    { name: 'Lip & barrel engraving', description: 'Your name, a marque or the UEForged script, cut into the lip.' },
    { name: 'Bespoke centre caps', description: 'UEF, factory crests or floating caps that stay upright as the wheel turns.' },
    { name: 'Lightweight notched hub', description: 'Weight taken out of the hub without giving up strength.' },
    { name: 'Polished windows', description: 'Machined, polished accents set into a painted face.' },
  ] satisfies CatalogConstruction[],

  builds: [
    {
      vehicle: 'Cullinan',
      maker: 'Rolls-Royce',
      setup: 'Prestige UE-P01 · High polish',
      specs: ['24" monoblock', 'Maximum concave', 'Floating centre caps'],
      images: [
        img('cullinan-wheel.jpg', 'Polished 24-inch UEForged wheel on a Rolls-Royce Cullinan'),
        img('cullinan-hero.jpg', 'White Rolls-Royce Cullinan on polished UEForged wheels', '50% 88%'),
        img('cullinan-ecstasy.jpg', 'Spirit of Ecstasy on the Cullinan'),
        img('cullinan-low.jpg', 'Low angle of the Cullinan and its polished wheel', '50% 75%'),
      ],
      buildSlug: 'rolls-royce-cullinan',
    },
    {
      vehicle: 'Corvette C7 Z06',
      maker: 'Chevrolet',
      setup: 'Modular UE-M201 · Gloss black',
      specs: ['Two-piece forged', 'Staggered 20" / 21"', 'Black hardware'],
      images: [
        img('z06-hero.jpg', 'Red Corvette C7 Z06 on black UEForged wheels', '50% 75%'),
        img('z06-wheel.jpg', 'Gloss black UEForged wheel on the Corvette Z06'),
        img('z06-front.jpg', 'Front three-quarter of the Corvette Z06', '50% 70%'),
      ],
      buildSlug: 'corvette-c7-z06',
    },
    {
      vehicle: 'E63 S',
      maker: 'Mercedes-AMG',
      setup: 'Brushed gunmetal mesh',
      specs: ['20" monoblock', 'Staggered fitment', 'UEForged lip engraving'],
      images: [
        img('e63-hero.jpg', 'Grey Mercedes-AMG E63 S on UEForged wheels', '50% 80%'),
        img('e63-wheel.jpg', 'Brushed gunmetal UEForged mesh wheel with red calipers'),
      ],
    },
    {
      vehicle: 'Mustang GT',
      maker: 'Ford',
      setup: 'Gunmetal split-spoke',
      specs: ['Forged monoblock', 'Flush fitment'],
      images: [
        img('mustang-hero.jpg', 'White Ford Mustang GT on gunmetal UEForged wheels', '50% 75%'),
        img('mustang-rear.jpg', 'Rear three-quarter of the Mustang GT', '50% 75%'),
      ],
    },
  ] satisfies CatalogBuild[],

  process: [
    { title: 'Consult', description: 'We start with your car, its brakes and the stance and style you want.' },
    { title: 'Render', description: 'You approve a full 3D rendering before any metal is cut.' },
    { title: 'Forge', description: 'Each wheel is forged, CNC machined and lightened to your exact specification.' },
    { title: 'Finish', description: 'Finished, engraved and inspected, then shipped to your door.' },
  ] satisfies CatalogStep[],

  cta: {
    heading: 'Commission your set',
    body: 'Tell us your car and your vision. We will come back with fitment, a rendering and a quote.',
    href: '/quote',
    label: 'Begin a Commission',
  },
}

export type Catalog = typeof catalog
