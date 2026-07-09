import { formatPrice } from '../utils/format.js'
import { formatDistance } from '../utils/distance.js'
import { priceTier, tierText } from '../utils/priceTier.js'

export default function StationCard({ station, min, max, isCheapest, onSelect, active }) {
  const tier = priceTier(station.price, min, max)
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`

  return (
    <div
      onClick={onSelect ? () => onSelect(station) : undefined}
      className={`flex items-center gap-3 rounded-xl border bg-white p-3 transition ${
        active ? 'border-brand-500 ring-1 ring-brand-500' : 'border-gray-200'
      } ${onSelect ? 'cursor-pointer hover:border-brand-300 hover:shadow-sm' : ''}`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-semibold text-gray-900">{station.name}</h3>
          {isCheapest && (
            <span className="shrink-0 rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Cheapest
            </span>
          )}
        </div>
        <p className="truncate text-sm text-gray-500">
          {station.address}, {station.suburb}
        </p>
        <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
          <span>{station.brand}</span>
          {station.distanceKm != null && (
            <span className="font-medium text-gray-600">
              {formatDistance(station.distanceKm)} away
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <div className={`text-right leading-none ${tierText[tier]}`}>
          <span className="text-2xl font-extrabold tabular-nums">{formatPrice(station.price)}</span>
          <span className="ml-0.5 text-xs font-medium text-gray-400">¢/L</span>
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50"
        >
          Directions ↗
        </a>
      </div>
    </div>
  )
}
