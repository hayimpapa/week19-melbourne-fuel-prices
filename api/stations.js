// ---------------------------------------------------------------------------
// Vercel serverless proxy for the Fair Fuel Open Data API (Service Victoria).
// ---------------------------------------------------------------------------
// Why a server-side proxy?
//   1. The Consumer ID is a secret and must never ship in client-side JS.
//   2. The API is server-to-server (no browser CORS) and HTTPS-only.
//   3. It rate-limits to 10 requests / 60s — we CDN-cache the response so the
//      thousands of visitors hitting a page turn into a trickle of upstream
//      calls (the data only changes ~once a day anyway).
//
// This endpoint fetches /fuel/prices + /fuel/reference-data/brands, joins the
// brand names, keeps the 91-unleaded (U91) price per station, and returns the
// normalised Station shape the frontend consumes (see src/data/mockStations.js).
//
// Required env var (set in Vercel project settings, never committed):
//   FAIR_FUEL_CONSUMER_ID  — the x-consumer-id key issued by Service Victoria.
// ---------------------------------------------------------------------------

import { randomUUID } from 'node:crypto'

const BASE_URL = 'https://api.fuel.service.vic.gov.au/open-data/v1'
const USER_AGENT = 'MelbourneFuelFinder/1.0'

// Greater Melbourne bounding box. The API returns all of Victoria; this keeps
// the app focused on its namesake city. Widen or remove to cover more of VIC.
export const MELBOURNE_BOUNDS = {
  latMin: -38.4,
  latMax: -37.4,
  lngMin: 144.3,
  lngMax: 145.6,
}

export function inMelbourne(lat, lng) {
  return (
    lat >= MELBOURNE_BOUNDS.latMin &&
    lat <= MELBOURNE_BOUNDS.latMax &&
    lng >= MELBOURNE_BOUNDS.lngMin &&
    lng <= MELBOURNE_BOUNDS.lngMax
  )
}

// "123 Main St, Melbourne VIC 3000" -> { street, suburb, postcode }
export function parseAddress(full) {
  const raw = (full || '').trim()
  if (!raw) return { street: '', suburb: '', postcode: '' }

  const postcodeMatch = raw.match(/\b(\d{4})\b/)
  const postcode = postcodeMatch ? postcodeMatch[1] : ''

  const parts = raw.split(',').map((s) => s.trim()).filter(Boolean)
  const street = parts[0] || raw

  let suburb = ''
  if (parts.length > 1) {
    suburb = parts[parts.length - 1]
      .replace(/\b(VIC|NSW|QLD|SA|WA|TAS|NT|ACT)\b/gi, ' ')
      .replace(/\b\d{4}\b/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }
  return { street, suburb, postcode }
}

/**
 * Map the raw Fair Fuel /fuel/prices payload into normalised Station objects,
 * keeping only stations that have an available U91 price and a location inside
 * Greater Melbourne.
 * @param {Array} priceDetails - fuelPriceDetails[] from the API
 * @param {Object} brandsById  - { [brandId]: brandName }
 */
export function normalizeStations(priceDetails = [], brandsById = {}) {
  const out = []
  for (const detail of priceDetails) {
    const st = detail.fuelStation
    if (!st || !st.location) continue

    const lat = st.location.latitude
    const lng = st.location.longitude
    if (lat == null || lng == null) continue
    if (!inMelbourne(lat, lng)) continue

    const u91 = (detail.fuelPrices || []).find(
      (p) => p.fuelType === 'U91' && p.isAvailable && p.price != null,
    )
    if (!u91) continue

    const { street, suburb, postcode } = parseAddress(st.address)
    out.push({
      id: st.id,
      name: st.name,
      brand: brandsById[st.brandId] || '',
      address: street || st.address || '',
      suburb,
      postcode,
      latitude: lat,
      longitude: lng,
      price: u91.price,
      updatedAt: u91.updatedAt || detail.updatedAt || null,
    })
  }
  return out
}

function fairFuelHeaders(consumerId) {
  return {
    'x-consumer-id': consumerId,
    'x-transactionid': randomUUID(),
    'User-Agent': USER_AGENT,
    Accept: 'application/json',
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const consumerId = process.env.FAIR_FUEL_CONSUMER_ID
  if (!consumerId) {
    return res.status(500).json({
      error: 'Server not configured: FAIR_FUEL_CONSUMER_ID is missing.',
    })
  }

  try {
    const [pricesRes, brandsRes] = await Promise.all([
      fetch(`${BASE_URL}/fuel/prices`, { headers: fairFuelHeaders(consumerId) }),
      fetch(`${BASE_URL}/fuel/reference-data/brands`, {
        headers: fairFuelHeaders(consumerId),
      }),
    ])

    if (!pricesRes.ok) {
      // Pass through rate limiting so the client can back off; otherwise mask
      // upstream detail behind a 502 without leaking anything sensitive.
      if (pricesRes.status === 429) {
        res.setHeader('Retry-After', '60')
        return res.status(429).json({ error: 'Upstream rate limit reached. Try again shortly.' })
      }
      return res.status(502).json({ error: 'Fuel price service is currently unavailable.' })
    }

    const pricesJson = await pricesRes.json()

    // Brands are a nice-to-have; if that call fails we still return prices.
    const brandsById = {}
    if (brandsRes.ok) {
      const brandsJson = await brandsRes.json()
      for (const b of brandsJson.brands || []) brandsById[b.id] = b.name
    }

    const stations = normalizeStations(pricesJson.fuelPriceDetails || [], brandsById)
    const asOf = stations.reduce(
      (latest, s) => (!latest || (s.updatedAt && s.updatedAt > latest) ? s.updatedAt : latest),
      null,
    )

    // Cache at the CDN for 30 min, serve stale for up to a day while revalidating.
    // Keeps us comfortably under the 10 req / 60s upstream rate limit.
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400')
    return res.status(200).json({ stations, asOf })
  } catch {
    return res.status(502).json({ error: 'Could not reach the fuel price service.' })
  }
}
