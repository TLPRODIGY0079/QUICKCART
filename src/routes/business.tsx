import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { Eye, Plus, Star, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { areas, areaById, type StoreCategory } from '@/data/fixtures'
import { formatKwacha } from '@/lib/matching'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/business')({
  head: () => ({ meta: [{ title: 'List your store · Tuma' }] }),
  component: BusinessPage,
})

const categories: { name: StoreCategory; emoji: string; accent: string }[] = [
  { name: 'Groceries', emoji: '🛒', accent: 'from-emerald-600 to-teal-800' },
  { name: 'Market', emoji: '🧺', accent: 'from-amber-500 to-orange-700' },
  { name: 'Restaurants', emoji: '🍲', accent: 'from-red-600 to-rose-900' },
  { name: 'Pharmacy', emoji: '💊', accent: 'from-sky-600 to-indigo-800' },
  { name: 'Fashion', emoji: '👗', accent: 'from-fuchsia-600 to-orange-600' },
  { name: 'Hardware', emoji: '🔧', accent: 'from-stone-600 to-stone-900' },
  { name: 'Electronics', emoji: '🔌', accent: 'from-violet-600 to-slate-900' },
]

interface DraftProduct { id: number; name: string; price: string; unit: string }

function BusinessPage() {
  const [name, setName] = useState('')
  const [cat, setCat] = useState<StoreCategory>('Groceries')
  const [areaId, setAreaId] = useState('east-park')
  const [hours, setHours] = useState('08:00 – 18:00')
  const [description, setDescription] = useState('')
  const [products, setProducts] = useState<DraftProduct[]>([{ id: 1, name: '', price: '', unit: '' }])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const meta = categories.find((c) => c.name === cat)!
  const area = areaById(areaId)
  const validProducts = products.filter((p) => p.name.trim() && Number(p.price) > 0)

  const update = (id: number, patch: Partial<DraftProduct>) => setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)))

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (name.trim().length < 2) errs.name = 'Enter your store name'
    if (description.trim().length < 10) errs.description = 'Tell buyers a little about your store (10+ characters)'
    if (validProducts.length === 0) errs.products = 'Add at least one product with a name and price'
    setErrors(errs)
    if (Object.keys(errs).length) return
    toast.success(`${name} is ready for review`, { description: 'Store accounts go live once accounts and storage are switched on in the next milestone.' })
  }

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">For business</p>
      <h1 className="mt-1 font-display text-4xl font-bold sm:text-5xl">Put your store on Tuma</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">Create a store page, list your products and prices, and let Tuma runners deliver to buyers across town. No delivery fleet needed.</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <form onSubmit={submit} noValidate className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Store name" error={errors.name} htmlFor="sname">
              <Input id="sname" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mama Bupe's Kitchen" aria-invalid={!!errors.name} />
            </Field>
            <Field label="Location" htmlFor="sarea">
              <select id="sarea" value={areaId} onChange={(e) => setAreaId(e.target.value)} className="h-9 w-full rounded-md border bg-card px-3 text-sm">
                {areas.map((a) => <option key={a.id} value={a.id}>{a.name}, {a.city}</option>)}
              </select>
            </Field>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium">What do you sell?</legend>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button key={c.name} type="button" aria-pressed={cat === c.name} onClick={() => setCat(c.name)} className={cn('rounded-full border px-3 py-1.5 text-sm', cat === c.name ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:bg-muted')}>
                  {c.emoji} {c.name}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
            <Field label="Description" error={errors.description} htmlFor="sdesc">
              <Textarea id="sdesc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What makes your store special?" aria-invalid={!!errors.description} />
            </Field>
            <Field label="Opening hours" htmlFor="shours">
              <Input id="shours" value={hours} onChange={(e) => setHours(e.target.value)} />
            </Field>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Products & prices</legend>
            {products.map((p, i) => (
              <div key={p.id} className="grid grid-cols-[1fr_110px_110px_auto] gap-2">
                <Input aria-label={`Product ${i + 1} name`} placeholder="Product name" value={p.name} onChange={(e) => update(p.id, { name: e.target.value })} />
                <Input aria-label={`Product ${i + 1} price in kwacha`} placeholder="Price (K)" inputMode="decimal" value={p.price} onChange={(e) => update(p.id, { price: e.target.value.replace(/[^\d.]/g, '') })} />
                <Input aria-label={`Product ${i + 1} unit`} placeholder="Unit" value={p.unit} onChange={(e) => update(p.id, { unit: e.target.value })} />
                <Button type="button" variant="ghost" size="icon" aria-label={`Remove product ${i + 1}`} disabled={products.length === 1} onClick={() => setProducts((ps) => ps.filter((x) => x.id !== p.id))}>
                  <Trash2 />
                </Button>
              </div>
            ))}
            {errors.products && <p className="text-sm text-destructive">{errors.products}</p>}
            <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => setProducts((ps) => [...ps, { id: Date.now(), name: '', price: '', unit: '' }])}>
              <Plus /> Add product
            </Button>
          </fieldset>

          <Button type="submit" size="lg" className="rounded-xl">Create store account</Button>
        </form>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground"><Eye className="size-4" /> Live preview</p>
          <div className="overflow-hidden rounded-3xl border bg-card shadow-lg">
            <div className={cn('grid h-32 place-items-center bg-gradient-to-br text-5xl', meta.accent)}>{meta.emoji}</div>
            <div className="space-y-2 p-5">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-display text-xl font-bold">{name || 'Your store name'}</h2>
                <span className="flex items-center gap-1 text-sm font-semibold"><Star className="size-3.5 fill-primary text-primary" />New</span>
              </div>
              <p className="text-sm text-muted-foreground">{description || 'Your description appears here.'}</p>
              <p className="text-xs text-muted-foreground">{cat} · {area?.name}, {area?.city} · {hours}</p>
              <ul className="mt-3 space-y-2 border-t pt-3 text-sm">
                {validProducts.length === 0 ? (
                  <li className="text-muted-foreground">Products you add show here</li>
                ) : (
                  validProducts.map((p) => (
                    <li key={p.id} className="flex justify-between">
                      <span>{p.name}{p.unit ? <span className="text-muted-foreground"> · {p.unit}</span> : null}</span>
                      <span className="font-semibold">{formatKwacha(Number(p.price))}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Field({ label, error, htmlFor, children }: { label: string; error?: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
