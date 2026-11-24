import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Search, Star } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { areaById, stores, type StoreCategory } from '@/data/fixtures'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/stores/')({
  head: () => ({ meta: [{ title: 'Stores · Tuma' }] }),
  component: StoresPage,
})

const categories: ('All' | StoreCategory)[] = ['All', 'Groceries', 'Market', 'Restaurants', 'Pharmacy', 'Fashion', 'Hardware', 'Electronics']
const cities = ['All towns', 'Lusaka', 'Kitwe', 'Ndola', 'Livingstone'] as const

function StoresPage() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<(typeof categories)[number]>('All')
  const [city, setCity] = useState<(typeof cities)[number]>('All towns')

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    return stores.filter((s) => {
      if (cat !== 'All' && s.category !== cat) return false
      if (city !== 'All towns' && areaById(s.areaId)?.city !== city) return false
      if (!term) return true
      return s.name.toLowerCase().includes(term) || s.products.some((p) => p.name.toLowerCase().includes(term))
    })
  }, [q, cat, city])

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">Stores</p>
      <h1 className="mt-1 font-display text-4xl font-bold sm:text-5xl">Shop from anywhere in Zambia</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">Browse what local shops, stalls and restaurants have in stock. A runner nearby buys it and brings it to your door.</p>

      <div className="mt-8 flex flex-col gap-3 md:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search stores or products</span>
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search kapenta, mealie meal, paracetamol…" className="h-11 rounded-xl bg-card pl-9" />
        </label>
        <select aria-label="Town" value={city} onChange={(e) => setCity(e.target.value as (typeof cities)[number])} className="h-11 rounded-xl border bg-card px-3 text-sm">
          {cities.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={cn('rounded-full border px-3 py-1.5 text-sm font-medium', cat === c ? 'border-foreground bg-foreground text-background' : 'bg-card hover:bg-muted')}>
            {c}
          </button>
        ))}
      </div>

      {results.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed p-12 text-center">
          <p className="font-display text-xl font-bold">No stores match yet</p>
          <p className="mt-1 text-muted-foreground">Can't find it? Send a runner to buy it anywhere with “Shop & deliver”.</p>
          <Button asChild className="mt-5 rounded-full"><Link to="/request" search={{ service: 'shopping' }}>Send a shopper</Link></Button>
        </div>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((s) => {
            const area = areaById(s.areaId)
            return (
              <li key={s.id}>
                <Link to="/stores/$storeId" params={{ storeId: s.id }} className="group block overflow-hidden rounded-3xl border bg-card transition-all hover:-translate-y-1 hover:shadow-xl motion-reduce:transition-none">
                  <div className={cn('relative grid h-36 place-items-center bg-gradient-to-br text-6xl', s.accent)}>
                    <span className="transition-transform group-hover:scale-110 motion-reduce:transition-none">{s.emoji}</span>
                    <span className="absolute left-3 top-3 rounded-full bg-black/30 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur">{s.category}</span>
                  </div>
                  <div className="space-y-2 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-display text-lg font-bold">{s.name}</h2>
                      <span className="flex shrink-0 items-center gap-1 text-sm font-semibold"><Star className="size-3.5 fill-primary text-primary" aria-hidden />{s.rating}</span>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{s.description}</p>
                    <p className="text-xs text-muted-foreground">{area?.name}, {area?.city} · {s.openHours}</p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
