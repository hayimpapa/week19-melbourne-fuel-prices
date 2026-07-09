// Controls row: view toggle (map/list), sort, "near me", and radius slider.
// The radius slider and distance sort only apply once the user shares location.
export default function Filters({
  view,
  onViewChange,
  sort,
  onSortChange,
  radiusKm,
  onRadiusChange,
  hasLocation,
  locationStatus,
  onRequestLocation,
  onClearLocation,
  resultCount,
}) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-3">
        {/* Top row: view toggle + near me */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-gray-300 p-0.5" role="group" aria-label="View">
            <button
              type="button"
              onClick={() => onViewChange('map')}
              aria-pressed={view === 'map'}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                view === 'map' ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🗺️ Map
            </button>
            <button
              type="button"
              onClick={() => onViewChange('list')}
              aria-pressed={view === 'list'}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                view === 'list' ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ☰ List
            </button>
          </div>

          <div className="ml-auto">
            {hasLocation ? (
              <button
                type="button"
                onClick={onClearLocation}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                ✕ Clear location
              </button>
            ) : (
              <button
                type="button"
                onClick={onRequestLocation}
                disabled={locationStatus === 'prompting'}
                className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
              >
                {locationStatus === 'prompting' ? 'Locating…' : '📍 Near me'}
              </button>
            )}
          </div>
        </div>

        {/* Second row: sort + radius */}
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <span className="whitespace-nowrap">Sort by</span>
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="cheapest">Cheapest first</option>
              <option value="distance" disabled={!hasLocation}>
                Nearest first{!hasLocation ? ' (needs location)' : ''}
              </option>
            </select>
          </label>

          {hasLocation && (
            <label className="flex flex-1 items-center gap-3 text-sm text-gray-600">
              <span className="whitespace-nowrap">
                Within <span className="font-semibold text-gray-800">{radiusKm} km</span>
              </span>
              <input
                type="range"
                min="1"
                max="25"
                step="1"
                value={radiusKm}
                onChange={(e) => onRadiusChange(Number(e.target.value))}
                className="h-2 w-full flex-1 cursor-pointer accent-brand-600"
                aria-label="Search radius in kilometres"
              />
            </label>
          )}

          <span className="whitespace-nowrap text-sm text-gray-500 sm:ml-auto">
            {resultCount} station{resultCount === 1 ? '' : 's'}
          </span>
        </div>
      </div>
    </div>
  )
}
