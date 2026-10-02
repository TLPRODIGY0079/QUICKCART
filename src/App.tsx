import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  Camera,
  Check,
  ChevronDown,
  Clock3,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  Search,
  ShoppingBag,
  Sparkles,
  Sun,
  Truck,
  Users,
  X,
} from 'lucide-react'

import { supabase } from './lib/supabase'

type UserType =
  | 'student'
  | 'worker'
  | 'business_owner'
  | 'parent'
  | 'other'

type ShoppingFrequency =
  | 'multiple_times_week'
  | 'once_week'
  | 'two_three_month'
  | 'once_month'
  | 'occasionally'

type DeliveryPreference =
  | 'home'
  | 'workplace'
  | 'campus'
  | 'hostel'
  | 'other'

interface SignupForm {
  firstName: string
  lastName: string
  phone: string
  email: string
  location: string
  userType: UserType | ''
  categories: string[]
  frequency: ShoppingFrequency | ''
  delivery: DeliveryPreference | ''
  comments: string
}

const categories = [
  'Groceries',
  'Market shopping',
  'Clothing',
  'Electronics',
  'Household',
  'Pharmacy',
  'Other',
]

const locations = [
  'Lusaka',
  'Kitwe',
  'Ndola',
  'Kabwe',
  'Livingstone',
  'Other',
]

const userTypes: { value: UserType; label: string }[] = [
  { value: 'student', label: 'Student' },
  { value: 'worker', label: 'Worker' },
  { value: 'business_owner', label: 'Business owner' },
  { value: 'parent', label: 'Parent' },
  { value: 'other', label: 'Other' },
]

const frequencies: {
  value: ShoppingFrequency
  label: string
}[] = [
  {
    value: 'multiple_times_week',
    label: 'Multiple times a week',
  },
  {
    value: 'once_week',
    label: 'Once a week',
  },
  {
    value: 'two_three_month',
    label: '2–3 times a month',
  },
  {
    value: 'once_month',
    label: 'Once a month',
  },
  {
    value: 'occasionally',
    label: 'Occasionally',
  },
]

const deliveryOptions: {
  value: DeliveryPreference
  label: string
}[] = [
  { value: 'home', label: 'Home' },
  { value: 'workplace', label: 'Workplace' },
  { value: 'campus', label: 'Campus' },
  { value: 'hostel', label: 'Hostel' },
  { value: 'other', label: 'Other' },
]

const initialForm: SignupForm = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  location: 'Lusaka',
  userType: '',
  categories: [],
  frequency: '',
  delivery: '',
  comments: '',
}

function generateReferralCode() {
  const randomPart = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()

  return `QC-${randomPart}`
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const [form, setForm] = useState<SignupForm>(initialForm)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const [signupCount, setSignupCount] = useState(0)
  const [launchTarget, setLaunchTarget] = useState(500)
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  const progress = useMemo(() => {
    if (!launchTarget) return 0

    return Math.min(
      Math.round((signupCount / launchTarget) * 100),
      100
    )
  }, [signupCount, launchTarget])

  const remaining = Math.max(
    launchTarget - signupCount,
    0
  )

  useEffect(() => {
    loadLaunchStats()
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  async function loadLaunchStats() {
    setIsLoadingStats(true)

    try {
      const { count, error: countError } = await supabase
        .from('early_access_signups')
        .select('*', {
          count: 'exact',
          head: true,
        })

      if (countError) {
        console.error(
          'Unable to load signup count:',
          countError
        )
      } else {
        setSignupCount(count ?? 0)
      }

      const { data, error: targetError } = await supabase
        .from('launch_targets')
        .select('target_users')
        .eq('location', 'Lusaka')
        .eq('is_active', true)
        .maybeSingle()

      if (targetError) {
        console.error(
          'Unable to load launch target:',
          targetError
        )
      } else if (data?.target_users) {
        setLaunchTarget(data.target_users)
      }
    } catch (error) {
      console.error(
        'Launch statistics error:',
        error
      )
    } finally {
      setIsLoadingStats(false)
    }
  }

  function openSignup() {
    setSubmitError('')
    setSubmitSuccess(false)
    setIsModalOpen(true)
  }

  function closeSignup() {
    if (isSubmitting) return

    setIsModalOpen(false)
    setSubmitError('')
    setSubmitSuccess(false)
  }

  function updateField(
    field: keyof SignupForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function toggleCategory(category: string) {
    setForm((current) => {
      const exists = current.categories.includes(category)

      return {
        ...current,
        categories: exists
          ? current.categories.filter(
              (item) => item !== category
            )
          : [...current.categories, category],
      }
    })
  }

  function validateForm() {
    if (!form.firstName.trim()) {
      return 'Please enter your first name.'
    }

    if (!form.phone.trim()) {
      return 'Please enter your WhatsApp or phone number.'
    }

    if (!form.location) {
      return 'Please select your location.'
    }

    if (!form.userType) {
      return 'Please tell us what best describes you.'
    }

    if (form.categories.length === 0) {
      return 'Please select at least one shopping category.'
    }

    if (!form.frequency) {
      return 'Please select how often you would use QuickCart.'
    }

    if (!form.delivery) {
      return 'Please select your preferred delivery location.'
    }

    return ''
  }

  async function submitSignup(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setSubmitError('')

    const validationError = validateForm()

    if (validationError) {
      setSubmitError(validationError)
      return
    }

    setIsSubmitting(true)

    try {
      const referralCode = generateReferralCode()

      const { error } = await supabase
        .from('early_access_signups')
        .insert({
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim() || null,
          phone: form.phone.trim(),
          whatsapp: form.phone.trim(),
          email: form.email.trim() || null,
          location: form.location,
          user_type: form.userType,
          shopping_categories: form.categories,
          shopping_frequency: form.frequency,
          preferred_delivery: form.delivery,
          comments: form.comments.trim() || null,
          referral_code: referralCode,
          referred_by: null,
          referral_source: 'website',
        })

      if (error) {
        console.error('Supabase signup error:', error)

        if (error.code === '23505') {
          throw new Error(
            'This registration already exists. Try using a different phone number.'
          )
        }

        throw new Error(
          error.message ||
            'We could not complete your registration.'
        )
      }

      setSignupCount((current) => current + 1)
      setSubmitSuccess(true)

      setForm(initialForm)
    } catch (error) {
      console.error(error)

      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function scrollToSection(id: string) {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: 'smooth',
      })

    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-canvas text-ink transition-colors duration-300">
      {/* Navigation */}
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-hairline/60 bg-canvas/75 backdrop-blur-xl backdrop-saturate-150">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-6">
          <button
            onClick={() => window.scrollTo({
              top: 0,
              behavior: 'smooth',
            })}
            className="flex items-center gap-2"
            aria-label="QuickCart home"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-ink text-canvas">
              <ShoppingBag size={16} />
            </div>

            <span className="text-[17px] font-semibold tracking-tight">
              QuickCart
            </span>

            <span className="hidden text-[13px] text-ink-tertiary sm:inline">
              Zambia
            </span>
          </button>

          <div className="hidden items-center gap-7 md:flex">
            <button
              onClick={() => scrollToSection('why-quickcart')}
              className="text-[13px] text-ink-secondary transition hover:text-ink"
            >
              Why QuickCart
            </button>

            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-[13px] text-ink-secondary transition hover:text-ink"
            >
              How it works
            </button>

            <button
              onClick={() => setIsDark(!isDark)}
              className="rounded-full p-2 text-ink-secondary transition hover:bg-surface-muted hover:text-ink"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              onClick={openSignup}
              className="rounded-full bg-accent px-4 py-1.5 text-[13px] font-medium text-white transition hover:bg-accent-hover"
            >
              Join early access
            </button>
          </div>

          <button
            onClick={() =>
              setIsMobileMenuOpen(
                (current) => !current
              )
            }
            className="rounded-full p-2 text-ink md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </nav>

        {isMobileMenuOpen && (
          <div className="border-t border-hairline/60 bg-canvas/95 px-5 pb-5 pt-2 backdrop-blur-xl md:hidden">
            <div className="flex flex-col">
              <button
                onClick={() => scrollToSection('why-quickcart')}
                className="border-b border-hairline/60 py-4 text-left text-[17px] text-ink"
              >
                Why QuickCart
              </button>

              <button
                onClick={() => scrollToSection('how-it-works')}
                className="border-b border-hairline/60 py-4 text-left text-[17px] text-ink"
              >
                How it works
              </button>

              <button
                onClick={() => setIsDark(!isDark)}
                className="flex items-center gap-3 py-4 text-left text-[17px] text-ink"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                {isDark ? 'Light mode' : 'Dark mode'}
              </button>

              <button
                onClick={() => {
                  openSignup()
                  setIsMobileMenuOpen(false)
                }}
                className="mt-2 rounded-full bg-accent px-4 py-3 text-[15px] font-medium text-white"
              >
                Join early access
              </button>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section className="px-5 pb-20 pt-32 sm:px-6 lg:pb-28 lg:pt-40">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent-soft px-3.5 py-1.5 text-[13px] font-medium text-accent">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                  Preparing to launch in Zambia
                </div>

                <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-7xl lg:text-[5.25rem]">
                  You need it.
                  <br />
                  <span className="text-ink-tertiary">
                    We get it.
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-lg leading-8 text-ink-secondary sm:text-xl">
                  Too busy to shop? Too far from the
                  market? Send us a picture, a shopping
                  list, or simply tell us what you need.
                  We'll find it, buy it, and get it to you.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    onClick={openSignup}
                    className="group flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-[17px] font-medium text-white transition hover:bg-accent-hover"
                  >
                    Join early access
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </button>

                  <button
                    onClick={() => scrollToSection('how-it-works')}
                    className="group flex items-center justify-center gap-1 px-4 py-3.5 text-[17px] text-accent transition hover:underline"
                  >
                    See how it works
                    <ChevronDown
                      size={18}
                      className="-rotate-90"
                    />
                  </button>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-[15px] text-ink-secondary">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-accent" />
                    Shop for you
                  </div>

                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-accent" />
                    Real people
                  </div>

                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-accent" />
                    Doorstep delivery
                  </div>
                </div>
              </div>

              {/* Hero visual */}
              <div className="relative mx-auto w-full max-w-md">
                <div className="rounded-[2.25rem] bg-surface p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.18)] ring-1 ring-hairline/60 dark:shadow-none sm:p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-ink-tertiary">
                        QuickCart
                      </p>

                      <p className="mt-0.5 text-[17px] font-semibold">
                        Find it for me
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent">
                      <Sparkles size={18} />
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl bg-surface-muted p-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-surface text-accent shadow-sm ring-1 ring-hairline/60">
                      <Camera size={28} />
                    </div>

                    <h3 className="mt-5 text-xl font-semibold tracking-tight">
                      Show us what you want
                    </h3>

                    <p className="mx-auto mt-2 max-w-xs text-[15px] leading-6 text-ink-secondary">
                      Upload a picture and let a QuickCart
                      shopper find it for you.
                    </p>

                    <button
                      onClick={openSignup}
                      className="mt-6 rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-canvas transition hover:opacity-85"
                    >
                      Try it when we launch
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <MiniFeature
                      icon={<Search size={18} />}
                      label="Find"
                    />

                    <MiniFeature
                      icon={<ShoppingBag size={18} />}
                      label="Buy"
                    />

                    <MiniFeature
                      icon={<Truck size={18} />}
                      label="Deliver"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Launch progress */}
        <section className="px-5 py-10 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-[2rem] bg-surface p-7 ring-1 ring-hairline/60 sm:p-12">
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-accent">
                    <Users size={15} />
                    Lusaka launch
                  </div>

                  <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    Help us bring QuickCart to Lusaka.
                  </h2>

                  <p className="mt-2 max-w-xl text-[15px] leading-6 text-ink-secondary">
                    Every early user brings us one step
                    closer to launch.
                  </p>
                </div>

                <div className="sm:text-right">
                  <div className="text-5xl font-semibold tracking-tight">
                    {isLoadingStats ? '—' : signupCount}
                    <span className="text-ink-tertiary">
                      {' '}
                      / {launchTarget}
                    </span>
                  </div>

                  <p className="mt-1 text-[13px] text-ink-tertiary">
                    early users
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-700"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex justify-between text-[13px] text-ink-secondary">
                  <span>
                    {progress}% complete
                  </span>

                  <span>
                    {remaining > 0
                      ? `${remaining} spots remaining`
                      : 'Launch target reached 🎉'}
                  </span>
                </div>
              </div>

              <button
                onClick={openSignup}
                className="mt-7 flex items-center gap-1 text-[17px] text-accent transition hover:underline"
              >
                Join the movement
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Why */}
        <section
          id="why-quickcart"
          className="scroll-mt-14 px-5 py-28 sm:px-6"
        >
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-[17px] font-semibold text-accent">
                Built around real life
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
                Shopping shouldn't
                <br />
                steal your day.
              </h2>

              <p className="mt-5 text-xl leading-8 text-ink-secondary">
                QuickCart connects you with people who can
                physically go and get what you need.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              <ProblemCard
                icon={<Clock3 size={22} />}
                title="Too busy?"
                text="Keep working, studying, or spending time with your family while someone handles the shopping."
              />

              <ProblemCard
                icon={<MapPin size={22} />}
                title="Too far?"
                text="Whether you're on campus, at work, or far from the market, your shopper can go for you."
              />

              <ProblemCard
                icon={<Search size={22} />}
                title="Can't find it online?"
                text="Show us a picture or describe what you need. Your shopper can search physical stores and markets."
              />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="scroll-mt-14 bg-canvas-alt px-5 py-28 sm:px-6"
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-[17px] font-semibold text-accent">
                Simple by design
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
                You ask.
                <br />
                We handle the rest.
              </h2>
            </div>

            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Step
                number="01"
                icon={<Camera size={20} />}
                title="Show us"
                text="Send a picture, shopping list, or tell us what you need."
              />

              <Step
                number="02"
                icon={<Users size={20} />}
                title="We match"
                text="A QuickCart shopper accepts your request."
              />

              <Step
                number="03"
                icon={<ShoppingBag size={20} />}
                title="We shop"
                text="Your shopper finds and purchases the items."
              />

              <Step
                number="04"
                icon={<Truck size={20} />}
                title="We deliver"
                text="Your shopping arrives at your chosen location."
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="px-5 py-28 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-[17px] font-semibold text-accent">
                  Whatever you need
                </p>

                <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                  One place.
                  <br />
                  Endless possibilities.
                </h2>
              </div>

              <p className="max-w-md text-[17px] leading-7 text-ink-secondary">
                QuickCart isn't limited to supermarket products.
                If someone can find it, buy it and legally deliver
                it, we can explore it.
              </p>
            </div>

            <div className="mt-12 flex flex-wrap gap-3">
              {categories.map((category) => (
                <div
                  key={category}
                  className="rounded-full bg-surface px-5 py-2.5 text-[15px] text-ink ring-1 ring-hairline/60 transition hover:ring-accent"
                >
                  {category}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Human feature */}
        <section className="px-5 pb-28 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-[2.5rem] bg-surface p-8 ring-1 ring-hairline/60 sm:p-12 lg:p-16">
              <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                    <MessageCircle size={22} />
                  </div>

                  <h2 className="mt-7 text-4xl font-semibold tracking-tight sm:text-5xl">
                    Shopping with a
                    <br />
                    human touch.
                  </h2>

                  <p className="mt-5 max-w-xl text-[17px] leading-7 text-ink-secondary">
                    Can't find the exact product? Your shopper
                    can send you a picture of an alternative and
                    ask before buying.
                  </p>

                  <div className="mt-8 flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {['A', 'M', 'K'].map((initial) => (
                        <div
                          key={initial}
                          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-surface bg-surface-muted text-xs font-medium text-ink"
                        >
                          {initial}
                        </div>
                      ))}
                    </div>

                    <span className="text-[15px] text-ink-secondary">
                      Real people. Real shopping.
                    </span>
                  </div>
                </div>

                {/* Chat preview */}
                <div className="rounded-3xl bg-surface-muted p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white">
                      <Users size={18} />
                    </div>

                    <div>
                      <p className="text-[15px] font-semibold">
                        Your QuickCart shopper
                      </p>

                      <p className="text-[13px] text-ink-tertiary">
                        Shopping now
                      </p>
                    </div>

                    <div className="ml-auto h-2 w-2 rounded-full bg-success" />
                  </div>

                  <div className="mt-6 max-w-[85%] rounded-[1.25rem] rounded-bl-md bg-surface px-4 py-3 shadow-sm">
                    <p className="text-[15px] leading-6">
                      "They don't have the exact item.
                      I found another option. Should I get
                      this one?"
                    </p>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button className="flex-1 rounded-full bg-accent py-3 text-[15px] font-medium text-white transition hover:bg-accent-hover">
                      Approve
                    </button>

                    <button className="flex-1 rounded-full bg-surface py-3 text-[15px] font-medium text-ink ring-1 ring-hairline/60">
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-canvas-alt px-5 py-28 sm:px-6">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-canvas">
              <ShoppingBag size={24} />
            </div>

            <h2 className="mt-7 text-4xl font-semibold tracking-tight sm:text-6xl">
              Be there from day one.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-xl leading-8 text-ink-secondary">
              Join the early access list and be among the first
              people to experience QuickCart when we launch.
            </p>

            <button
              onClick={openSignup}
              className="mt-9 rounded-full bg-accent px-8 py-3.5 text-[17px] font-medium text-white transition hover:bg-accent-hover"
            >
              Join QuickCart
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-hairline/60 px-5 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 text-[13px] text-ink-tertiary sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-ink-secondary">
            <ShoppingBag size={15} />
            <span>QuickCart Zambia</span>
          </div>

          <p>
            You need it. We get it.
          </p>

          <p>
            © {new Date().getFullYear()} QuickCart. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Signup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4 backdrop-blur-md dark:bg-black/70">
          <div className="flex min-h-full items-center justify-center py-8">
            <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] bg-surface shadow-2xl ring-1 ring-hairline/60">
              <button
                onClick={closeSignup}
                className="absolute right-5 top-5 z-10 rounded-full bg-surface-muted p-2 text-ink-secondary transition hover:text-ink"
                aria-label="Close"
              >
                <X size={16} />
              </button>

              {submitSuccess ? (
                <SuccessState
                  signupCount={signupCount}
                  onClose={closeSignup}
                  onJoinAnother={() => {
                    setSubmitSuccess(false)
                    setSubmitError('')
                  }}
                />
              ) : (
                <form
                  onSubmit={submitSignup}
                  className="p-6 sm:p-10"
                >
                  <div className="pr-10">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                      <Sparkles size={19} />
                    </div>

                    <h2 className="text-3xl font-semibold tracking-tight">
                      Join early access
                    </h2>

                    <p className="mt-2 max-w-lg text-[15px] leading-6 text-ink-secondary">
                      Tell us a little about yourself so we
                      can understand where QuickCart is needed
                      most.
                    </p>
                  </div>

                  {submitError && (
                    <div className="mt-6 rounded-2xl bg-danger/10 px-4 py-3 text-[14px] text-danger">
                      {submitError}
                    </div>
                  )}

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <Input
                      label="First name"
                      value={form.firstName}
                      onChange={(value) =>
                        updateField(
                          'firstName',
                          value
                        )
                      }
                      placeholder="Your first name"
                      required
                    />

                    <Input
                      label="Last name"
                      value={form.lastName}
                      onChange={(value) =>
                        updateField(
                          'lastName',
                          value
                        )
                      }
                      placeholder="Your last name"
                    />

                    <Input
                      label="WhatsApp / phone"
                      value={form.phone}
                      onChange={(value) =>
                        updateField(
                          'phone',
                          value
                        )
                      }
                      placeholder="+260..."
                      required
                    />

                    <Input
                      label="Email"
                      type="email"
                      value={form.email}
                      onChange={(value) =>
                        updateField(
                          'email',
                          value
                        )
                      }
                      placeholder="you@example.com"
                    />

                    <Select
                      label="Where are you?"
                      value={form.location}
                      onChange={(value) =>
                        updateField(
                          'location',
                          value
                        )
                      }
                      options={locations.map(
                        (location) => ({
                          value: location,
                          label: location,
                        })
                      )}
                    />

                    <Select
                      label="I am a..."
                      value={form.userType}
                      onChange={(value) =>
                        updateField(
                          'userType',
                          value
                        )
                      }
                      placeholder="Select one"
                      options={userTypes}
                    />
                  </div>

                  <div className="mt-7">
                    <span className="text-[14px] font-medium text-ink">
                      What would you use QuickCart for?
                    </span>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {categories.map((category) => {
                        const selected =
                          form.categories.includes(
                            category
                          )

                        return (
                          <button
                            key={category}
                            type="button"
                            onClick={() =>
                              toggleCategory(
                                category
                              )
                            }
                            aria-pressed={selected}
                            className={`rounded-full px-4 py-2 text-[14px] transition ${
                              selected
                                ? 'bg-accent text-white'
                                : 'bg-surface-muted text-ink hover:ring-1 hover:ring-hairline'
                            }`}
                          >
                            {category}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    <Select
                      label="How often would you use it?"
                      value={form.frequency}
                      onChange={(value) =>
                        updateField(
                          'frequency',
                          value
                        )
                      }
                      placeholder="Select frequency"
                      options={frequencies}
                    />

                    <Select
                      label="Preferred delivery"
                      value={form.delivery}
                      onChange={(value) =>
                        updateField(
                          'delivery',
                          value
                        )
                      }
                      placeholder="Select location"
                      options={deliveryOptions}
                    />
                  </div>

                  <label className="mt-7 block">
                    <span className="text-[14px] font-medium text-ink">
                      Anything else?
                      <span className="ml-2 font-normal text-ink-tertiary">
                        Optional
                      </span>
                    </span>

                    <textarea
                      value={form.comments}
                      onChange={(event) =>
                        updateField(
                          'comments',
                          event.target.value
                        )
                      }
                      rows={3}
                      placeholder="Tell us what you would love QuickCart to help you with..."
                      className={`mt-2 resize-none ${fieldClassName}`}
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3.5 text-[17px] font-medium text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Joining QuickCart...
                      </>
                    ) : (
                      <>
                        Join early access
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  <p className="mt-4 text-center text-[12px] leading-5 text-ink-tertiary">
                    By joining, you're expressing interest in
                    QuickCart. We won't sell your contact
                    information.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const fieldClassName =
  'w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-ink-tertiary focus:border-accent focus:ring-4 focus:ring-accent-soft'

function MiniFeature({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-surface-muted py-4">
      <div className="text-accent">
        {icon}
      </div>

      <span className="text-[13px] font-medium text-ink-secondary">
        {label}
      </span>
    </div>
  )
}

function ProblemCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="rounded-[1.75rem] bg-surface p-8 ring-1 ring-hairline/60 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.2)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
        {icon}
      </div>

      <h3 className="mt-7 text-2xl font-semibold tracking-tight">
        {title}
      </h3>

      <p className="mt-3 text-[15px] leading-6 text-ink-secondary">
        {text}
      </p>
    </div>
  )
}

function Step({
  number,
  icon,
  title,
  text,
}: {
  number: string
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="rounded-[1.75rem] bg-surface-muted p-7">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold tabular-nums text-ink-tertiary">
          {number}
        </span>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-accent shadow-sm">
          {icon}
        </div>
      </div>

      <h3 className="mt-10 text-xl font-semibold tracking-tight">
        {title}
      </h3>

      <p className="mt-2 text-[15px] leading-6 text-ink-secondary">
        {text}
      </p>
    </div>
  )
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="text-[14px] font-medium text-ink">
        {label}

        {required && (
          <span className="ml-1 text-accent">
            *
          </span>
        )}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        required={required}
        className={`mt-2 ${fieldClassName}`}
      />
    </label>
  )
}

function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: {
    value: string
    label: string
  }[]
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="text-[14px] font-medium text-ink">
        {label}
      </span>

      <div className="relative">
        <select
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className={`mt-2 appearance-none pr-10 ${fieldClassName}`}
        >
          {placeholder && (
            <option value="">
              {placeholder}
            </option>
          )}

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={17}
          className="pointer-events-none absolute right-4 top-[1.4rem] text-ink-tertiary"
        />
      </div>
    </label>
  )
}

function SuccessState({
  signupCount,
  onClose,
  onJoinAnother,
}: {
  signupCount: number
  onClose: () => void
  onJoinAnother: () => void
}) {
  return (
    <div className="px-6 py-14 text-center sm:px-12 sm:py-20">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/15">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success text-white">
          <Check size={28} strokeWidth={3} />
        </div>
      </div>

      <p className="mt-7 text-[17px] font-semibold text-success">
        You're in
      </p>

      <h2 className="mt-2 text-4xl font-semibold tracking-tight">
        Welcome to QuickCart. 🎉
      </h2>

      <p className="mx-auto mt-4 max-w-md text-[15px] leading-6 text-ink-secondary">
        You're officially on the early access list. We'll
        let you know when QuickCart is ready for you.
      </p>

      <div className="mx-auto mt-8 max-w-sm rounded-2xl bg-surface-muted p-5">
        <p className="text-[13px] font-medium text-ink-tertiary">
          Lusaka early users
        </p>

        <p className="mt-1 text-4xl font-semibold tracking-tight">
          {signupCount}
        </p>

        <p className="mt-1 text-[13px] text-ink-secondary">
          and growing
        </p>
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <button
          onClick={onClose}
          className="rounded-full bg-accent px-7 py-3 text-[15px] font-medium text-white transition hover:bg-accent-hover"
        >
          Done
        </button>

        <button
          onClick={onJoinAnother}
          className="rounded-full px-6 py-3 text-[15px] text-accent transition hover:underline"
        >
          Join with another profile
        </button>
      </div>
    </div>
  )
}

export default App
