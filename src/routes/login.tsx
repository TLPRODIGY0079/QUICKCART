import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/tuma/logo'
import { cdnImg } from '@/components/tuma/img'
import { useAuth } from '@/lib/auth'

export const Route = createFileRoute('/login')({
  head: () => ({ meta: [{ title: 'Sign in · Tuma' }] }),
  component: LoginPage,
})

const intents = [
  { id: 'client', label: 'I want to send a runner' },
  { id: 'runner', label: 'I want to earn as a runner' },
  { id: 'store', label: 'I own a store' },
] as const

function LoginPage() {
  const { signIn, signUp, startDemo, configured } = useAuth()
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [intent, setIntent] = useState<(typeof intents)[number]['id']>('client')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (mode === 'up' && (name.trim().length < 2 || phone.trim().length < 9)) {
      setError('Please enter your name and a valid phone number.')
      return
    }
    setBusy(true)
    try {
      if (mode === 'in') {
        await signIn(email.trim(), password)
      } else {
        const r = await signUp(email.trim(), password, { full_name: name.trim(), phone: phone.trim(), requested_role: intent })
        if (!r.confirmed) {
          toast.success('Check your email to confirm your account, then sign in.')
          setMode('in')
        }
      }
      // On success the auth gate sends you to the home page.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src={cdnImg('hero-runner.png')}
          alt="A smiling Tuma runner on a motorbike with a bag of fresh vegetables at a Lusaka market"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <p className="font-display text-4xl font-extrabold leading-tight">Tuma someone.<br />For anything.</p>
          <p className="mt-2 max-w-md text-white/85">Groceries, parcels, school pickups and more, matched to a trusted runner near you anywhere in Zambia.</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Logo />
          <h1 className="mt-8 font-display text-3xl font-bold">{mode === 'in' ? 'Welcome back' : 'Create your account'}</h1>
          <p className="mt-1 text-muted-foreground">{mode === 'in' ? 'Sign in to book a runner or manage your jobs.' : 'It takes under a minute.'}</p>

          <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
            {mode === 'up' && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Chileshe Mwansa" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone (WhatsApp)</Label>
                  <Input id="phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="097 123 4567" />
                </div>
                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium">I'm here to…</legend>
                  <div className="grid gap-2">
                    {intents.map((i) => (
                      <label key={i.id} className={'flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm ' + (intent === i.id ? 'border-primary bg-primary/5' : 'border-border')}>
                        <input type="radio" name="intent" className="accent-[var(--primary)]" checked={intent === i.id} onChange={() => setIntent(i.id)} />
                        {i.label}
                      </label>
                    ))}
                  </div>
                  {intent !== 'client' && <p className="text-xs text-muted-foreground">Runner and store accounts are reviewed by our team before they go live. You can order as a client in the meantime.</p>}
                </fieldset>
              </>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete={mode === 'in' ? 'current-password' : 'new-password'} minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
            </div>
            {error && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
            <Button type="submit" size="lg" className="w-full rounded-full" disabled={busy || !email || password.length < 6}>
              {busy ? 'Please wait…' : mode === 'in' ? 'Sign in' : 'Create account'}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {mode === 'in' ? 'New to Tuma?' : 'Already have an account?'}{' '}
            <button type="button" className="font-semibold text-primary hover:underline" onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setError('') }}>
              {mode === 'in' ? 'Create an account' : 'Sign in'}
            </button>
          </p>

          {!configured && (
            <div className="mt-6 rounded-lg border border-dashed border-border p-4 text-sm">
              <p className="font-medium">Supabase is not connected yet</p>
              <p className="mt-1 text-muted-foreground">Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to sign in for real. Until then you can look around in demo mode.</p>
              <Button type="button" variant="outline" className="mt-3 rounded-full" onClick={startDemo}>Continue in demo mode</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
