/**
 * Live USD → CAD rate from the Bank of Canada Valet API (official daily average, no key needed).
 * Cached for an hour; returns null if the API can't be reached so callers can say so.
 */
export type UsdCadRate = { rate: number; date: string; source: string }

const VALET_URL = 'https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json?recent=1'

export async function getUsdCadRate(): Promise<UsdCadRate | null> {
  try {
    const res = await fetch(VALET_URL, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    const json = (await res.json()) as {
      observations?: { d: string; FXUSDCAD?: { v: string } }[]
    }
    const latest = json.observations?.[0]
    const rate = Number(latest?.FXUSDCAD?.v)
    if (!latest || !Number.isFinite(rate) || rate <= 0) return null
    return { rate, date: latest.d, source: 'Bank of Canada daily average' }
  } catch {
    return null
  }
}

/** Converts USD to CAD, rounded up to the nearest $5 so quoted prices stay tidy. */
export function usdToCad(usd: number, rate: number): number {
  return Math.ceil((usd * rate) / 5) * 5
}
