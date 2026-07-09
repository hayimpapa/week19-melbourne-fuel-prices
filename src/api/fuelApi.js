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

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false'

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

// ---------------------------------------------------------------------------
// TODO(step 3): wire the real Servo Saver / Service Victoria API here.
//
// Waiting on from the project owner:
//   - Consumer ID (and how it is passed: header? query param? name?)
//   - Base URL + the exact endpoint for station prices
//   - Request method + body (GET vs POST, any required geo/bounds params)
//   - Response JSON shape (station identity, lat/lng, fuel-type coding for U91,
//     price units, and the freshness/last-updated field)
//
// Map that response into the normalised Station shape above and return it.
// A Supabase Edge Function or serverless proxy will likely be needed to keep
// the Consumer ID off the client and to handle CORS — TBD once auth is known.
// ---------------------------------------------------------------------------
async function fetchLiveStations() {
  throw new Error(
    'Live Servo Saver API not wired up yet. Set VITE_USE_MOCK_DATA=true (default) ' +
      'or provide the API request format to implement fetchLiveStations().',
  )
}
