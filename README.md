# Melbourne Fuel Finder ⛽

Find the cheapest **91 unleaded** petrol near you across Melbourne — on a map or
as a scrollable list.

App **#19** of my *52 apps in 52 weeks* project.

> **Prices are indicative and delayed by up to ~24 hours.** Fuel price data
> provided by **Service Victoria**. This is an independent app and is not
> endorsed by or affiliated with Service Victoria or the Victorian Government.

## Features

- 🗺️ **Map view** — service stations as colour-coded price pins (green = cheapest
  in view, red = dearest), built on Leaflet + OpenStreetMap (no API key needed).
- ☰ **List view** — a scrollable alternative for people who prefer to browse.
- 🔀 **Sort** — cheapest first, or nearest first once you share your location.
- 📍 **Near me** — opt-in browser geolocation with a radius slider (1–25 km).
- 📱 **Mobile-first** — designed for a phone, works on desktop.
- 🧭 One-tap **Directions** to any station via Google Maps.

## Tech stack

React + Vite · Tailwind CSS · Leaflet + OpenStreetMap · Supabase · Vercel

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build to dist/
npm run preview    # preview the production build
```

## Data source

Live data comes from the **Fair Fuel Open Data API** (Service Victoria). Because
the API is server-to-server, HTTPS-only, requires a secret Consumer ID, and
rate-limits to 10 requests / 60s, the browser never calls it directly. Instead:

```
browser  ──►  /api/stations  (Vercel serverless proxy, api/stations.js)  ──►  Fair Fuel API
                    │
                    ├─ holds the Consumer ID server-side (never shipped to the client)
                    ├─ joins brand names (/fuel/reference-data/brands)
                    ├─ keeps the 91-unleaded (U91) price, filters to Greater Melbourne
                    └─ CDN-cached 30 min → stays well under the upstream rate limit
```

The frontend talks to data through one seam,
[`src/api/fuelApi.js`](src/api/fuelApi.js), which returns a normalised `Station`
shape (see [`src/data/mockStations.js`](src/data/mockStations.js)). Mock data of
the same shape keeps the whole UI working offline.

**Source selection** (see [`.env.example`](.env.example)):

- Unset → **mock during `vite dev`**, **live in a production build** (automatic).
- `VITE_USE_MOCK_DATA=true` → always mock · `=false` → always live.

### Deploying (Vercel)

Set the Consumer ID as an environment variable in the Vercel project — it is read
only by the serverless function, never exposed to the browser:

```
FAIR_FUEL_CONSUMER_ID = <your Service Victoria x-consumer-id>
```

For live data locally, run `vercel dev` (so `/api/stations` is served) with the
same var in `.env.local`. Plain `vite dev` uses mock data.

> The Melbourne bounding box lives in `api/stations.js` (`MELBOURNE_BOUNDS`) —
> widen or remove it to cover more of Victoria.

## Project layout

```
api/
  stations.js             # Vercel serverless proxy for the Fair Fuel API
src/
  api/fuelApi.js          # data seam: mock or live via /api/stations
  data/mockStations.js    # sample Melbourne stations (normalised shape)
  components/              # Header, Footer, Filters, MapView, ListView, StationCard
  hooks/useGeolocation.js # opt-in browser geolocation
  utils/                  # haversine distance, price formatting, colour tiers
  App.jsx                 # data load + filter/sort/derive state
```

## Attribution

Fuel price data provided by **Service Victoria**. Map data ©
[OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.
