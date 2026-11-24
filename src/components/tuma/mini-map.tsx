import { cn } from '@/lib/utils'

export interface MapPin {
  id: string
  lat: number
  lng: number
  label: string
  kind: 'pickup' | 'dropoff' | 'runner' | 'runner-best' | 'me'
}

/**
 * A lightweight stylised map. Projects lat/lng into an SVG viewport that fits
 * all pins. A real tile map (Mapbox / Google Maps) replaces this in a later milestone.
 */
export function MiniMap({ pins, className, route = true }: { pins: MapPin[]; className?: string; route?: boolean }) {
  const lats = pins.map((p) => p.lat)
  const lngs = pins.map((p) => p.lng)
  const pad = 0.012
  const minLat = Math.min(...lats) - pad
  const maxLat = Math.max(...lats) + pad
  const minLng = Math.min(...lngs) - pad
  const maxLng = Math.max(...lngs) + pad
  const x = (lng: number) => ((lng - minLng) / (maxLng - minLng || 1)) * 100
  const y = (lat: number) => ((maxLat - lat) / (maxLat - minLat || 1)) * 100

  const pickup = pins.find((p) => p.kind === 'pickup')
  const dropoff = pins.find((p) => p.kind === 'dropoff')
  const best = pins.find((p) => p.kind === 'runner-best')

  return (
    <div className={cn('relative overflow-hidden rounded-2xl border bg-[oklch(0.94_0.03_120)]', className)}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
        <defs>
          <pattern id="blocks" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
            <rect width="9" height="9" fill="none" />
            <path d="M0 0H9M0 0V9" stroke="oklch(0.99 0.01 90)" strokeWidth="0.9" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#blocks)" />
        <path d="M-5 70 C 25 60, 40 75, 105 40" stroke="oklch(0.99 0.01 90)" strokeWidth="3" fill="none" />
        <path d="M30 -5 C 35 30, 55 55, 60 105" stroke="oklch(0.99 0.01 90)" strokeWidth="2.4" fill="none" />
        <circle cx="78" cy="22" r="9" fill="oklch(0.88 0.06 150)" />
        {route && best && pickup && (
          <line x1={x(best.lng)} y1={y(best.lat)} x2={x(pickup.lng)} y2={y(pickup.lat)} stroke="var(--secondary)" strokeWidth="0.7" strokeDasharray="1.6 1.4" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 2 }} />
        )}
        {route && pickup && dropoff && (
          <line x1={x(pickup.lng)} y1={y(pickup.lat)} x2={x(dropoff.lng)} y2={y(dropoff.lat)} stroke="var(--primary)" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 3 }} />
        )}
      </svg>
      {pins.map((p) => (
        <div
          key={p.id}
          className="group absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${x(p.lng)}%`, top: `${y(p.lat)}%` }}
        >
          {p.kind === 'runner-best' && <span className="pulse-ring absolute inset-0 rounded-full bg-secondary/40" />}
          <span
            className={cn(
              'relative grid place-items-center rounded-full border-2 border-white font-bold shadow-md',
              p.kind === 'pickup' && 'size-6 bg-primary text-[10px] text-primary-foreground',
              p.kind === 'dropoff' && 'size-6 bg-foreground text-[10px] text-background',
              p.kind === 'runner' && 'size-3.5 bg-secondary/70',
              p.kind === 'runner-best' && 'size-5 bg-secondary',
              p.kind === 'me' && 'size-5 bg-sky-500',
            )}
          >
            {p.kind === 'pickup' ? 'A' : p.kind === 'dropoff' ? 'B' : ''}
          </span>
          <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground/85 px-1.5 py-0.5 text-[10px] font-medium text-background opacity-0 transition-opacity group-hover:opacity-100">
            {p.label}
          </span>
        </div>
      ))}
    </div>
  )
}
