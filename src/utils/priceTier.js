// Classify a price into cheap / mid / high relative to the current result set,
// so both the map pins and list badges use one consistent colour scale.
export function priceTier(price, min, max) {
  if (min == null || max == null || max === min) return 'mid'
  const t = (price - min) / (max - min)
  if (t <= 0.33) return 'cheap'
  if (t >= 0.66) return 'high'
  return 'mid'
}

export const tierText = {
  cheap: 'text-green-700',
  mid: 'text-amber-600',
  high: 'text-red-600',
}

export const tierBg = {
  cheap: 'bg-green-100 text-green-800',
  mid: 'bg-amber-100 text-amber-800',
  high: 'bg-red-100 text-red-800',
}
