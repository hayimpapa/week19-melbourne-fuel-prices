// ---------------------------------------------------------------------------
// Fuel data source
// ---------------------------------------------------------------------------
// This module is the single seam between the UI and where fuel prices come
// from. Right now it serves mock Melbourne data so the whole app (map, list,
// filters, geolocation) can be built and tested. When the Servo Saver
// (Service Victoria) API request format is confirmed, only `fetchLiveStations`
// below needs to be filled in — the rest of the app consumes the normalised
// Station shape and does not care where the data came from.
//
// Normalised Station shape (see src/data/mockStations.js):
//   {
//     id, name, brand, address, suburb, postcode,
//     latitude, longitude,
//     price,      // 91 unleaded (U91), cents per litre
//     updatedAt,  // ISO8601 — when Service Victoria last refreshed the price
//   }
// ---------------------------------------------------------------------------

import mockStations from '../data/mockStations.js'

// Data source resolution:
//   - If VITE_USE_MOCK_DATA is set, honour it ('false' => live, anything else => mock).
//   - Otherwise default to mock during `vite dev` (no serverless function running)
//     and to the live proxy in a production build.
const MOCK_FLAG = import.meta.env.VITE_USE_MOCK_DATA
const USE_MOCK = MOCK_FLAG != null ? MOCK_FLAG !== 'false' : import.meta.env.DEV

/**
 * Fetch service stations with 91 unleaded prices.
 * @returns {Promise<Array>} normalised Station objects
 */
export async function fetchStations() {
  if (USE_MOCK) {
    // Simulate a small network delay so loading states are visible in dev.
    await new Promise((r) => setTimeout(r, 600))
    return mockStations
  }
  return fetchLiveStations()
}

/**
 * Return the ISO date the price data reflects, for the "prices as of …" label.
 * With mock data we read it off the first record; with live data this should
 * come from the API's own freshness field.
 */
export function getDataAsOf(stations) {
  if (!stations || stations.length === 0) return null
  // Use the most recent updatedAt across the dataset.
  return stations.reduce((latest, s) => {
    return !latest || s.updatedAt > latest ? s.updatedAt : latest
  }, null)
}

// Live data comes through our own same-origin serverless proxy (api/stations.js),
// which holds the Service Victoria Consumer ID server-side, joins brand names,
// and returns the normalised Station shape. The browser never sees the key and
// there is no CORS to fight because the request is same-origin.
async function fetchLiveStations() {
  const res = await fetch('/api/stations', { headers: { Accept: 'application/json' } })
  if (!res.ok) {
    if (res.status === 429) {
      throw new Error('The fuel price service is busy right now. Please try again in a minute.')
    }
    throw new Error('Could not load live fuel prices. Please try again shortly.')
  }
  const data = await res.json()
  return data.stations || []
}
