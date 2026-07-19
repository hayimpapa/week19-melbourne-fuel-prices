import { useEffect, useMemo, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import { formatPrice } from '../utils/format.js'
import { formatDistance } from '../utils/distance.js'
import { priceTier } from '../utils/priceTier.js'

const MELBOURNE_CENTER = [-37.8136, 144.9631]

function priceIcon(price, tier) {
  return L.divIcon({
    className: 'price-marker',
    html: `<div class="price-bubble price-${tier}">${formatPrice(price)}</div>`,
    iconSize: [46, 26],
    iconAnchor: [23, 30],
    popupAnchor: [0, -30],
  })
}

const userIcon = L.divIcon({
  className: 'user-location-marker',
  html: '<div class="user-dot"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

// Keeps the map framed to the current results (and the user, if located).
function FitToResults({ stations, userLocation }) {
  const map = useMap()
  useEffect(() => {
    const points = stations.map((s) => [s.latitude, s.longitude])
    if (userLocation) points.push([userLocation.latitude, userLocation.longitude])
    if (points.length === 0) return
    // animate:false avoids an in-flight zoom animation firing its callback
    // after the map is unmounted (e.g. toggling to list view), which otherwise
    // throws a harmless-but-noisy "_leaflet_pos" error.
    if (points.length === 1) {
      map.setView(points[0], 14, { animate: false })
      return
    }
    map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 15, animate: false })
  }, [stations, userLocation, map])
  return null
}

export default function MapView({ stations, min, max, cheapestId, userLocation, radiusKm }) {
  const markerRefs = useRef({})

  const markers = useMemo(
    () =>
      stations.map((s) => {
        const tier = priceTier(s.price, min, max)
        return { station: s, icon: priceIcon(s.price, tier) }
      }),
    [stations, min, max],
  )

  return (
    <div className="h-full w-full">
      <MapContainer
        center={MELBOURNE_CENTER}
        zoom={12}
        scrollWheelZoom
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitToResults stations={stations} userLocation={userLocation} />

        {userLocation && (
          <>
            <Marker
              position={[userLocation.latitude, userLocation.longitude]}
              icon={userIcon}
              zIndexOffset={1000}
            >
              <Popup>You are here</Popup>
            </Marker>
            <Circle
              center={[userLocation.latitude, userLocation.longitude]}
              radius={radiusKm * 1000}
              pathOptions={{ color: '#2563eb', weight: 1, fillOpacity: 0.05 }}
            />
          </>
        )}

        {markers.map(({ station, icon }) => (
          <Marker
            key={station.id}
            position={[station.latitude, station.longitude]}
            icon={icon}
            ref={(ref) => {
              if (ref) markerRefs.current[station.id] = ref
            }}
          >
            <Popup>
              <div className="min-w-[180px]">
                <div className="flex items-center gap-2">
                  <strong className="text-sm">{station.name}</strong>
                  {station.id === cheapestId && (
                    <span className="rounded bg-green-600 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                      Cheapest
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-xs text-gray-500">
                  {station.address}
                  {station.suburb ? `, ${station.suburb}` : ''}
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-xl font-extrabold tabular-nums text-gray-900">
                    {formatPrice(station.price)}
                  </span>
                  <span className="text-xs text-gray-500">¢/L · 91 unleaded</span>
                </div>
                {station.distanceKm != null && (
                  <div className="mt-1 text-xs text-gray-500">
                    {formatDistance(station.distanceKm)} away
                  </div>
                )}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-xs font-medium text-brand-600 underline"
                >
                  Directions ↗
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
