import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  ImagePlus,
  MapPin,
  Menu,
  MessageCircle,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
} from 'lucide-react'

type Signup = {
  firstName: string
  phone: string
  location: string
  userType: string
  frequency: string
}

const launchTarget = 500
const localStorageKey = 'quickcart_early_access_signups'

const categories = [
  { icon: '🥬', title: 'Groceries', text: 'From everyday essentials to full market runs.' },
  { icon: '👕', title: 'Clothing', text: 'Show us the item, size and style you want.' },
  { icon: '📱', title: 'Electronics', text: 'Need a specific gadget or accessory? Tell us.' },
  { icon: '🏠', title: 'Household', text: 'Cleaning supplies, home goods and more.' },
]

const steps = [
  { number: '01', icon: ImagePlus, title: 'Show us what you want', text: 'Send a picture, write a list, or simply describe it.' },
  { number: '02', icon: Search, title: 'We find it', text: 'A QuickCart shopper receives your request and goes looking.' },
  { number: '03', icon: MessageCircle, title: 'You stay in control', text: 'We can message you when there is a substitution or question.' },
  { number: '04', icon: Truck, title: 'We bring it to you', text: 'Home, campus, hostel or workplace — wherever you need it.' },
]

function App() {
  const [signupOpen, setSignupOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [signupCount, setSignupCount] = useState(327)
  const [form, setForm] = useState<Signup>({
    firstName: '',
    phone: '',
    location: 'Lusaka',
    userType: 'Student',
    frequency: '2–3 times a month',
  })

  useEffect(() => {
    try {
      const saved = localStorage.getItem(localStorageKey)
      if (saved) {
        const entries = JSON.parse(saved) as Signup[]
        setSignupCount(327 + entries.length)
      }
    } catch {
      // Ignore malformed local data in the prototype.
    }
  }, [])

  const progress = Math.min((signupCount / launchTarget) * 100, 100)
  const spotsLeft = Math.max(launchTarget - signupCount, 0)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    try {
      const saved = localStorage.getItem(localStorageKey)
      const entries = saved ? (JSON.parse(saved) as Signup[]) : []
      const next = [...entries, form]
      localStorage.setItem(localStorageKey, JSON.stringify(next))
      setSignupCount(327 + next.length)
    } catch {
      // The page remains usable even if browser storage is unavailable.
    }

    setSubmitted(true)
  }

  const resetModal = () => {
    setSignupOpen(false)
    setSubmitted(false)
  }

  const statLabel = useMemo(() => {
    if (signupCount >= launchTarget) return 'Lusaka launch target reached'
    return `${spotsLeft} people needed to unlock the Lusaka launch`
  }, [signupCount, spotsLeft])

  return (
    <div className="min-h-screen bg-[#08090b] text-white selection:bg-white selection:text-black">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-12rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-[120px]" />
        <div className="absolute right-[-10rem] top-[28rem] h-[28rem] w-[28rem] rounded-full bg-amber-400/10 blur-[120px]" />
        <div className="absolute left-[-12rem] top-[58rem] h-[30rem] w-[30rem] rounded-full bg-cyan-400/8 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#08090b]/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <button onClick={() => scrollTo('top')} className="group flex items-center gap-3" aria-label="QuickCart home">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/8 shadow-2xl shadow-black/20">
              <ShoppingBag size={18} strokeWidth={2.2} />
            </div>
            <div>
              <div className="text-[15px] font-semibold tracking-[-0.02em]">QuickCart</div>
              <div className="text-[10px] font-medium uppercase tracking-[0.26em] text-white/40">Zambia</div>
            </div>
          </button>

          <nav className="hidden items-center gap-8 text-sm text-white/55 md:flex">
            <button onClick={() => scrollTo('how-it-works')} className="transition hover:text-white">How it works</button>
            <button onClick={() => scrollTo('categories')} className="transition hover:text-white">What we shop</button>
            <button onClick={() => scrollTo('launch')} className="transition hover:text-white">Launch</button>
          </nav>

          <div className="hidden md:block">
            <button onClick={() => setSignupOpen(true)} className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02]">
              Join early access
            </button>
          </div>

          <button onClick={() => setMenuOpen((value) => !value)} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 md:hidden">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/8 bg-black/70 px-5 py-4 backdrop-blur-2xl md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-white/70">
              <button onClick={() => scrollTo('how-it-works')} className="text-left">How it works</button>
              <button onClick={() => scrollTo('categories')} className="text-left">What we shop</button>
              <button onClick={() => scrollTo('launch')} className="text-left">Launch</button>
              <button onClick={() => { setSignupOpen(true); setMenuOpen(false) }} className="rounded-full bg-white px-5 py-3 font-semibold text-black">Join early access</button>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        <section className="mx-auto max-w-7xl px-5 pb-24 pt-20 sm:pt-28 lg:px-8 lg:pb-32 lg:pt-32">
          <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_.92fr]">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-white/65 shadow-xl shadow-black/20 backdrop-blur-xl">
                <Sparkles size={14} /> Built for Zambia 🇿🇲
              </div>
              <h1 className="max-w-4xl text-[clamp(3.5rem,9vw,7.4rem)] font-semibold leading-[0.88] tracking-[-0.07em]">
                You need it.
                <span className="mt-2 block text-white/35">We get it.</span>
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-white/55 sm:text-xl">
                Too busy to shop? Too far from the market? Send a picture, a list, or simply tell us what you need. A QuickCart shopper finds it, buys it, and gets it to you.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => setSignupOpen(true)} className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-black transition hover:scale-[1.01]">
                  Join early access
                  <ArrowRight size={17} className="transition group-hover:translate-x-0.5" />
                </button>
                <button onClick={() => scrollTo('how-it-works')} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/8">
                  See how it works
                </button>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/35">
                <span className="inline-flex items-center gap-2"><MapPin size={13} /> Lusaka first</span>
                <span className="inline-flex items-center gap-2"><Clock3 size={13} /> Shop when you are busy</span>
                <span className="inline-flex items-center gap-2"><MessageCircle size={13} /> Stay in control</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-emerald-400/15 via-transparent to-amber-300/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2.25rem] border border-white/12 bg-white/6 p-4 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-5">
                <div className="rounded-[1.75rem] border border-white/10 bg-[#101216]/90 p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.24em] text-white/35">QuickCart</div>
                      <div className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Show us what you want.</div>
                    </div>
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-black"><ImagePlus size={20} /></div>
                  </div>
                  <div className="mt-6 rounded-3xl border border-dashed border-white/15 bg-white/4 px-5 py-12 text-center">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/6">
                      <ImagePlus size={23} className="text-white/80" />
                    </div>
                    <div className="mt-5 font-medium">Upload a picture</div>
                    <div className="mt-2 text-sm text-white/35">Or describe what you need.</div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                      <div className="text-[11px] uppercase tracking-[0.2em] text-white/30">Delivery</div>
                      <div className="mt-2 flex items-center gap-2 text-sm"><MapPin size={15} /> UNZA campus</div>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                      <div className="text-[11px] uppercase tracking-[0.2em] text-white/30">Status</div>
                      <div className="mt-2 inline-flex items-center gap-2 text-sm"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Shopper matched</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/8 bg-white/[0.025]">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:grid-cols-3 lg:px-8">
            {[
              ['01', 'Send a picture', 'No product name required.'],
              ['02', 'We go find it', 'A real shopper handles the run.'],
              ['03', 'You get it', 'Home, work, hostel or campus.'],
            ].map(([number, title, text]) => (
              <div key={number} className="flex gap-4">
                <div className="text-xs font-medium text-white/25">{number}</div>
                <div>
                  <div className="font-semibold tracking-[-0.02em]">{title}</div>
                  <div className="mt-1 text-sm text-white/40">{text}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-28 lg:px-8 lg:py-36">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300/70">How it works</div>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] sm:text-6xl">Shopping without leaving what matters.</h2>
            <p className="mt-6 text-lg leading-8 text-white/45">QuickCart is designed around one simple idea: you should not have to rearrange your day just to go and find something.</p>
          </div>
          <div className="mt-16 grid gap-4 md:grid-cols-2">
            {steps.map(({ number, icon: Icon, title, text }) => (
              <article key={number} className="group rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.055] sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/6"><Icon size={21} /></div>
                  <div className="text-xs text-white/25">{number}</div>
                </div>
                <h3 className="mt-16 text-2xl font-semibold tracking-[-0.04em]">{title}</h3>
                <p className="mt-3 max-w-lg text-sm leading-7 text-white/40">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="categories" className="scroll-mt-24 bg-white/[0.025] py-28 lg:py-36">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <div className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-200/65">What we shop</div>
                <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] sm:text-6xl">Show us. Tell us. We’ll find it.</h2>
              </div>
              <p className="max-w-sm text-sm leading-7 text-white/35">And this is only the beginning. QuickCart is being designed for anything you reasonably need someone to go and get.</p>
            </div>
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <article key={category.title} className="rounded-[2rem] border border-white/9 bg-white/4 p-7 backdrop-blur-xl">
                  <div className="text-4xl">{category.icon}</div>
                  <h3 className="mt-8 text-xl font-semibold tracking-[-0.035em]">{category.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/38">{category.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="launch" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-28 lg:px-8 lg:py-36">
          <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-7 shadow-2xl shadow-black/30 sm:p-10 lg:p-14">
            <div className="grid gap-12 lg:grid-cols-[1fr_0.7fr] lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-white/50">
                  <Sparkles size={14} /> Early access
                </div>
                <h2 className="mt-7 max-w-3xl text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">Help us bring QuickCart to Lusaka.</h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-white/40">Every signup tells us there is real demand. Join now and be among the first people invited when QuickCart goes live.</p>
              </div>
              <div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-5xl font-semibold tracking-[-0.06em]">{signupCount}</div>
                    <div className="mt-1 text-sm text-white/35">early users</div>
                  </div>
                  <div className="text-right text-sm text-white/45">of {launchTarget}</div>
                </div>
                <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/8">
                  <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>
                <div className="mt-4 text-xs text-white/30">{statLabel}</div>
                <button onClick={() => setSignupOpen(true)} className="mt-7 w-full rounded-full bg-white px-6 py-4 text-sm font-semibold text-black transition hover:scale-[1.01]">Join the movement</button>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-12">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="rounded-[2rem] border border-white/8 bg-gradient-to-br from-white/[0.06] to-white/[0.015] p-8 sm:p-12">
              <div className="max-w-3xl">
                <div className="text-xs uppercase tracking-[0.25em] text-white/25">The QuickCart promise</div>
                <p className="mt-6 text-3xl font-medium leading-tight tracking-[-0.045em] text-white/85 sm:text-5xl">“Can’t find it online? We’ll go find it for you.”</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-white/35 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>© {new Date().getFullYear()} QuickCart Zambia</div>
          <div className="flex items-center gap-2">Built for everyday life in Zambia 🇿🇲</div>
        </div>
      </footer>

      {signupOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="signup-title">
          <div className="relative max-h-[92vh] w-full max-w-xl overflow-auto rounded-[2rem] border border-white/10 bg-[#0d0f12] p-6 shadow-2xl shadow-black/60 sm:p-8">
            <button onClick={resetModal} className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-xl border border-white/8 bg-white/5 text-white/60 hover:text-white" aria-label="Close signup form"><X size={18} /></button>

            {!submitted ? (
              <>
                <div className="pr-12">
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300/70">Early access</div>
                  <h2 id="signup-title" className="mt-3 text-3xl font-semibold tracking-[-0.05em]">Be one of the first.</h2>
                  <p className="mt-3 text-sm leading-6 text-white/40">Tell us a little about yourself. This prototype stores your signup in this browser only — we connect the real Supabase database in the next milestone.</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-xs font-medium text-white/50">First name</span>
                      <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="field" placeholder="Brian" />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-xs font-medium text-white/50">WhatsApp / phone</span>
                      <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="field" placeholder="0977 123 456" />
                    </label>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-xs font-medium text-white/50">Location</span>
                      <div className="relative">
                        <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="field appearance-none">
                          <option>Lusaka</option>
                          <option>Kitwe</option>
                          <option>Ndola</option>
                          <option>Kabwe</option>
                          <option>Other</option>
                        </select>
                        <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/30" />
                      </div>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-xs font-medium text-white/50">I am a</span>
                      <div className="relative">
                        <select value={form.userType} onChange={(e) => setForm({ ...form, userType: e.target.value })} className="field appearance-none">
                          <option>Student</option>
                          <option>Worker</option>
                          <option>Business owner</option>
                          <option>Parent</option>
                          <option>Other</option>
                        </select>
                        <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/30" />
                      </div>
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-xs font-medium text-white/50">How often would you use QuickCart?</span>
                    <div className="relative">
                      <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} className="field appearance-none">
                        <option>Once a week</option>
                        <option>2–3 times a month</option>
                        <option>Once a month</option>
                        <option>Occasionally</option>
                      </select>
                      <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/30" />
                    </div>
                  </label>

                  <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-black transition hover:scale-[1.01]">
                    Join QuickCart <ArrowRight size={16} />
                  </button>
                </form>
              </>
            ) : (
              <div className="py-10 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-white text-black"><Check size={28} /></div>
                <h2 className="mt-7 text-3xl font-semibold tracking-[-0.05em]">You’re on the list. 🎉</h2>
                <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/40">Thanks, {form.firstName}. You’ve joined the QuickCart early-access list for {form.location}.</p>
                <div className="mt-7 rounded-2xl border border-white/8 bg-white/4 p-4 text-sm text-white/55">Current early users: <span className="font-semibold text-white">{signupCount}</span> / {launchTarget}</div>
                <button onClick={resetModal} className="mt-5 rounded-full border border-white/10 bg-white/6 px-5 py-3 text-sm font-semibold">Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
