// Attribution is required by the Service Victoria API terms. We credit the
// data source without implying government endorsement of this app.
export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white px-4 py-4 text-center text-xs text-gray-500">
      <p>
        Fuel price data provided by{' '}
        <span className="font-medium text-gray-700">Service Victoria</span>.
      </p>
      <p className="mt-1">
        Prices are indicative and delayed by up to 24 hours. This is an
        independent app and is not endorsed by or affiliated with Service
        Victoria or the Victorian Government.
      </p>
      <p className="mt-1">
        Map data ©{' '}
        <a
          href="https://www.openstreetmap.org/copyright"
          className="underline hover:text-gray-700"
          target="_blank"
          rel="noreferrer"
        >
          OpenStreetMap
        </a>{' '}
        contributors.
      </p>
    </footer>
  )
}
