import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/lib/auth'
import { Logo } from './logo'

const nav = [
  { to: '/request', label: 'Send a runner' },
  { to: '/stores', label: 'Stores' },
  { to: '/runners', label: 'Become a runner' },
  { to: '/business', label: 'For business' },
] as const

export function SiteHeader() {
  const { firstName, isDemo, signOut } = useAuth()
  return (
    <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-[30px] saturate-[200%] border-b border-white/40">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground motion-reduce:transition-none"
              activeProps={{ className: 'bg-muted text-foreground' }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground lg:inline">Hi, {firstName || 'there'}{isDemo ? ' (demo)' : ''}</span>
          <Button variant="ghost" className="hidden rounded-full sm:inline-flex" onClick={() => void signOut()}>Sign out</Button>
          <Button asChild className="hidden rounded-full sm:inline-flex">
            <Link to="/request">Book now</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>Where would you like to go?</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
                {nav.map((n) => (
                  <Link key={n.to} to={n.to} className="rounded-lg px-3 py-3 text-base font-medium hover:bg-muted">
                    {n.label}
                  </Link>
                ))}
              </nav>
              <div className="px-4 pt-4">
                <Button variant="outline" className="w-full rounded-full" onClick={() => void signOut()}>Sign out</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
