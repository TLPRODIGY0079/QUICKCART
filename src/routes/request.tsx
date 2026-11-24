import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowRight, BadgeCheck, CalendarClock, Check, Loader2, MessageCircle, Phone, Star, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { areas, areaById, services, storeById, type ServiceId } from '@/data/fixtures'
import { ServiceIcon } from '@/components/tuma/service-icon'
import { MiniMap, type MapPin } from '@/components/tuma/mini-map'
import { estimatePrice, formatKwacha, matchRunners, type Match } from '@/lib/matching'
import { cn } from '@/lib/utils'

const serviceIds = services.map((s) => s.id) as [ServiceId, ...ServiceId[]]

const searchSchema = z.object({
  service: z.enum(serviceIds).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  store: z.string().optional(),
  basket: z.number().optional(),
  items: z.number().optional(),
})

export const Route = createFileRoute('/request')({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: 'Send a runner · Tuma' }] }),
  component: RequestPage,
})

const pickupLabel: Record<ServiceId, string> = {
  shopping: 'Where should they shop?',
  parcel: 'Collect from',
  school: 'School location',
  airport: 'Airport',
  'car-service': 'Where is the car?',
  errand: 'Where does the errand start?',
}
const dropoffLabel: Record<ServiceId, string> = {
  shopping: 'Deliver to',
  parcel: 'Deliver to',
  school: 'Drop the kids at',
  airport: 'Drop passenger at',
  'car-service': 'Garage / service centre',
  errand: 'Finish at',
}
const notesPlaceholder: Record<ServiceId, string> = {
  shopping: 'Shopping list, e.g. 2kg kapenta, 1 tray eggs, 5L cooking oil. Call me before any substitutions.',
  parcel: 'What is it, how big, and who receives it?',
  school: "Children's names, class, and the pickup PIN you've shared with the school.",
  airport: 'Flight number, passenger name, number of bags.',
  'car-service': 'Car make & plate, booking reference, what the garage should check.',
  errand: 'Describe the errand in as much detail as you can.',
}
const paymentOptions = ['Airtel Money', 'MTN MoMo', 'Card', 'Cash'] as const

type Phase = 'details' | 'matching' | 'matched' | 'tracking'

function RequestPage() {
  const search = Route.useSearch()
  const store = search.store ? storeById(search.store) : undefined

  const [serviceId, setServiceId] = useState<ServiceId>(search.service ?? 'shopping')
  const [fromId, setFromId] = useState(store?.areaId ?? search.from ?? 'manda-hill')
  const [toId, setToId] = useState(search.to ?? 'kabulonga')
  const [notes, setNotes] = useState(store ? `Order from ${store.name}${search.items ? ` · ${search.items} items` : ''}` : '')
  const [when, setWhen] = useState<'now' | 'later'>('now')
  const [payment, setPayment] = useState<(typeof paymentOptions)[number]>('Airtel Money')
  const [phase, setPhase] = useState<Phase>('details')
  const [chosen, setChosen] = useState<string | null>(null)

  const service = services.find((s) => s.id === serviceId)!
  const from = areaById(fromId)!
  const to = areaById(toId)!
  const price = estimatePrice(service, from, to)
  const matches = useMemo(() => matchRunners(service, from), [service, from])
  const selected = matches.find((m) => m.runner.id === chosen) ?? matches[0]

  // Changing the job resets the flow back to details.
  useEffect(() => {
    setPhase('details')
    setChosen(null)
  }, [serviceId, fromId, toId])

  function findRunners() {
    if (fromId === toId && serviceId !== 'errand') {
      toast.error('Pickup and drop-off are the same place', { description: 'Choose a different drop-off area.' })
      return
    }
    setPhase('matching')
    setTimeout(() => setPhase('matched'), 1400)
  }

  const pins: MapPin[] = [
    { id: 'from', lat: from.lat, lng: from.lng, label: from.name, kind: 'pickup' },
    { id: 'to', lat: to.lat, lng: to.lng, label: to.name, kind: 'dropoff' },
    ...(phase === 'details'
      ? []
      : matches.slice(0, 6).map((m) => ({
          id: m.runner.id,
          lat: m.runner.lat,
          lng: m.runner.lng,
          label: `${m.runner.name} · ${m.kmToPickup.toFixed(1)} km`,
          kind: m.runner.id === selected?.runner.id ? ('runner-best' as const) : ('runner' as const),
        }))),
  ]

  const sameCity = from.city === to.city

  return (
    <div className="mx-auto grid max-w-content gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Send a runner</p>
          <h1 className="mt-1 font-display text-4xl font-bold">{phase === 'tracking' ? 'Your runner is on it' : 'What needs doing?'}</h1>
          {store && phase !== 'tracking' && (
            <p className="mt-2 rounded-xl bg-accent px-3 py-2 text-sm text-accent-foreground">
              Basket from <strong>{store.name}</strong>
              {search.basket ? ` · ${formatKwacha(search.basket)} in goods` : ''}. Your runner shops and pays at the store.
            </p>
          )}
        </div>

        {phase === 'tracking' && selected ? (
          <Tracking match={selected} serviceId={serviceId} fromName={from.name} toName={to.name} total={price.total + (search.basket ?? 0)} payment={payment} />
        ) : (
          <>
            <fieldset className="space-y-3">
              <legend className="mb-3 text-sm font-semibold">Service</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {services.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={s.id === serviceId}
                    onClick={() => setServiceId(s.id)}
                    className={cn(
                      'flex flex-col items-start gap-2 rounded-2xl border p-3 text-left text-sm transition-colors motion-reduce:transition-none',
                      s.id === serviceId ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'bg-card hover:bg-muted',
                    )}
                  >
                    <ServiceIcon id={s.id} className={cn('size-5', s.id === serviceId && 'text-primary')} />
                    <span className="font-semibold leading-tight">{s.name}</span>
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{service.tagline}</p>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <AreaSelect id="from" label={pickupLabel[serviceId]} value={fromId} onChange={setFromId} dot="bg-primary" />
              <AreaSelect id="to" label={dropoffLabel[serviceId]} value={toId} onChange={setToId} dot="bg-foreground" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Details for your runner</Label>
              <Textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={notesPlaceholder[serviceId]} />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="inline-flex rounded-full border bg-card p-1">
                {(['now', 'later'] as const).map((w) => (
                  <button
                    key={w}
                    type="button"
                    aria-pressed={when === w}
                    onClick={() => setWhen(w)}
                    className={cn('inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium', when === w ? 'bg-foreground text-background' : 'text-muted-foreground')}
                  >
                    {w === 'now' ? <Zap className="size-4" /> : <CalendarClock className="size-4" />}
                    {w === 'now' ? 'As soon as possible' : 'Schedule'}
                  </button>
                ))}
              </div>
              {when === 'later' && <Input type="datetime-local" className="w-auto" aria-label="Scheduled time" />}
            </div>

            <fieldset>
              <legend className="mb-2 text-sm font-semibold">Pay with</legend>
              <div className="flex flex-wrap gap-2">
                {paymentOptions.map((p) => (
                  <button
                    key={p}
                    type="button"
                    aria-pressed={payment === p}
                    onClick={() => setPayment(p)}
                    className={cn('rounded-full border px-3 py-1.5 text-sm', payment === p ? 'border-secondary bg-secondary text-secondary-foreground' : 'bg-card hover:bg-muted')}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="flex items-center justify-between rounded-2xl border bg-card p-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Runner fee · {price.km.toFixed(1)} km{!sameCity && ' · intercity'}
                </p>
                <p className="font-display text-3xl font-bold">{formatKwacha(price.total)}</p>
                {search.basket ? <p className="text-xs text-muted-foreground">+ {formatKwacha(search.basket)} goods paid at store</p> : null}
              </div>
              <Button size="lg" className="rounded-xl" onClick={findRunners} disabled={phase === 'matching'}>
                {phase === 'matching' ? <Loader2 className="animate-spin" /> : null}
                {phase === 'details' ? 'Find runners' : phase === 'matching' ? 'Matching…' : 'Refresh'}
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <MiniMap pins={pins} className="aspect-[4/3]" />

        {phase === 'details' && (
          <div className="rounded-2xl border border-dashed bg-card/60 p-6 text-center text-sm text-muted-foreground">
            We look for online runners nearest to <strong className="text-foreground">{from.name}</strong>, where the job starts, with the right
            vehicle{service.needsVerifiedRunner ? ' and a verified background check' : ''}.
          </div>
        )}

        {phase === 'matching' && (
          <div className="space-y-3" aria-live="polite" aria-busy>
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex animate-pulse items-center gap-3 rounded-2xl border bg-card p-4">
                <div className="size-11 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        {phase === 'matched' &&
          (matches.length === 0 ? (
            <div className="rounded-2xl border bg-card p-6 text-center">
              <p className="font-semibold">No runners available in {from.city} for this service right now</p>
              <p className="mt-1 text-sm text-muted-foreground">Try scheduling for later, or pick another service. We'll notify runners nearby.</p>
            </div>
          ) : (
            <div className="space-y-3" aria-live="polite">
              <p className="text-sm font-semibold">{matches.length} runners available · ranked by distance to pickup</p>
              <ul className="space-y-2">
                {matches.slice(0, 4).map((m, i) => (
                  <li key={m.runner.id}>
                    <RunnerCard match={m} best={i === 0} selected={m.runner.id === selected?.runner.id} onSelect={() => setChosen(m.runner.id)} />
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                className="w-full rounded-xl"
                onClick={() => {
                  setPhase('tracking')
                  toast.success(`${selected!.runner.name.split(' ')[0]} accepted your job`, { description: `Arriving at ${from.name} in ~${selected!.etaMin} min` })
                }}
              >
                Book {selected?.runner.name.split(' ')[0]} · {formatKwacha(price.total)} <ArrowRight />
              </Button>
            </div>
          ))}
      </div>
    </div>
  )
}

function AreaSelect({ id, label, value, onChange, dot }: { id: string; label: string; value: string; onChange: (v: string) => void; dot: string }) {
  const cities = [...new Set(areas.map((a) => a.city))]
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2">
        <span className={cn('size-2.5 rounded-full', dot)} /> {label}
      </Label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="h-11 w-full rounded-xl border bg-card px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
        {cities.map((c) => (
          <optgroup key={c} label={c}>
            {areas
              .filter((a) => a.city === c)
              .map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
          </optgroup>
        ))}
      </select>
    </div>
  )
}

function RunnerCard({ match, best, selected, onSelect }: { match: Match; best: boolean; selected: boolean; onSelect: () => void }) {
  const r = match.runner
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'flex w-full items-center gap-3 rounded-2xl border bg-card p-4 text-left transition-colors motion-reduce:transition-none',
        selected ? 'border-secondary ring-1 ring-secondary' : 'hover:bg-muted/60',
      )}
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary font-bold text-secondary-foreground">{r.initials}</span>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-1.5 font-semibold">
          {r.name}
          {r.verified && <BadgeCheck className="size-4 text-secondary" aria-label="Verified" />}
          {best && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">Best match</span>}
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="capitalize">{r.vehicle.replace('-', ' ')}</span> · <Star className="inline size-3 fill-primary text-primary" /> {r.rating} · {r.trips.toLocaleString()} trips
        </p>
        <p className="mt-1 truncate text-xs text-muted-foreground">{match.reasons.slice(0, 2).join(' · ')}</p>
      </div>
      <div className="text-right">
        <p className="font-display text-lg font-bold">{match.etaMin} min</p>
        <p className="text-xs text-muted-foreground">{match.kmToPickup.toFixed(1)} km</p>
      </div>
    </button>
  )
}

function Tracking({ match, serviceId, fromName, toName, total, payment }: { match: Match; serviceId: ServiceId; fromName: string; toName: string; total: number; payment: string }) {
  const middle: Record<ServiceId, string> = {
    shopping: `Shopping at ${fromName}`,
    parcel: `Collecting at ${fromName}`,
    school: `Waiting at the school gate`,
    airport: `Meeting passenger at arrivals`,
    'car-service': `Car checked in at the garage`,
    errand: `Working on your errand`,
  }
  const steps = ['Runner assigned', `Heading to ${fromName}`, middle[serviceId], `On the way to ${toName}`, 'Done. Rate your runner']
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (step >= steps.length - 1) return
    const t = setTimeout(() => setStep((s) => s + 1), 2600)
    return () => clearTimeout(t)
  }, [step, steps.length])

  const r = match.runner
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 rounded-2xl border bg-card p-4">
        <span className="grid size-14 place-items-center rounded-full bg-secondary text-lg font-bold text-secondary-foreground">{r.initials}</span>
        <div className="flex-1">
          <p className="font-semibold">{r.name}</p>
          <p className="text-sm text-muted-foreground">
            <span className="capitalize">{r.vehicle.replace('-', ' ')}</span>
            {r.plate ? ` · ${r.plate}` : ''} · {r.languages.join(', ')}
          </p>
        </div>
        <Button variant="outline" size="icon" className="rounded-full" aria-label={`Message ${r.name}`} onClick={() => toast('Chat opens here', { description: 'In-app chat arrives in a later milestone.' })}>
          <MessageCircle />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full" aria-label={`Call ${r.name}`} onClick={() => toast('Calling is masked for privacy', { description: 'Number masking arrives in a later milestone.' })}>
          <Phone />
        </Button>
      </div>

      <ol className="space-y-0" aria-live="polite">
        {steps.map((s, i) => (
          <li key={s} className="relative flex gap-4 pb-6 last:pb-0">
            {i < steps.length - 1 && <span className={cn('absolute left-[13px] top-7 h-full w-0.5', i < step ? 'bg-secondary' : 'bg-border')} />}
            <span
              className={cn(
                'relative z-10 grid size-7 shrink-0 place-items-center rounded-full border-2 transition-colors motion-reduce:transition-none',
                i < step ? 'border-secondary bg-secondary text-secondary-foreground' : i === step ? 'border-primary bg-primary text-primary-foreground' : 'bg-card',
              )}
            >
              {i < step ? <Check className="size-4" /> : i === step ? <span className="size-2 rounded-full bg-current" /> : null}
            </span>
            <p className={cn('pt-0.5', i <= step ? 'font-semibold' : 'text-muted-foreground')}>{s}</p>
          </li>
        ))}
      </ol>

      <div className="flex items-center justify-between rounded-2xl bg-muted p-4 text-sm">
        <span>
          Total · <strong>{payment}</strong>
        </span>
        <span className="font-display text-xl font-bold">{formatKwacha(total)}</span>
      </div>
      <Button asChild variant="outline" className="w-full rounded-xl">
        <Link to="/request" reloadDocument>
          Book another runner
        </Link>
      </Button>
    </div>
  )
}
