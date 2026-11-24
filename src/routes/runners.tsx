import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { ArrowRight, Banknote, Clock, MapPin, Navigation, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { areas, areaById, openJobs, services } from '@/data/fixtures'
import { ServiceIcon } from '@/components/tuma/service-icon'
import { MiniMap } from '@/components/tuma/mini-map'
import { distanceKm, formatKwacha } from '@/lib/matching'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/runners')({
  head: () => ({ meta: [{ title: 'Runner jobs · Tuma' }] }),
  component: RunnersPage,
})

function RunnersPage() {
  const [online, setOnline] = useState(true)
  const [baseId, setBaseId] = useState('woodlands')
  const [accepted, setAccepted] = useState<string[]>([])
  const base = areaById(baseId)!

  const jobs = useMemo(
    () =>
      openJobs
        .filter((j) => !accepted.includes(j.id))
        .map((j) => {
          const from = areaById(j.fromAreaId)!
          const to = areaById(j.toAreaId)!
          return { ...j, from, to, kmAway: distanceKm(base, from), tripKm: distanceKm(from, to) }
        })
        .filter((j) => j.kmAway < 60)
        .sort((a, b) => a.kmAway - b.kmAway),
    [accepted, base],
  )
  const earned = openJobs.filter((j) => accepted.includes(j.id)).reduce((s, j) => s + j.payout, 0) + 345

  const pins = [
    { id: 'me', lat: base.lat, lng: base.lng, label: 'You', kind: 'me' as const },
    ...jobs.slice(0, 6).map((j) => ({ id: j.id, lat: j.from.lat, lng: j.from.lng, label: j.title, kind: 'pickup' as const })),
  ]

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Runner app</p>
          <h1 className="mt-1 font-display text-4xl font-bold sm:text-5xl">Jobs near you</h1>
          <p className="mt-2 max-w-lg text-muted-foreground">You only see jobs that start close to you. Accept the ones that fit your vehicle and your day.</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border bg-card px-4 py-3">
          <Switch id="online" checked={online} onCheckedChange={setOnline} />
          <Label htmlFor="online" className="font-semibold">{online ? 'Online, receiving jobs' : 'Offline'}</Label>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat icon={<Wallet className="size-5" />} label="Earned today" value={formatKwacha(earned)} />
        <Stat icon={<Banknote className="size-5" />} label="Payout" value="Airtel Money, 18:00" />
        <Stat icon={<Navigation className="size-5" />} label="Jobs nearby" value={online ? String(jobs.length) : '—'} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_minmax(0,0.9fr)]">
        <section aria-labelledby="jobs-h">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 id="jobs-h" className="font-display text-2xl font-bold">Open jobs</h2>
            <label className="flex items-center gap-2 text-sm">
              <MapPin className="size-4 text-primary" aria-hidden /> I'm in
              <select value={baseId} onChange={(e) => setBaseId(e.target.value)} className="h-9 rounded-lg border bg-card px-2">
                {areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </label>
          </div>

          {!online ? (
            <div className="rounded-3xl border border-dashed p-12 text-center">
              <p className="font-display text-xl font-bold">You're offline</p>
              <p className="mt-1 text-muted-foreground">Go online to see jobs that start near {base.name}.</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-3xl border border-dashed p-12 text-center">
              <p className="font-display text-xl font-bold">No open jobs near {base.name}</p>
              <p className="mt-1 text-muted-foreground">New requests appear here the moment a client books nearby.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {jobs.map((j) => {
                const service = services.find((s) => s.id === j.service)!
                return (
                  <li key={j.id} className="flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center">
                    <span className={cn('grid size-12 shrink-0 place-items-center rounded-2xl', j.when === 'Now' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground')}>
                      <ServiceIcon id={j.service} className="size-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{service.name}{service.needsVerifiedRunner ? ' · verified only' : ''}</p>
                      <p className="font-semibold">{j.title}</p>
                      <p className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-muted-foreground">
                        <span>{j.from.name} <ArrowRight className="inline size-3" /> {j.to.name}</span>
                        <span className="flex items-center gap-1"><Clock className="size-3" />{j.when}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
                      <p className="font-display text-xl font-bold">{formatKwacha(j.payout)}</p>
                      <p className="text-xs text-muted-foreground">{j.kmAway.toFixed(1)} km away · {j.tripKm.toFixed(1)} km trip</p>
                      <Button
                        size="sm"
                        className="ml-auto rounded-full sm:ml-0 sm:mt-1"
                        onClick={() => {
                          setAccepted((a) => [...a, j.id])
                          toast.success('Job accepted', { description: `Head to ${j.from.name}. The client has been notified.` })
                        }}
                      >
                        Accept
                      </Button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <MiniMap pins={pins} route={false} className="aspect-square" />
          <div className="rounded-3xl bg-secondary p-6 text-secondary-foreground">
            <h2 className="font-display text-xl font-bold">Not a runner yet?</h2>
            <p className="mt-1 text-sm opacity-85">Sign up with your NRC, a selfie and your vehicle details. School and airport runs unlock after a background check.</p>
            <Button variant="outline" className="mt-4 rounded-full border-transparent bg-background text-foreground" onClick={() => toast('Runner sign-up is coming next', { description: 'Accounts and verification are part of the next milestone.' })}>
              Apply to run with Tuma
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-card p-4">
      <span className="grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground">{icon}</span>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-display text-xl font-bold">{value}</p>
      </div>
    </div>
  )
}
