export function toRoman(n: number): string {
  const numerals: [number, string][] = [
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ]
  let out = ''
  for (const [value, symbol] of numerals) {
    while (n >= value) {
      out += symbol
      n -= value
    }
  }
  return out
}
