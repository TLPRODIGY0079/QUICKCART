import { useEffect, type ReactNode } from 'react'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'
import { Logo } from './logo'
import { SiteHeader } from './site-header'
import { SiteFooter } from './site-footer'

function Splash() {
  return (
    <div className="grid min-h-dvh place-items-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Logo />
        <span className="size-6 animate-spin rounded-full border-2 border-muted border-t-primary motion-reduce:animate-none" role="status" aria-label="Loading" />
      </div>
    </div>
  )
}

/**
 * The first screen is always /login. Signed-out visitors are sent there from any URL;
 * after signing in they land on the home page (/).
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const { ready, user } = useAuth()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const navigate = useNavigate()
  const onLogin = pathname === '/login'

  useEffect(() => {
    if (!ready) return
    if (!user && !onLogin) void navigate({ to: '/login', replace: true })
    else if (user && onLogin) void navigate({ to: '/', replace: true })
  }, [ready, user, onLogin, navigate])

  if (!ready || (!user && !onLogin) || (user && onLogin)) return <Splash />
  if (onLogin) return <>{children}</>
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  )
}
