import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, Clock, MapPin, Minus, Plus, ShoppingBag, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { areaById, storeById } from '@/data/fixtures'
import { formatKwacha } from '@/lib/matching'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/stores/$storeId')({
  loader: ({ params }) => {
    const store = storeById(params.storeId)
    if (!store) throw notFound()
    return { store }
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.store.name ?? 'Store'} · Tuma` }] }),
  component: StorePage,
})

function StorePage() {
  const { store } = Route.useLoaderData()
  const area = areaById(store.areaId)
  const [cart, setCart] = useState<Record<string, number>>({})

  const change = (id: string, d: number) =>
    setCart((c) => {
      const next = { ...c, [id]: Math.max(0, (c[id] ?? 0) + d) }
      if (next[id] === 0) delete next[id]
      return next
    })

  const items = Object.values(cart).reduce((a, b) => a + b, 0)
  const subtotal = store.products.reduce((sum, p) => sum + (cart[p.id] ?? 0) * p.price, 0)

  return (
    <div>
      <div className={cn('bg-gradient-to-br text-white', store.accent)}>
        <div className="mx-auto max-w-content px-4 py-10 sm:px-6">
          <Link to="/stores" className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white"><ArrowLeft className="size-4" /> All stores</Link>
          <div className="mt-6 flex flex-wrap items-end gap-6">
            <span className="grid size-24 place-items-center rounded-3xl bg-white/15 text-6xl backdrop-blur">{store.emoji}</span>
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-widest text-white/75">{store.category}</p>
              <h1 className="font-display text-4xl font-extrabold sm:text-5xl">{store.name}</h1>
              <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/85">
                <span className="flex items-center gap-1"><Star className="size-4 fill-white" />{store.rating} ({store.reviews} reviews)</span>
                <span className="flex items-center gap-1"><MapPin className="size-4" />{area?.name}, {area?.city}</span>
                <span className="flex items-center gap-1"><Clock className="size-4" />{store.openHours}</span>
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-white/90">{store.description}</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-content gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_340px]">
        <section aria-labelledby="products-h">
          <h2 id="products-h" className="font-display text-2xl font-bold">Products</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {store.products.map((p) => {
              const qty = cart[p.id] ?? 0
              return (
                <li key={p.id} className={cn('flex items-center gap-4 rounded-2xl border bg-card p-4 transition-colors', qty > 0 && 'border-primary/50 bg-primary/5')}>
                  <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-muted text-3xl">{p.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{formatKwacha(p.price)}{p.unit ? ` · ${p.unit}` : ''}</p>
                    {p.popular && <span className="mt-1 inline-block rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">Popular</span>}
                  </div>
                  {qty === 0 ? (
                    <Button size="icon" variant="outline" className="rounded-full" aria-label={`Add ${p.name}`} onClick={() => change(p.id, 1)}><Plus /></Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button size="icon-sm" variant="outline" className="rounded-full" aria-label={`Remove one ${p.name}`} onClick={() => change(p.id, -1)}><Minus /></Button>
                      <span className="w-5 text-center font-semibold" aria-live="polite">{qty}</span>
                      <Button size="icon-sm" className="rounded-full" aria-label={`Add one more ${p.name}`} onClick={() => change(p.id, 1)}><Plus /></Button>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border bg-card p-5 shadow-sm">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold"><ShoppingBag className="size-5 text-primary" /> Your basket</h2>
            {items === 0 ? (
              <p className="mt-4 rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">Add products and a nearby runner will shop them for you.</p>
            ) : (
              <ul className="mt-4 space-y-2 text-sm">
                {store.products.filter((p) => cart[p.id]).map((p) => (
                  <li key={p.id} className="flex justify-between gap-2">
                    <span>{cart[p.id]} × {p.name}</span>
                    <span className="font-medium">{formatKwacha(cart[p.id]! * p.price)}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-5 flex items-center justify-between border-t pt-4">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-display text-2xl font-bold">{formatKwacha(subtotal)}</span>
            </div>
            <Button asChild={items > 0} disabled={items === 0} size="lg" className="mt-4 w-full rounded-xl">
              {items > 0 ? (
                <Link to="/request" search={{ service: 'shopping', store: store.id, basket: subtotal, items }}>Send a runner to shop</Link>
              ) : (
                <span>Send a runner to shop</span>
              )}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">Runner fee is calculated from {area?.name} to your address.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
