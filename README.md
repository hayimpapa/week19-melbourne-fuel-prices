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

The app talks to its data through a single seam: [`src/api/fuelApi.js`](src/api/fuelApi.js).

- **Right now it serves mock Melbourne data** (`src/data/mockStations.js`) so the
  whole UI — map, list, filters, geolocation — is fully functional offline.
- The live **Servo Saver (Service Victoria)** API gets wired into
  `fetchLiveStations()` once the request format is confirmed. Everything else
  consumes the same normalised `Station` shape, so no UI changes are needed.

Toggle the source with an env var (see [`.env.example`](.env.example)):

```bash
VITE_USE_MOCK_DATA=true   # default; false once the live API is implemented
```

The Consumer ID will be kept off the client via a Supabase Edge Function /
serverless proxy (also handles CORS) — added in step 3.

## Project layout

```
src/
  api/fuelApi.js          # data seam: mock now, Servo Saver API later
  data/mockStations.js    # sample Melbourne stations (normalised shape)
  components/              # Header, Footer, Filters, MapView, ListView, StationCard
  hooks/useGeolocation.js # opt-in browser geolocation
  utils/                  # haversine distance, price formatting, colour tiers
  App.jsx                 # data load + filter/sort/derive state
```

## Attribution

Fuel price data provided by **Service Victoria**. Map data ©
[OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.
