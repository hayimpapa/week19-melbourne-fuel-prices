import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Filters from './components/Filters.jsx'
import MapView from './components/MapView.jsx'
import ListView from './components/ListView.jsx'
import { fetchStations, getDataAsOf } from './api/fuelApi.js'
import { useGeolocation } from './hooks/useGeolocation.js'
import { haversineKm } from './utils/distance.js'

export default function App() {
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [view, setView] = useState('map') // 'map' | 'list'
  const [sort, setSort] = useState('cheapest') // 'cheapest' | 'distance'
  const [radiusKm, setRadiusKm] = useState(10)

  const geo = useGeolocation()
  const userLocation = geo.coords

  // Load fuel data once on mount.
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchStations()
      .then((data) => {
        if (!cancelled) {
          setStations(data)
          setError(null)
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || 'Failed to load fuel prices.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // When the user shares location, default the sort to nearest.
  useEffect(() => {
    if (userLocation) setSort('distance')
  }, [userLocation])

  const asOf = useMemo(() => getDataAsOf(stations), [stations])

  // Derive the visible list: annotate distance, filter by radius, then sort.
  const visibleStations = useMemo(() => {
    let list = stations.map((s) => ({
      ...s,
      distanceKm: userLocation
        ? haversineKm(userLocation.latitude, userLocation.longitude, s.latitude, s.longitude)
        : null,
    }))

    if (userLocation) {
      list = list.filter((s) => s.distanceKm <= radiusKm)
    }

    if (sort === 'distance' && userLocation) {
      list.sort((a, b) => a.distanceKm - b.distanceKm)
    } else {
      list.sort((a, b) => a.price - b.price)
    }
    return list
  }, [stations, userLocation, radiusKm, sort])

  // Colour-scale bounds + cheapest station, computed over the visible set.
  const { min, max, cheapestId } = useMemo(() => {
    if (visibleStations.length === 0) return { min: null, max: null, cheapestId: null }
    let min = Infinity
    let max = -Infinity
    let cheapest = visibleStations[0]
    for (const s of visibleStations) {
      if (s.price < min) min = s.price
      if (s.price > max) max = s.price
      if (s.price < cheapest.price) cheapest = s
    }
    return { min, max, cheapestId: cheapest.id }
  }, [visibleStations])

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <Header asOf={asOf} />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          <Filters
            view={view}
            onViewChange={setView}
            sort={sort}
            onSortChange={setSort}
            radiusKm={radiusKm}
            onRadiusChange={setRadiusKm}
            hasLocation={!!userLocation}
            locationStatus={geo.status}
            onRequestLocation={geo.request}
            onClearLocation={geo.clear}
            resultCount={visibleStations.length}
          />

          {geo.error && (
            <div className="bg-amber-50 px-4 py-2 text-center text-sm text-amber-800">
              {geo.error}
            </div>
          )}

          <main className="relative min-h-0 flex-1">
            {view === 'map' ? (
              <MapView
                stations={visibleStations}
                min={min}
                max={max}
                cheapestId={cheapestId}
                userLocation={userLocation}
                radiusKm={radiusKm}
              />
            ) : (
              <div className="h-full overflow-y-auto">
                <ListView
                  stations={visibleStations}
                  min={min}
                  max={max}
                  cheapestId={cheapestId}
                />
              </div>
            )}
          </main>
        </>
      )}

      <Footer />
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-gray-500">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-brand-600" />
      <p className="text-sm">Loading fuel prices…</p>
    </div>
  )
}

function ErrorState({ message }) {
  return (
    <div className="flex flex-1 items-center justify-center p-8 text-center">
      <div>
        <p className="text-lg font-semibold text-gray-800">Couldn’t load fuel prices</p>
        <p className="mt-1 max-w-sm text-sm text-gray-500">{message}</p>
      </div>
    </div>
  )
}
