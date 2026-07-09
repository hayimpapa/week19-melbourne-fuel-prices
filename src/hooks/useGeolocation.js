import { useCallback, useState } from 'react'

// Wraps the browser Geolocation API. Location is only requested when the user
// explicitly calls `request()` — never on mount — so the permission prompt is
// tied to a deliberate action ("find stations near me").
export function useGeolocation() {
  const [coords, setCoords] = useState(null) // { latitude, longitude }
  const [status, setStatus] = useState('idle') // idle | prompting | granted | error
  const [error, setError] = useState(null)

  const request = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('error')
      setError('Geolocation is not supported by your browser.')
      return
    }
    setStatus('prompting')
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
        setStatus('granted')
      },
      (err) => {
        setStatus('error')
        if (err.code === err.PERMISSION_DENIED) {
          setError('Location permission denied. You can still browse all stations.')
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError('Your location is currently unavailable.')
        } else if (err.code === err.TIMEOUT) {
          setError('Timed out getting your location. Try again.')
        } else {
          setError('Could not get your location.')
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }, [])

  const clear = useCallback(() => {
    setCoords(null)
    setStatus('idle')
    setError(null)
  }, [])

  return { coords, status, error, request, clear }
}
