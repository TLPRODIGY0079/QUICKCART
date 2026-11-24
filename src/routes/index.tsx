import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowRight, BadgeCheck, Bike, MapPin, ShieldCheck, Smartphone, Star, Store as StoreIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { areas, areaById, runners, services, stats, stores, type ServiceId } from '@/data/fixtures'
import { ServiceIcon } from '@/components/tuma/service-icon'
import { MiniMap } from '@/components/tuma/mini-map'
import { cdnImg } from '@/components/tuma/img'
import { formatKwacha } from '@/lib/matching'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <>
      <Hero />
      <Services />
      <HowMatching />
      <StoresStrip />
      <Moments />
      <JoinCtas />
    </>
  )
}

function Hero() {
  const [service, setService] = useState<ServiceId>('shopping')
  const [from, setFrom] = useState('manda-hill')
  const lusaka = areas.filter((a) => a.city === 'Lusaka')

  return (
    <section className="relative overflow-hidden">
      <div className="chitenge pointer-events-none absolute inset-x-0 top-0 h-full opacity-60" aria-hidden />
      <div className="relative mx-auto grid max-w-content items-center gap-10 px-4 py-12 sm:px-6 md:py-20 lg:grid-cols-[1.05fr_1fr]">
        <div className="animate-rise space-y-7">
          <span className="inline-flex items-center gap-2 rounded-full border bg-white/70 backdrop-blur-[30px] saturate-[200%] border-white/30 px-3 py-1 text-xs font-semibold text-secondary">
            <span className="size-2 rounded-full bg-secondary" /> {stats.runners} runners online across Zambia
          </span>
          <h1 className="font-display text-5xl font-extrabold leading-[0.95] sm:text-6xl lg:text-7xl">
            Tuma someone.
            <br />
            <span className="text-primary">For anything.</span>
          </h1>
          <p className="max-w-lg text-lg text-muted-foreground">
            Groceries from Soweto Market, a parcel to Kitwe, the kids from school, a guest from KKIA, your car to
            the garage. Tell us what you need and we match the closest trusted runner in minutes.
          </p>

          <div className="bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-[30px] saturate-[200%] border border-white/50 shadow-lg rounded-2xl p-4 sm:p-5">
            <p className="mb-3 text-sm font-semibold">What do you need done?</p>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Service">
              {services.map((s) => (
                <button
                  key={s.id}
                  role="radio"
                  aria-checked={service === s.id}
                  onClick={() => setService(s.id)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors motion-reduce:transition-none',
                    service === s.id ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-muted',
                  )}
                >
                  <ServiceIcon id={s.id} className="size-4" />
                  {s.name}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <label className="flex flex-1 items-center gap-2 rounded-xl border bg-background px-3">
                <MapPin className="size-4 text-primary" aria-hidden />
                <span className="sr-only">Pickup area</span>
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="h-11 w-full bg-transparent text-sm outline-none"
                >
                  {lusaka.map((a) => (
                    <option key={a.id} value={a.id}>
                      Start from {a.name}
                    </option>
                  ))}
                </select>
              </label>
              <Button asChild size="lg" className="h-11 rounded-xl px-6">
                <Link to="/request" search={{ service, from }}>
                  Find a runner <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>

          <dl className="grid max-w-md grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Avg. match</dt>
              <dd className="font-display text-2xl font-bold">{stats.avgMatch}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Towns</dt>
              <dd className="font-display text-2xl font-bold">{stats.towns}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Rating</dt>
              <dd className="flex items-center gap-1 font-display text-2xl font-bold">
                {stats.rating} <Star className="size-4 fill-primary text-primary" aria-hidden />
              </dd>
            </div>
          </dl>
        </div>

        <div className="animate-rise relative [animation-delay:150ms]">
          <img
            src={cdnImg('hero-runner.png')}
            srcSet={`${cdnImg('hero-runner.png')} 600w, ${cdnImg('hero-runner.png')} 900w, ${cdnImg('hero-runner.png')} 1300w`}
            sizes="(min-width: 1024px) 560px, 100vw"
            alt="A smiling Tuma runner on a motorbike carrying fresh vegetables from a Lusaka market"
            className="aspect-[4/5] w-full rounded-[2rem] object-cover object-[60%_center] shadow-2xl sm:aspect-[5/4] lg:aspect-[4/5]"
            fetchPriority="high"
          />
          <div className="absolute -left-3 top-8 flex items-center gap-3 rounded-2xl bg-white/70 backdrop-blur-[30px] saturate-[200%] border border-white/30 p-3 shadow-lg sm:-left-8">
            <span className="grid size-10 place-items-center rounded-full bg-secondary font-bold text-secondary-foreground">MB</span>
            <div className="text-sm">
              <p className="font-semibold">Mwila is 4 min away</p>
              <p className="text-muted-foreground">1.2 km from Manda Hill</p>
            </div>
          </div>
          <div className="absolute -right-2 bottom-8 w-56 rounded-2xl bg-white/70 backdrop-blur-[30px] saturate-[200%] border border-white/30 p-4 shadow-lg sm:-right-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Order · Shop & deliver</p>
            <p className="mt-1 font-semibold">Kapenta, tomatoes, chicken</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-2/3 rounded-full bg-primary" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Shopping at Soweto Market…</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section className="mx-auto max-w-content px-4 py-16 sm:px-6" aria-labelledby="services-h">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">One app, every errand</p>
          <h2 id="services-h" className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            If it needs doing, a runner can do it.
          </h2>
        </div>
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/request">See all services</Link>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Link
            key={s.id}
            to="/request"
            search={{ service: s.id }}
            className={cn(
              'group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-[30px] saturate-[200%] border border-white/50 p-6 transition-all hover:-translate-y-1 hover:shadow-xl motion-reduce:transition-none',
              i === 0 ? 'bg-primary text-primary-foreground lg:row-span-2' : i === 2 ? 'bg-secondary text-secondary-foreground' : 'bg-card',
            )}
          >
            <div>
              <span
                className={cn(
                  'grid size-12 place-items-center rounded-2xl',
                  i === 0 || i === 2 ? 'bg-white/15' : 'bg-accent text-accent-foreground',
                )}
              >
                <ServiceIcon id={s.id} className="size-6" />
              </span>
              <h3 className={cn('mt-5 font-display font-bold', i === 0 ? 'text-3xl' : 'text-xl')}>{s.name}</h3>
              <p className={cn('mt-2', i === 0 || i === 2 ? 'opacity-85' : 'text-muted-foreground')}>{s.tagline}</p>
              {i === 0 && <p className="mt-6 max-w-xs text-sm opacity-75">e.g. {s.example}</p>}
            </div>
            <div className="mt-6 flex items-center justify-between text-sm font-semibold">
              <span>From {formatKwacha(s.basePrice)}</span>
              <span className="inline-flex items-center gap-1 transition-transform group-hover:translate-x-1">
                Book <ArrowRight className="size-4" />
              </span>
            </div>
            {s.needsVerifiedRunner && (
              <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-[11px] font-semibold text-secondary">
                <BadgeCheck className="size-3" /> Verified only
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}

function HowMatching() {
  const pickup = areaById('soweto')!
  const dropoff = areaById('kabulonga')!
  const pins = [
    { id: 'a', lat: pickup.lat, lng: pickup.lng, label: 'Soweto Market', kind: 'pickup' as const },
    { id: 'b', lat: dropoff.lat, lng: dropoff.lng, label: 'Your home, Kabulonga', kind: 'dropoff' as const },
    ...runners
      .filter((r) => r.lat < -15.3 && r.lat > -15.46 && r.lng < 28.38)
      .map((r) => ({ id: r.id, lat: r.lat, lng: r.lng, label: r.name, kind: r.id === 'r3' ? ('runner-best' as const) : ('runner' as const) })),
  ]
  const steps = [
    { t: 'Tell us the job', d: 'Pick a service, where the item or person is, and where it needs to go. Add a shopping list or notes.' },
    { t: 'We match by the pickup point', d: 'Tuma ranks runners by distance to where the job starts (the shop, school or airport), then by rating, vehicle and specialty.' },
    { t: 'Track, chat & pay', d: 'Follow your runner live, approve substitutions, and pay with mobile money or card when it is done.' },
  ]
  return (
    <section className="bg-foreground py-20 text-background">
      <div className="mx-auto grid max-w-content items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Smart matching</p>
          <h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">The runner closest to the job, not just to you.</h2>
          <ol className="mt-10 space-y-7">
            {steps.map((s, i) => (
              <li key={s.t} className="flex gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary font-display font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold">{s.t}</h3>
                  <p className="mt-1 text-background/65">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="relative">
          <MiniMap pins={pins} className="aspect-square border-background/10" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-card p-4 text-card-foreground shadow-xl">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-secondary font-bold text-secondary-foreground">JP</span>
              <div>
                <p className="font-semibold">Joseph P. · 0.9 km from Soweto</p>
                <p className="text-sm text-muted-foreground">Motorbike · ★ 4.88 · 2,210 trips</p>
              </div>
            </div>
            <span className="hidden rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground sm:inline">Best match</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function StoresStrip() {
  return (
    <section className="mx-auto max-w-content px-4 py-20 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Shop local</p>
          <h2 className="mt-2 font-display text-4xl font-bold">Stores on Tuma</h2>
          <p className="mt-2 max-w-lg text-muted-foreground">From market stalls to pharmacies, browse what is in stock and a runner brings it to you.</p>
        </div>
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/stores">Browse all stores</Link>
        </Button>
      </div>
      <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6">
        {stores.map((s) => (
          <Link
            key={s.id}
            to="/stores/$storeId"
            params={{ storeId: s.id }}
            className="group w-64 shrink-0 snap-start overflow-hidden rounded-3xl border bg-card transition-shadow hover:shadow-lg"
          >
            <div className={cn('grid h-28 place-items-center bg-gradient-to-br text-5xl', s.accent)}>
              <span className="transition-transform group-hover:scale-110 motion-reduce:transition-none">{s.emoji}</span>
            </div>
            <div className="p-4">
              <p className="font-semibold">{s.name}</p>
              <p className="text-sm text-muted-foreground">
                {s.category} · {areaById(s.areaId)?.name}
              </p>
              <p className="mt-2 flex items-center gap-1 text-sm">
                <Star className="size-3.5 fill-primary text-primary" aria-hidden /> {s.rating}{' '}
                <span className="text-muted-foreground">({s.reviews})</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function Moments() {
  return (
    <section className="mx-auto grid max-w-content gap-6 px-4 sm:px-6 md:grid-cols-2">
      <figure className="relative overflow-hidden rounded-[2rem]">
        <img
          src={cdnImg('school-pickup.png')}
          alt="A verified Tuma driver opening the car door for two schoolchildren"
          loading="lazy"
          className="aspect-[4/3] w-full object-cover"
        />
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20 text-white">
          <p className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="size-4" /> Family-safe runs</p>
          <p className="mt-1 font-display text-2xl font-bold">School pickups with a shared PIN, live tracking and a verified driver.</p>
        </figcaption>
      </figure>
      <figure className="relative overflow-hidden rounded-[2rem]">
        <img
          src={cdnImg('market.png')}
          alt="A market vendor handing a bag of produce to a runner"
          loading="lazy"
          className="aspect-[4/3] w-full object-cover"
        />
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20 text-white">
          <p className="flex items-center gap-2 text-sm font-semibold"><Smartphone className="size-4" /> Pay with mobile money</p>
          <p className="mt-1 font-display text-2xl font-bold">Your runner sends photos from the stall. Approve swaps before they buy.</p>
        </figcaption>
      </figure>
    </section>
  )
}

function JoinCtas() {
  return (
    <section className="mx-auto mt-20 grid max-w-content gap-6 px-4 sm:px-6 md:grid-cols-2">
      <div className="rounded-[2rem] bg-secondary p-8 text-secondary-foreground sm:p-10">
        <Bike className="size-8" aria-hidden />
        <h2 className="mt-4 font-display text-3xl font-bold">Earn as a runner</h2>
        <p className="mt-2 max-w-sm opacity-80">On foot, bicycle, motorbike, car or van. Pick jobs near you, set your hours, and get paid to mobile money daily.</p>
        <Button asChild variant="outline" className="mt-6 rounded-full border-transparent bg-background text-foreground">
          <Link to="/runners">See jobs near you</Link>
        </Button>
      </div>
      <div className="chitenge rounded-[2rem] border bg-card p-8 sm:p-10">
        <StoreIcon className="size-8 text-primary" aria-hidden />
        <h2 className="mt-4 font-display text-3xl font-bold">List your store</h2>
        <p className="mt-2 max-w-sm text-muted-foreground">Shops, market stalls, pharmacies and restaurants: show your products to thousands of buyers. Runners handle delivery.</p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/business">Create a store account</Link>
        </Button>
      </div>
    </section>
  )
}
