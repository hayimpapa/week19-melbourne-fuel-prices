// Format a cents-per-litre price like 189.9 as "189.9".
export function formatPrice(cents) {
  if (cents == null || Number.isNaN(cents)) return '—'
  return cents.toFixed(1)
}

// Human-friendly "as of" date, e.g. "Wed 8 Jul 2026".
export function formatAsOf(iso) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Australia/Melbourne',
  })
}
