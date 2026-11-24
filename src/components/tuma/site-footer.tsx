import { Link } from '@tanstack/react-router'
import { Logo } from './logo'

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-foreground text-background">
      <div className="mx-auto grid max-w-content gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo light />
          <p className="max-w-xs text-sm text-background/60">
            Send a trusted runner for anything, anywhere in Zambia. Lusaka · Kitwe · Ndola · Livingstone and growing.
          </p>
        </div>
        <FooterCol title="Clients" links={[{ to: '/request', label: 'Send a runner' }, { to: '/stores', label: 'Browse stores' }]} />
        <FooterCol title="Earn" links={[{ to: '/runners', label: 'Become a runner' }, { to: '/business', label: 'List your store' }]} />
        <div className="space-y-3 text-sm">
          <p className="font-semibold">Pay your way</p>
          <p className="text-background/60">Airtel Money · MTN MoMo · Zamtel Kwacha · Visa & Mastercard · Cash</p>
        </div>
      </div>
      <div className="border-t border-background/10 py-5 text-center text-xs text-background/50">
        © {new Date().getFullYear()} Tuma Zambia. Made in Lusaka.
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: { to: '/request' | '/stores' | '/runners' | '/business'; label: string }[] }) {
  return (
    <div className="space-y-3 text-sm">
      <p className="font-semibold">{title}</p>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-background/60 transition-colors hover:text-background">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
