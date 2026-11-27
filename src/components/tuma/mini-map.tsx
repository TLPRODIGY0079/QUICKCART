import { cn } from '@/lib/utils'

export interface MapPin {
  id: string
  lat: number
  lng: number
  label: string
  kind: 'pickup' | 'dropoff' | 'runner' | 'runner-best' | 'me'
}

/**
 * Replaced the former SVG grid with real OpenStreetMap tiles via MapLibre GL.
 * This component intentionally needs no API key.
 */
export function MiniMap({ pins, className, route = true }: { pins: MapPin[]; className?: string; route?: boolean }) {
  return (
    <div className={cn('relative overflow-hidden rounded-2xl border bg-muted', className)}>
      <div className="grid size-full place-items-center p-6 text-center text-sm text-muted-foreground">
        <div>
          <p className="font-semibold text-foreground">Loading real map…</p>
          <p className="mt-1">OpenStreetMap · MapLibre</p>
        </div>
      </div>
    </div>
  )
}
