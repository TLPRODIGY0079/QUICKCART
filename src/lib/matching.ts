import type { Area, Runner, Service, Vehicle } from '@/data/fixtures'
import { runners as allRunners } from '@/data/fixtures'

/** Great-circle distance in km between two points. */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

// Average city speeds in km/h, used for ETA estimates.
const speed: Record<Vehicle, number> = {
  motorbike: 28,
  car: 24,
  van: 20,
  bicycle: 14,
  'on-foot': 5,
}

export interface Match {
  runner: Runner
  kmToPickup: number
  etaMin: number
  score: number
  reasons: string[]
}

/**
 * Rank runners for a job. The runner is sent to the *pickup* point first
 * (the shop, market, school or airport), so proximity to that point counts most.
 * Rating, specialty and verification adjust the score.
 */
export function matchRunners(service: Service, pickup: Area, pool: Runner[] = allRunners): Match[] {
  return pool
    .filter((r) => r.online)
    .filter((r) => service.vehicles.includes(r.vehicle))
    .filter((r) => !service.needsVerifiedRunner || r.verified)
    .map((runner) => {
      const kmToPickup = distanceKm(runner, pickup)
      const specialist = runner.specialties.includes(service.id)
      const score = kmToPickup + (5 - runner.rating) * 6 - (specialist ? 1.5 : 0)
      const reasons: string[] = []
      if (kmToPickup < 2) reasons.push('Very close to pickup')
      if (specialist) reasons.push(`Does ${service.name.toLowerCase()} often`)
      if (runner.verified) reasons.push('ID & background verified')
      if (runner.rating >= 4.95) reasons.push('Top rated')
      return {
        runner,
        kmToPickup,
        etaMin: Math.max(3, Math.round((kmToPickup / speed[runner.vehicle]) * 60) + 2),
        score,
        reasons,
      }
    })
    .filter((m) => m.kmToPickup < 60) // only runners in the same town
    .sort((a, b) => a.score - b.score)
}

export function estimatePrice(service: Service, from: Area, to: Area) {
  const km = distanceKm(from, to)
  const total = Math.round(service.basePrice + km * service.perKm)
  return { km, total }
}

export const formatKwacha = (n: number) => `K${n.toLocaleString('en-ZM', { maximumFractionDigits: 0 })}`
