/**
 * The finishes UEForged offers, in display order. Single source for the catalog, the dealer
 * resources page, the order form's finish picker and order validation.
 */
export type Finish = {
  name: string
  description: string
  /** CSS background used for the swatch */
  swatch: string
}

export const FINISHES: Finish[] = [
  {
    name: 'Gloss Black',
    description: 'Deep, liquid black under a gloss clear coat.',
    swatch: 'linear-gradient(135deg,#2a2a2a 0%,#050505 55%,#1c1c1c 100%)',
  },
  { name: 'Matte Black', description: 'Flat black with no reflection.', swatch: '#151515' },
  {
    name: 'Brushed Aluminium',
    description: 'A fine brushed grain, sealed under clear.',
    swatch: 'repeating-linear-gradient(90deg,#b9b9b9 0 2px,#a3a3a3 2px 4px,#c8c8c8 4px 5px)',
  },
  {
    name: 'High Polish',
    description: 'Polished to a mirror shine and sealed with clear coat.',
    swatch: 'linear-gradient(135deg,#f4f4f4 0%,#9a9a9a 40%,#ffffff 60%,#8a8a8a 100%)',
  },
  {
    name: 'Dark Tinted Polish',
    description: 'High polish under a dark tinted clear: black in shade, bright in sun.',
    swatch: 'linear-gradient(135deg,#7a7f85 0%,#1f2226 40%,#8f949a 60%,#141618 100%)',
  },
  {
    name: 'Chrome',
    description: 'Chrome plated across the whole wheel for the brightest finish.',
    swatch: 'linear-gradient(160deg,#ffffff 0%,#7c8a96 35%,#e9eef2 55%,#46525c 100%)',
  },
  {
    name: 'Black Chrome',
    description: 'Chrome plating with a smoked, dark mirror finish.',
    swatch: 'linear-gradient(160deg,#a3a9af 0%,#1b1d20 35%,#626870 55%,#0c0d0f 100%)',
  },
  {
    name: 'Gold',
    description: 'Anodised or painted gold, in the shade you choose.',
    swatch: 'linear-gradient(135deg,#f3dd8a 0%,#b8902f 45%,#ecd27a 60%,#8a6a1c 100%)',
  },
  {
    name: 'Carbon Fibre',
    description: 'For beadlock rings and accents.',
    swatch: 'repeating-linear-gradient(45deg,#1b1b1b 0 4px,#2b2b2b 4px 8px)',
  },
  {
    name: 'Custom Colour',
    description: 'Any paint colour, matched to your car.',
    swatch: 'conic-gradient(from 90deg,#c9a84c,#8b1d1d,#1d3a8b,#1d8b5a,#c9a84c)',
  },
]
