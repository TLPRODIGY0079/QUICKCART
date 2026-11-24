import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react'
import * as sb from './sb'

interface AuthValue {
  /** false until the saved session has been read in the browser */
  ready: boolean
  user: sb.SbUser | null
  isDemo: boolean
  configured: boolean
  firstName: string
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, data: Record<string, unknown>) => Promise<{ confirmed: boolean }>
  signOut: () => Promise<void>
  startDemo: () => void
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const session = useSyncExternalStore(sb.subscribe, sb.getSession, () => null)

  useEffect(() => {
    sb.loadSession()
    setReady(true)
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'tuma.session') sb.syncFromStorage()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const signIn = useCallback((email: string, password: string) => sb.signInWithPassword(email, password), [])
  const signUp = useCallback((email: string, password: string, data: Record<string, unknown>) => sb.signUp(email, password, data), [])
  const signOut = useCallback(() => sb.signOut(), [])

  const value = useMemo<AuthValue>(() => {
    const name = String(session?.user?.user_metadata?.full_name ?? session?.user?.email ?? '')
    return {
      ready,
      user: session?.user ?? null,
      isDemo: Boolean(session?.demo),
      configured: sb.supabaseConfigured,
      firstName: name.split(/[\s@]/)[0] ?? '',
      signIn,
      signUp,
      signOut,
      startDemo: sb.startDemo,
    }
  }, [ready, session, signIn, signUp, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthValue {
  const v = useContext(AuthContext)
  if (!v) throw new Error('useAuth must be used inside <AuthProvider>')
  return v
}
