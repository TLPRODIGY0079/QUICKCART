import { Link } from '@tanstack/react-router'

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight" aria-label="Tuma home">
      <span className="relative grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 12h12" />
          <path d="m12 6 6 6-6 6" />
          <circle cx="20" cy="12" r="1.2" fill="currentColor" />
        </svg>
      </span>
      <span className={light ? 'text-white' : 'text-foreground'}>tuma</span>
    </Link>
  )
}
