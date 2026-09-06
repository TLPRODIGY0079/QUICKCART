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
  Package,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
  Truck,
  Upload,
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

  function scrollToHowItWorks() {
    document
      .getElementById('how-it-works')
      ?.scrollIntoView({
        behavior: 'smooth',
      })

    setIsMobileMenuOpen(false)
  }

  return (
    <div className={`min-h-screen overflow-x-hidden ${isDark ? 'bg-[#050505] text-white' : 'bg-[#cac5c5] text-gray-900'}`}>
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-15%] top-[-15%] h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />

        <div className="absolute right-[-10%] top-[15%] h-[450px] w-[450px] rounded-full bg-yellow-500/10 blur-[130px]" />

        <div className="absolute bottom-[-10%] left-[25%] h-[400px] w-[400px] rounded-full bg-orange-500/10 blur-[120px]" />
      </div>

      {/* Navigation */}
      <header className="fixed left-0 right-0 top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between rounded-2xl border border-white/10 dark:border-white/10 bg-black/50 dark:bg-black/50 px-4 py-3 backdrop-blur-xl sm:px-6">
            <button
              onClick={() => window.scrollTo({
                top: 0,
                behavior: 'smooth',
              })}
              className="flex items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
                <ShoppingBag size={19} />
              </div>

              <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                QuickCart
              </span>

              <span className="hidden rounded-full border border-white/10 dark:border-white/10 bg-white/5 dark:bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/50 dark:text-white/50 sm:inline">
                Zambia
              </span>
            </button>

            <div className="hidden items-center gap-8 md:flex">
              <button
                onClick={scrollToHowItWorks}
                className="text-sm text-gray-600 dark:text-white/60 transition hover:text-gray-900 dark:hover:text-white"
              >
                How it works
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById('why-quickcart')
                    ?.scrollIntoView({
                      behavior: 'smooth',
                    })
                }
                className="text-sm text-gray-600 dark:text-white/60 transition hover:text-gray-900 dark:hover:text-white"
              >
                Why QuickCart
              </button>

              <button
                onClick={() => setIsDark(!isDark)}
                className="rounded-xl border border-gray-300 dark:border-white/10 p-2 text-gray-600 dark:text-white/60 transition hover:text-gray-900 dark:hover:text-white"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                onClick={openSignup}
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02]"
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
              className="rounded-xl border border-gray-300 dark:border-white/10 p-2 md:hidden"
            >
              {isMobileMenuOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>
          </nav>

          {isMobileMenuOpen && (
            <div className="mt-2 rounded-2xl border border-gray-300 dark:border-white/10 bg-white/90 dark:bg-black/80 p-4 backdrop-blur-xl md:hidden">
              <div className="flex flex-col gap-2">
                <button
                  onClick={scrollToHowItWorks}
                  className="rounded-xl px-4 py-3 text-left text-sm text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  How it works
                </button>

                <button
                  onClick={() => {
                    document
                      .getElementById('why-quickcart')
                      ?.scrollIntoView({
                        behavior: 'smooth',
                      })

                    setIsMobileMenuOpen(false)
                  }}
                  className="rounded-xl px-4 py-3 text-left text-sm text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  Why QuickCart
                </button>

                <button
                  onClick={() => setIsDark(!isDark)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                  {isDark ? 'Light mode' : 'Dark mode'}
                </button>

                <button
                  onClick={() => {
                    openSignup()
                    setIsMobileMenuOpen(false)
                  }}
                  className="mt-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black"
                >
                  Join early access
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="relative px-4 pb-24 pt-36 sm:px-6 lg:px-8 lg:pb-32 lg:pt-44">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
              <div>
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 px-4 py-2 text-xs text-gray-600 dark:text-white/65 backdrop-blur">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  Preparing to launch in Zambia
                </div>

                <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl lg:text-8xl text-gray-900 dark:text-white">
                  You need it.
                  <br />

                  <span className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-900/40 dark:from-white dark:via-white dark:to-white/40 bg-clip-text text-transparent">
                    We get it.
                  </span>
                </h1>

                <p className="mt-7 max-w-xl text-lg leading-8 text-gray-600 dark:text-white/55 sm:text-xl">
                  Too busy to shop? Too far from the
                  market? Send us a picture, a shopping
                  list, or simply tell us what you need.
                  We'll find it, buy it, and get it to you.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={openSignup}
                    className="group flex items-center justify-center gap-3 rounded-full bg-white px-7 py-4 font-semibold text-black transition hover:scale-[1.02]"
                  >
                    Join early access

                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>

                  <button
                    onClick={scrollToHowItWorks}
                    className="rounded-full border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 px-7 py-4 font-medium text-gray-700 dark:text-white/80 backdrop-blur transition hover:bg-gray-200 dark:hover:bg-white/10"
                  >
                    See how it works
                  </button>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-gray-500 dark:text-white/40">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-400" />
                    Shop for you
                  </div>

                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-400" />
                    Real people
                  </div>

                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-400" />
                    Doorstep delivery
                  </div>
                </div>
              </div>

              {/* Hero visual */}
              <div className="relative mx-auto w-full max-w-xl">
                <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-emerald-400/10 via-transparent to-orange-400/10 blur-3xl" />

                <div className="relative overflow-hidden rounded-[2rem] border border-gray-300 dark:border-white/10 bg-white/80 dark:bg-white/[0.055] p-3 shadow-2xl backdrop-blur-2xl">
                  <div className="rounded-[1.5rem] border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-[#0b0b0b] p-5 sm:p-7">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-white/35">
                          QuickCart
                        </p>

                        <p className="mt-1 font-medium text-gray-900 dark:text-white">
                          Find it for me
                        </p>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-200 dark:bg-white/5">
                        <Sparkles
                          size={18}
                          className="text-gray-600 dark:text-white/70"
                        />
                      </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-dashed border-gray-300 dark:border-white/15 bg-gray-50 dark:bg-white/[0.025] p-8 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-200 dark:bg-white/10">
                        <Camera size={28} />
                      </div>

                      <h3 className="mt-5 text-xl font-medium text-gray-900 dark:text-white">
                        Show us what you want
                      </h3>

                      <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-gray-500 dark:text-white/40">
                        Upload a picture and let a QuickCart
                        shopper find it for you.
                      </p>

                      <button
                        onClick={openSignup}
                        className="mt-6 rounded-full bg-gray-200 dark:bg-white/10 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-white transition hover:bg-gray-300 dark:hover:bg-white/15"
                      >
                        Try it when we launch
                      </button>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <MiniFeature
                        icon={<Search size={17} />}
                        label="Find"
                      />

                      <MiniFeature
                        icon={<ShoppingBag size={17} />}
                        label="Buy"
                      />

                      <MiniFeature
                        icon={<Truck size={17} />}
                        label="Deliver"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Launch progress */}
        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-[2rem] border border-gray-300 dark:border-white/10 bg-white/80 dark:bg-white/[0.045] p-6 backdrop-blur-xl sm:p-10">
              <div className="absolute right-[-10%] top-[-100%] h-[300px] w-[300px] rounded-full bg-emerald-400/10 blur-[100px]" />

              <div className="relative">
                <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300/70">
                      <Users size={14} />
                      Lusaka launch
                    </div>

                    <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl text-gray-900 dark:text-white">
                      Help us bring QuickCart to Lusaka.
                    </h2>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600 dark:text-white/45">
                      Every early user brings us one step
                      closer to launch.
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <div className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
                      {isLoadingStats ? '—' : signupCount}
                      <span className="text-gray-400 dark:text-white/25">
                        {' '}
                        / {launchTarget}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-gray-500 dark:text-white/35">
                      early users
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-green-400 to-yellow-300 transition-all duration-700"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>

                  <div className="mt-3 flex justify-between text-xs text-gray-500 dark:text-white/35">
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
                  className="mt-7 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-white transition hover:text-emerald-600 dark:hover:text-emerald-300"
                >
                  Join the movement
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Why */}
        <section
          id="why-quickcart"
          className="px-4 py-28 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-gray-500 dark:text-white/35">
                Built around real life
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl text-gray-900 dark:text-white">
                Shopping shouldn't
                <br />
                steal your day.
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-600 dark:text-white/45">
                QuickCart connects you with people who can
                physically go and get what you need.
              </p>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-3">
              <ProblemCard
                icon={<Clock3 />}
                title="Too busy?"
                text="Keep working, studying, or spending time with your family while someone handles the shopping."
              />

              <ProblemCard
                icon={<MapPin />}
                title="Too far?"
                text="Whether you're on campus, at work, or far from the market, your shopper can go for you."
              />

              <ProblemCard
                icon={<Search />}
                title="Can't find it online?"
                text="Show us a picture or describe what you need. Your shopper can search physical stores and markets."
              />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="border-y border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.018] px-4 py-28 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-gray-500 dark:text-white/35">
                Simple by design
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl text-gray-900 dark:text-white">
                You ask.
                <br />
                We handle the rest.
              </h2>
            </div>

            <div className="mt-16 grid gap-5 md:grid-cols-4">
              <Step
                number="01"
                icon={<Camera />}
                title="Show us"
                text="Send a picture, shopping list, or tell us what you need."
              />

              <Step
                number="02"
                icon={<Users />}
                title="We match"
                text="A QuickCart shopper accepts your request."
              />

              <Step
                number="03"
                icon={<ShoppingBag />}
                title="We shop"
                text="Your shopper finds and purchases the items."
              />

              <Step
                number="04"
                icon={<Truck />}
                title="We deliver"
                text="Your shopping arrives at your chosen location."
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="px-4 py-28 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-gray-500 dark:text-white/35">
                  Whatever you need
                </p>

                <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl text-gray-900 dark:text-white">
                  One place.
                  <br />
                  Endless possibilities.
                </h2>
              </div>

              <p className="max-w-md text-sm leading-6 text-gray-600 dark:text-white/40">
                QuickCart isn't limited to supermarket products.
                If someone can find it, buy it and legally deliver
                it, we can explore it.
              </p>
            </div>

            <div className="mt-12 flex flex-wrap gap-3">
              {categories.map((category) => (
                <div
                  key={category}
                  className="rounded-full border border-gray-300 dark:border-white/10 bg-white/80 dark:bg-white/[0.045] px-5 py-3 text-sm text-gray-700 dark:text-white/65 backdrop-blur transition hover:bg-gray-100 dark:hover:bg-white/10"
                >
                  {category}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Human feature */}
        <section className="px-4 pb-28 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-gray-300 dark:border-white/10 bg-gradient-to-br from-gray-100 dark:from-white/[0.08] to-gray-50 dark:to-white/[0.025] p-8 sm:p-12 lg:p-16">
              <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-orange-400/10 blur-[100px]" />

              <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-200 dark:bg-white/10">
                    <MessageCircle size={21} />
                  </div>

                  <h2 className="mt-7 text-4xl font-semibold tracking-tight sm:text-5xl text-gray-900 dark:text-white">
                    Shopping with a
                    <br />
                    human touch.
                  </h2>

                  <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 dark:text-white/45">
                    Can't find the exact product? Your shopper
                    can send you a picture of an alternative and
                    ask before buying.
                  </p>

                  <div className="mt-8 flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-300 dark:border-[#111] bg-gray-200 dark:bg-white/20 text-xs text-gray-900 dark:text-white">
                        A
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-300 dark:border-[#111] bg-gray-200 dark:bg-white/15 text-xs text-gray-900 dark:text-white">
                        M
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-300 dark:border-[#111] bg-gray-200 dark:bg-white/10 text-xs text-gray-900 dark:text-white">
                        K
                      </div>
                    </div>

                    <span className="text-sm text-gray-500 dark:text-white/40">
                      Real people. Real shopping.
                    </span>
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-black/30 p-5 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-white/10">
                      <Users size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Your QuickCart shopper
                      </p>

                      <p className="text-xs text-gray-500 dark:text-white/35">
                        Shopping now
                      </p>
                    </div>

                    <div className="ml-auto h-2 w-2 rounded-full bg-emerald-400" />
                  </div>

                  <div className="mt-6 rounded-2xl bg-gray-50 dark:bg-white/[0.05] p-4">
                    <p className="text-xs text-gray-500 dark:text-white/35">
                      SHOPPER
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-white/75">
                      "They don't have the exact item.
                      I found another option. Should I get
                      this one?"
                    </p>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button className="flex-1 rounded-xl bg-white py-3 text-sm font-semibold text-black">
                      Approve
                    </button>

                    <button className="flex-1 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 py-3 text-sm font-medium text-gray-700 dark:text-white/70">
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-28 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-black">
              <ShoppingBag size={24} />
            </div>

            <h2 className="mt-7 text-4xl font-semibold tracking-tight sm:text-6xl text-gray-900 dark:text-white">
              Be there from day one.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-gray-600 dark:text-white/45">
              Join the early access list and be among the first
              people to experience QuickCart when we launch.
            </p>

            <button
              onClick={openSignup}
              className="mt-8 rounded-full bg-white px-8 py-4 font-semibold text-black transition hover:scale-[1.02]"
            >
              Join QuickCart
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-white/5 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 text-sm text-gray-500 dark:text-white/35 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <ShoppingBag size={16} />
            <span>QuickCart Zambia</span>
          </div>

          <p>
            You need it. We get it.
          </p>

          <p>
            © {new Date().getFullYear()} QuickCart
          </p>
        </div>
      </footer>

      {/* Signup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 dark:bg-black/80 p-4 backdrop-blur-md">
          <div className="flex min-h-full items-center justify-center py-8">
            <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0c0c0c] shadow-2xl">
              <button
                onClick={closeSignup}
                className="absolute right-5 top-5 z-10 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 p-2 text-gray-600 dark:text-white/50 transition hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
              >
                <X size={18} />
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
                  className="p-6 sm:p-9"
                >
                  <div className="pr-10">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-200 dark:bg-white/10">
                      <Sparkles size={19} />
                    </div>

                    <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                      Join early access
                    </h2>

                    <p className="mt-2 max-w-lg text-sm leading-6 text-gray-600 dark:text-white/40">
                      Tell us a little about yourself so we
                      can understand where QuickCart is needed
                      most.
                    </p>
                  </div>

                  {submitError && (
                    <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
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
                    <label className="text-sm font-medium text-gray-700 dark:text-white/80">
                      What would you use QuickCart for?
                    </label>

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
                            className={`rounded-full border px-4 py-2 text-sm transition ${
                              selected
                                ? 'border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-black'
                                : 'border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/[0.035] text-gray-700 dark:text-white/55 hover:bg-gray-200 dark:hover:bg-white/10'
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

                  <div className="mt-7">
                    <label className="text-sm font-medium text-gray-700 dark:text-white/80">
                      Anything else?
                      <span className="ml-2 text-gray-400 dark:text-white/30">
                        Optional
                      </span>
                    </label>

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
                      className="mt-3 w-full resize-none rounded-2xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/[0.035] px-4 py-3 text-sm text-gray-900 dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-white/25 focus:border-gray-400 dark:focus:border-white/25"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                        Joining QuickCart...
                      </>
                    ) : (
                      <>
                        Join early access
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  <p className="mt-4 text-center text-xs leading-5 text-white/25">
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

function MiniFeature({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.03] py-4">
      <div className="text-gray-600 dark:text-white/55">
        {icon}
      </div>

      <span className="text-xs text-gray-500 dark:text-white/35">
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
    <div className="group rounded-[1.75rem] border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/[0.035] p-7 transition duration-300 hover:-translate-y-1 hover:bg-gray-100 dark:hover:bg-white/[0.055]">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white/75">
        {icon}
      </div>

      <h3 className="mt-7 text-xl font-medium text-gray-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-white/40">
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
    <div className="relative rounded-[1.75rem] border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/[0.035] p-7">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-[0.2em] text-gray-400 dark:text-white/25">
          {number}
        </span>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-white/65">
          {icon}
        </div>
      </div>

      <h3 className="mt-10 text-xl font-medium text-gray-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-white/40">
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
      <span className="text-sm font-medium text-gray-700 dark:text-white/80">
        {label}

        {required && (
          <span className="ml-1 text-emerald-400">
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
        className="mt-2 w-full rounded-2xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/[0.035] px-4 py-3.5 text-sm text-gray-900 dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-white/25 focus:border-gray-400 dark:focus:border-white/25"
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
      <span className="text-sm font-medium text-gray-700 dark:text-white/80">
        {label}
      </span>

      <div className="relative">
        <select
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="mt-2 w-full appearance-none rounded-2xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/[0.035] px-4 py-3.5 pr-10 text-sm text-gray-900 dark:text-white outline-none focus:border-gray-400 dark:focus:border-white/25"
        >
          {placeholder && (
            <option
              value=""
              className="bg-white dark:bg-[#0c0c0c]"
            >
              {placeholder}
            </option>
          )}

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-white dark:bg-[#0c0c0c]"
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={17}
          className="pointer-events-none absolute right-4 top-[1.15rem] text-gray-400 dark:text-white/35"
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
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/10">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400 text-black">
          <Check size={28} strokeWidth={3} />
        </div>
      </div>

      <p className="mt-7 text-xs font-medium uppercase tracking-[0.25em] text-emerald-300/70">
        You're in
      </p>

      <h2 className="mt-3 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
        Welcome to QuickCart. 🎉
      </h2>

      <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-600 dark:text-white/40">
        You're officially on the early access list. We'll
        let you know when QuickCart is ready for you.
      </p>

      <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/[0.035] p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-400 dark:text-white/25">
          Lusaka early users
        </p>

        <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
          {signupCount}
        </p>

        <p className="mt-1 text-xs text-gray-500 dark:text-white/30">
          and growing
        </p>
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <button
          onClick={onClose}
          className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black"
        >
          Done
        </button>

        <button
          onClick={onJoinAnother}
          className="rounded-full border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 px-6 py-3 text-sm text-gray-700 dark:text-white/70"
        >
          Join with another profile
        </button>
      </div>
    </div>
  )
}

export default App