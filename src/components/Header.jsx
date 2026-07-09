import { formatAsOf } from '../utils/format.js'

export default function Header({ asOf }) {
  return (
    <header className="bg-brand-600 text-white shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
        <span className="text-2xl" aria-hidden="true">
          ⛽
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold leading-tight sm:text-xl">
            Melbourne Fuel Finder
          </h1>
          <p className="text-xs text-brand-100">
            Cheapest 91 unleaded near you
            {asOf && (
              <>
                {' · '}
                <span className="whitespace-nowrap">prices as of {formatAsOf(asOf)}</span>
              </>
            )}
          </p>
        </div>
      </div>
    </header>
  )
}
