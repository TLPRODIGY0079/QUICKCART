import { Backpack, Package, PlaneLanding, ShoppingBasket, Sparkles, Wrench, type LucideProps } from 'lucide-react'
import type { ServiceId } from '@/data/fixtures'

const icons = {
  shopping: ShoppingBasket,
  parcel: Package,
  school: Backpack,
  airport: PlaneLanding,
  'car-service': Wrench,
  errand: Sparkles,
} satisfies Record<ServiceId, React.ComponentType<LucideProps>>

export function ServiceIcon({ id, ...props }: { id: ServiceId } & LucideProps) {
  const Icon = icons[id]
  return <Icon aria-hidden {...props} />
}
