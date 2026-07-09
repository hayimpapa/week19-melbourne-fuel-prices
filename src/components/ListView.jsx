import StationCard from './StationCard.jsx'

export default function ListView({ stations, min, max, cheapestId, onSelect, activeId }) {
  if (stations.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center text-gray-500">
        <div>
          <p className="text-lg font-medium">No stations found</p>
          <p className="mt-1 text-sm">Try widening the radius or clearing your location.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-2 p-3 sm:p-4">
      {stations.map((s) => (
        <StationCard
          key={s.id}
          station={s}
          min={min}
          max={max}
          isCheapest={s.id === cheapestId}
          active={s.id === activeId}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
