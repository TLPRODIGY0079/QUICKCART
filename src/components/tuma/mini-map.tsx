import { cn } from '@/lib/utils'

export interface MapPin {
  id: string
  lat: number
  lng: number
  label: string
  kind: 'pickup' | 'dropoff' | 'runner' | 'runner-best' | 'me'
}

function getMapUrl(pins: MapPin[]) {
  const validPins = pins.filter(
    (pin) => Number.isFinite(pin.lat) && Number.isFinite(pin.lng) && Math.abs(pin.lat) <= 90 && Math.abs(pin.lng) <= 180,
  )
  const points = validPins.length ? validPins : [{ lat: -15.4167, lng: 28.2833 }]
  const latitudes = points.map((pin) => pin.lat)
  const longitudes = points.map((pin) => pin.lng)
  const latSpan = Math.max(Math.max(...latitudes) - Math.min(...latitudes), 0.012)
  const lngSpan = Math.max(Math.max(...longitudes) - Math.min(...longitudes), 0.012)
  const latPadding = latSpan * 0.2
  const lngPadding = lngSpan * 0.2
  const bounds = [
    Math.min(...longitudes) - lngPadding,
    Math.max(-85, Math.min(...latitudes) - latPadding),
    Math.max(...longitudes) + lngPadding,
    Math.min(85, Math.max(...latitudes) + latPadding),
  ]
  const params = new URLSearchParams({
    bbox: bounds.join(','),
    layer: 'mapnik',
  })

  // The OSM embed API supports one marker. Center it on the pickup/first location.
  params.set('marker', `${points[0].lat},${points[0].lng}`)
  return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`
}

/** A keyless OpenStreetMap embed centered on the supplied locations. */
export function MiniMap({ pins, className, route = true }: { pins: MapPin[]; className?: string; route?: boolean }) {
  const validPins = pins.filter(
    (pin) => Number.isFinite(pin.lat) && Number.isFinite(pin.lng) && Math.abs(pin.lat) <= 90 && Math.abs(pin.lng) <= 180,
  )

  return (
    <div className={cn('relative isolate overflow-hidden rounded-2xl border bg-muted', className)}>
      <iframe
        title={route ? 'OpenStreetMap showing the pickup and delivery area' : 'OpenStreetMap showing nearby locations'}
        src={getMapUrl(validPins)}
        className="absolute inset-0 size-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      {validPins.length > 1 && (
        <div className="pointer-events-none absolute left-3 top-3 rounded-full border bg-background/95 px-3 py-1 text-xs font-semibold shadow-sm">
          {validPins.length} locations
        </div>
      )}
      <a
        href="https://www.openstreetmap.org/"
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-2 right-2 rounded bg-background/90 px-2 py-1 text-[10px] text-muted-foreground shadow-sm hover:text-foreground"
      >
        © OpenStreetMap
      </a>
    </div>
  )
}
