// Minimal Supabase client (Auth + REST + Storage) built on fetch.
// No extra npm dependency, so the existing pnpm-lock.yaml stays valid.
// Needs VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (anon key only, never service_role).

const URL_ = import.meta.env.VITE_SUPABASE_URL as string | undefined
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
export const supabaseConfigured = Boolean(URL_ && KEY)
const SESSION_KEY = 'tuma.session'

export interface SbUser {
  id: string
  email?: string
  user_metadata?: Record<string, unknown>
}
export interface SbSession {
  access_token: string
  refresh_token: string
  expires_at: number
  user: SbUser
  demo?: boolean
}

let current: SbSession | null = null
let loaded = false
const listeners = new Set<() => void>()

function read(): SbSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as SbSession) : null
  } catch {
    return null
  }
}
function write(s: SbSession | null) {
  current = s
  try {
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s))
    else localStorage.removeItem(SESSION_KEY)
  } catch {
    /* private mode / storage full: keep the in-memory session */
  }
  listeners.forEach((l) => l())
}

export function loadSession(): SbSession | null {
  if (!loaded && typeof window !== 'undefined') {
    loaded = true
    current = read()
  }
  return current
}
export const getSession = () => current
export function syncFromStorage() {
  current = read()
  listeners.forEach((l) => l())
}
export function subscribe(l: () => void) {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}

interface TokenResponse {
  access_token: string
  refresh_token: string
  expires_at?: number
  expires_in?: number
  user: SbUser
}
const toSession = (j: TokenResponse): SbSession => ({
  access_token: j.access_token,
  refresh_token: j.refresh_token,
  expires_at: j.expires_at ?? Math.floor(Date.now() / 1000) + (j.expires_in ?? 3600),
  user: j.user,
})

async function authCall<T = TokenResponse>(path: string, body: unknown, token?: string): Promise<T> {
  if (!URL_ || !KEY) throw new Error('The app is not connected to Supabase yet.')
  const res = await fetch(`${URL_}/auth/v1/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: KEY, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  const json = text ? JSON.parse(text) : {}
  if (!res.ok) throw new Error(json.error_description || json.msg || json.message || json.error || `Request failed (${res.status})`)
  return json as T
}

export async function signInWithPassword(email: string, password: string) {
  write(toSession(await authCall('token?grant_type=password', { email, password })))
}
/** Returns { confirmed:false } when the project requires email confirmation. */
export async function signUp(email: string, password: string, data: Record<string, unknown>) {
  const j = await authCall<Partial<TokenResponse>>('signup', { email, password, data })
  if (j.access_token) {
    write(toSession(j as TokenResponse))
    return { confirmed: true }
  }
  return { confirmed: false }
}
export async function signOut() {
  const s = current
  if (s && !s.demo && supabaseConfigured) {
    try {
      await authCall('logout', {}, s.access_token)
    } catch {
      /* already expired: just clear locally */
    }
  }
  write(null)
}
/** Lets you click around without a Supabase project. Nothing is saved on a server. */
export function startDemo() {
  write({ access_token: 'demo', refresh_token: 'demo', expires_at: 4102444800, demo: true, user: { id: 'demo-user', email: 'demo@example.com', user_metadata: { full_name: 'Demo user' } } })
}

async function freshToken(): Promise<string | null> {
  const s = current
  if (!s || s.demo) return null
  if (s.expires_at - 60 > Date.now() / 1000) return s.access_token
  try {
    write(toSession(await authCall('token?grant_type=refresh_token', { refresh_token: s.refresh_token })))
    return current!.access_token
  } catch {
    write(null)
    return null
  }
}

async function api<T>(base: string, path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  if (!URL_ || !KEY) throw new Error('The app is not connected to Supabase yet.')
  const token = (await freshToken()) ?? KEY
  const { json, headers, ...rest } = init
  const res = await fetch(`${URL_}/${base}/${path}`, {
    ...rest,
    headers: { apikey: KEY, Authorization: `Bearer ${token}`, ...(json !== undefined ? { 'Content-Type': 'application/json' } : {}), ...headers },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  })
  const text = await res.text()
  const body = text ? JSON.parse(text) : null
  if (!res.ok) throw new Error(body?.message || body?.error || `Request failed (${res.status})`)
  return body as T
}

/** PostgREST: select('jobs?select=*&status=eq.open') */
export const select = <T = unknown>(query: string) => api<T[]>('rest/v1', query)
export const insert = <T = unknown>(table: string, row: unknown) =>
  api<T[]>('rest/v1', table, { method: 'POST', json: row, headers: { Prefer: 'return=representation' } })
export const rpc = <T = unknown>(name: string, args: Record<string, unknown> = {}) => api<T>('rest/v1/rpc', name, { method: 'POST', json: args })

/** Uploads an image to a storage bucket and returns its object path. */
export async function uploadImage(bucket: string, folder: string, file: File): Promise<string> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error('Please choose a JPG, PNG or WebP photo')
  if (file.size > 5 * 1024 * 1024) throw new Error('Photo must be under 5 MB')
  const ext = file.type.split('/')[1]
  const path = `${folder}/${crypto.randomUUID()}.${ext}`
  await api('storage/v1/object', `${bucket}/${path}`, { method: 'POST', body: file, headers: { 'Content-Type': file.type } })
  return path
}
export const publicImageUrl = (bucket: string, path: string) => `${URL_}/storage/v1/object/public/${bucket}/${path}`
