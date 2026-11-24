/**
 * Stubbed data for Tuma's first milestone.
 *
 * Everything the UI reads lives here so a later milestone can swap these
 * exports for Netlify Database queries without touching the screens.
 * See PLAN.md for the roadmap.
 */

export type ServiceId =
  | 'shopping'
  | 'parcel'
  | 'school'
  | 'airport'
  | 'car-service'
  | 'errand'

export type Vehicle = 'motorbike' | 'car' | 'van' | 'bicycle' | 'on-foot'

export interface Service {
  id: ServiceId
  name: string
  tagline: string
  icon: string // lucide icon name, resolved in components/service-icon.tsx
  basePrice: number // ZMW
  perKm: number // ZMW
  vehicles: Vehicle[]
  needsVerifiedRunner?: boolean
  example: string
}

export const services: Service[] = [
  {
    id: 'shopping',
    name: 'Shop & deliver',
    tagline: 'A runner buys it for you, from any shop or market.',
    icon: 'ShoppingBasket',
    basePrice: 35,
    perKm: 6,
    vehicles: ['motorbike', 'car', 'bicycle', 'on-foot'],
    example: 'Groceries from Shoprite Manda Hill, fresh kapenta from Soweto Market',
  },
  {
    id: 'parcel',
    name: 'Parcels & drop-offs',
    tagline: 'Send documents, packages or forgotten keys across town.',
    icon: 'Package',
    basePrice: 30,
    perKm: 5,
    vehicles: ['motorbike', 'bicycle', 'car', 'van'],
    example: 'Contracts to an office on Cairo Road, a gift to Kitwe',
  },
  {
    id: 'school',
    name: 'School pickups',
    tagline: 'Verified, background-checked drivers collect your kids.',
    icon: 'Backpack',
    basePrice: 80,
    perKm: 8,
    vehicles: ['car'],
    needsVerifiedRunner: true,
    example: 'Daily 14:30 pickup from Lusaka International Community School',
  },
  {
    id: 'airport',
    name: 'Airport pickups',
    tagline: 'Meet-and-greet at KKIA, Simon Mwansa Kapwepwe or Livingstone.',
    icon: 'PlaneLanding',
    basePrice: 250,
    perKm: 9,
    vehicles: ['car', 'van'],
    needsVerifiedRunner: true,
    example: 'Collect a guest from Kenneth Kaunda International, flight ET 873',
  },
  {
    id: 'car-service',
    name: 'Car servicing runs',
    tagline: 'We drive your car to the garage, wait, and bring it back.',
    icon: 'Wrench',
    basePrice: 150,
    perKm: 7,
    vehicles: ['on-foot', 'motorbike'],
    needsVerifiedRunner: true,
    example: 'Take the Hilux for its 60,000 km service at Toyota Zambia',
  },
  {
    id: 'errand',
    name: 'Anything else',
    tagline: 'Queues, bill payments, pharmacy runs: describe it and we match you.',
    icon: 'Sparkles',
    basePrice: 40,
    perKm: 6,
    vehicles: ['motorbike', 'car', 'bicycle', 'on-foot'],
    example: 'Collect a prescription, stand in line at PACRA, pay ZESCO tokens',
  },
]

export interface Area {
  id: string
  name: string
  city: 'Lusaka' | 'Kitwe' | 'Ndola' | 'Livingstone'
  lat: number
  lng: number
}

export const areas: Area[] = [
  { id: 'cairo-road', name: 'Cairo Road / CBD', city: 'Lusaka', lat: -15.4167, lng: 28.2833 },
  { id: 'manda-hill', name: 'Manda Hill', city: 'Lusaka', lat: -15.3975, lng: 28.3055 },
  { id: 'east-park', name: 'East Park Mall', city: 'Lusaka', lat: -15.3936, lng: 28.3215 },
  { id: 'kabulonga', name: 'Kabulonga', city: 'Lusaka', lat: -15.4186, lng: 28.3417 },
  { id: 'woodlands', name: 'Woodlands', city: 'Lusaka', lat: -15.4317, lng: 28.3189 },
  { id: 'chilenje', name: 'Chilenje', city: 'Lusaka', lat: -15.4475, lng: 28.3228 },
  { id: 'ibex-hill', name: 'Ibex Hill', city: 'Lusaka', lat: -15.4361, lng: 28.3722 },
  { id: 'roma', name: 'Roma', city: 'Lusaka', lat: -15.3717, lng: 28.3203 },
  { id: 'matero', name: 'Matero', city: 'Lusaka', lat: -15.3756, lng: 28.2589 },
  { id: 'soweto', name: 'Soweto Market', city: 'Lusaka', lat: -15.4244, lng: 28.2711 },
  { id: 'kalingalinga', name: 'Kalingalinga', city: 'Lusaka', lat: -15.4072, lng: 28.3336 },
  { id: 'kkia', name: 'Kenneth Kaunda Intl Airport', city: 'Lusaka', lat: -15.3308, lng: 28.4526 },
  { id: 'kitwe-cbd', name: 'Kitwe CBD', city: 'Kitwe', lat: -12.8024, lng: 28.2132 },
  { id: 'ndola-cbd', name: 'Ndola CBD', city: 'Ndola', lat: -12.9587, lng: 28.6366 },
  { id: 'livingstone', name: 'Livingstone Town', city: 'Livingstone', lat: -17.8419, lng: 25.8543 },
]

export const areaById = (id: string) => areas.find((a) => a.id === id)

export interface Runner {
  id: string
  name: string
  initials: string
  rating: number
  trips: number
  vehicle: Vehicle
  plate?: string
  verified: boolean
  online: boolean
  lat: number
  lng: number
  languages: string[]
  specialties: ServiceId[]
}

export const runners: Runner[] = [
  { id: 'r1', name: 'Mwila Banda', initials: 'MB', rating: 4.96, trips: 1284, vehicle: 'motorbike', plate: 'BCA 4521', verified: true, online: true, lat: -15.401, lng: 28.309, languages: ['English', 'Bemba'], specialties: ['shopping', 'parcel', 'errand'] },
  { id: 'r2', name: 'Chipo Mulenga', initials: 'CM', rating: 4.99, trips: 642, vehicle: 'car', plate: 'BAZ 1180', verified: true, online: true, lat: -15.422, lng: 28.337, languages: ['English', 'Nyanja'], specialties: ['school', 'airport', 'shopping'] },
  { id: 'r3', name: 'Joseph Phiri', initials: 'JP', rating: 4.88, trips: 2210, vehicle: 'motorbike', plate: 'ALB 9032', verified: true, online: true, lat: -15.419, lng: 28.276, languages: ['English', 'Nyanja', 'Tonga'], specialties: ['parcel', 'shopping'] },
  { id: 'r4', name: 'Natasha Zulu', initials: 'NZ', rating: 4.93, trips: 418, vehicle: 'car', plate: 'BCF 2207', verified: true, online: true, lat: -15.338, lng: 28.43, languages: ['English', 'Lozi'], specialties: ['airport', 'errand'] },
  { id: 'r5', name: 'Kelvin Tembo', initials: 'KT', rating: 4.81, trips: 305, vehicle: 'bicycle', verified: false, online: true, lat: -15.409, lng: 28.329, languages: ['English', 'Nyanja'], specialties: ['shopping', 'errand'] },
  { id: 'r6', name: 'Grace Mwansa', initials: 'GM', rating: 4.97, trips: 879, vehicle: 'on-foot', verified: true, online: true, lat: -15.433, lng: 28.321, languages: ['English', 'Bemba'], specialties: ['car-service', 'errand'] },
  { id: 'r7', name: 'Brian Lungu', initials: 'BL', rating: 4.76, trips: 1520, vehicle: 'van', plate: 'BAH 7710', verified: true, online: false, lat: -15.378, lng: 28.262, languages: ['English', 'Bemba'], specialties: ['parcel', 'airport'] },
  { id: 'r8', name: 'Ruth Chanda', initials: 'RC', rating: 4.91, trips: 233, vehicle: 'car', plate: 'BCD 3381', verified: true, online: true, lat: -15.44, lng: 28.368, languages: ['English', 'Bemba', 'Nyanja'], specialties: ['school', 'shopping'] },
  { id: 'r9', name: 'Daniel Sakala', initials: 'DS', rating: 4.85, trips: 960, vehicle: 'motorbike', plate: 'ACK 5512', verified: true, online: true, lat: -12.805, lng: 28.215, languages: ['English', 'Bemba'], specialties: ['shopping', 'parcel'] },
  { id: 'r10', name: 'Mercy Nkandu', initials: 'MN', rating: 4.94, trips: 512, vehicle: 'car', plate: 'BCH 6620', verified: true, online: true, lat: -17.845, lng: 25.858, languages: ['English', 'Tonga', 'Lozi'], specialties: ['airport', 'errand'] },
]

export type StoreCategory =
  | 'Groceries'
  | 'Pharmacy'
  | 'Restaurants'
  | 'Hardware'
  | 'Fashion'
  | 'Electronics'
  | 'Market'

export interface Product {
  id: string
  name: string
  price: number // ZMW
  unit?: string
  emoji: string
  popular?: boolean
}

export interface Store {
  id: string
  name: string
  category: StoreCategory
  areaId: string
  rating: number
  reviews: number
  openHours: string
  description: string
  accent: string // tailwind gradient classes for the store banner
  emoji: string
  products: Product[]
}

export const stores: Store[] = [
  {
    id: 'kapenta-corner',
    name: 'Kapenta Corner',
    category: 'Market',
    areaId: 'soweto',
    rating: 4.8,
    reviews: 412,
    openHours: '06:00 – 18:00',
    description: 'Dried kapenta, bream and village chicken from Soweto Market. Bulk orders welcome.',
    accent: 'from-amber-500 to-orange-700',
    emoji: '🐟',
    products: [
      { id: 'p1', name: 'Siavonga kapenta', price: 95, unit: '1 kg', emoji: '🐟', popular: true },
      { id: 'p2', name: 'Fresh bream (Kafue)', price: 120, unit: 'each', emoji: '🐠' },
      { id: 'p3', name: 'Village chicken', price: 180, unit: 'whole', emoji: '🐔', popular: true },
      { id: 'p4', name: 'Dried beans', price: 45, unit: '1 kg', emoji: '🫘' },
      { id: 'p5', name: 'Groundnuts', price: 55, unit: '1 kg', emoji: '🥜' },
      { id: 'p6', name: 'Tomatoes', price: 30, unit: 'basket', emoji: '🍅' },
    ],
  },
  {
    id: 'mealie-mart',
    name: 'Mealie Mart Grocers',
    category: 'Groceries',
    areaId: 'manda-hill',
    rating: 4.6,
    reviews: 1290,
    openHours: '07:00 – 21:00',
    description: 'Everyday groceries, breakfast meal, cooking oil and household essentials.',
    accent: 'from-emerald-600 to-teal-800',
    emoji: '🛒',
    products: [
      { id: 'g1', name: 'Breakfast mealie meal', price: 285, unit: '25 kg', emoji: '🌽', popular: true },
      { id: 'g2', name: 'Cooking oil', price: 165, unit: '5 L', emoji: '🫗' },
      { id: 'g3', name: 'Fresh milk', price: 32, unit: '2 L', emoji: '🥛' },
      { id: 'g4', name: 'Brown bread', price: 28, unit: 'loaf', emoji: '🍞' },
      { id: 'g5', name: 'Eggs', price: 75, unit: 'tray of 30', emoji: '🥚', popular: true },
      { id: 'g6', name: 'Sugar', price: 70, unit: '2 kg', emoji: '🧂' },
    ],
  },
  {
    id: 'kabulonga-pharmacy',
    name: 'Kabulonga Pharmacy',
    category: 'Pharmacy',
    areaId: 'kabulonga',
    rating: 4.9,
    reviews: 238,
    openHours: '08:00 – 22:00',
    description: 'Prescriptions, baby care and over-the-counter medicine. Runner brings your script.',
    accent: 'from-sky-600 to-indigo-800',
    emoji: '💊',
    products: [
      { id: 'm1', name: 'Paracetamol 500mg', price: 25, unit: '24 tabs', emoji: '💊', popular: true },
      { id: 'm2', name: 'ORS sachets', price: 18, unit: 'pack of 5', emoji: '🧃' },
      { id: 'm3', name: 'Baby diapers', price: 210, unit: 'size 3', emoji: '🍼' },
      { id: 'm4', name: 'Mosquito repellent', price: 65, unit: '150 ml', emoji: '🦟' },
      { id: 'm5', name: 'Vitamin C', price: 90, unit: '60 tabs', emoji: '🍊' },
    ],
  },
  {
    id: 'nshima-house',
    name: 'Nshima House',
    category: 'Restaurants',
    areaId: 'cairo-road',
    rating: 4.7,
    reviews: 870,
    openHours: '10:00 – 21:00',
    description: 'Nshima with ifisashi, T-bone, chicken stew and the best chibwabwa on Cairo Road.',
    accent: 'from-red-600 to-rose-900',
    emoji: '🍲',
    products: [
      { id: 'n1', name: 'Nshima & T-bone', price: 120, emoji: '🥩', popular: true },
      { id: 'n2', name: 'Nshima & village chicken', price: 110, emoji: '🍗', popular: true },
      { id: 'n3', name: 'Ifisashi & kapenta', price: 75, emoji: '🥬' },
      { id: 'n4', name: 'Munkoyo', price: 20, unit: '500 ml', emoji: '🥤' },
      { id: 'n5', name: 'Fritters (6)', price: 15, emoji: '🍩' },
    ],
  },
  {
    id: 'copperbelt-hardware',
    name: 'Copperbelt Hardware',
    category: 'Hardware',
    areaId: 'kitwe-cbd',
    rating: 4.5,
    reviews: 156,
    openHours: '08:00 – 17:30',
    description: 'Cement, plumbing, paint and tools. Van runners available for heavy orders.',
    accent: 'from-stone-600 to-stone-900',
    emoji: '🔧',
    products: [
      { id: 'h1', name: 'Cement 50 kg', price: 185, emoji: '🧱', popular: true },
      { id: 'h2', name: 'PVC pipe 4m', price: 95, emoji: '🪠' },
      { id: 'h3', name: 'Paint 20 L', price: 780, emoji: '🎨' },
      { id: 'h4', name: 'Claw hammer', price: 140, emoji: '🔨' },
    ],
  },
  {
    id: 'chitenge-studio',
    name: 'Chitenge Studio',
    category: 'Fashion',
    areaId: 'east-park',
    rating: 4.9,
    reviews: 302,
    openHours: '09:00 – 19:00',
    description: 'Tailored chitenge dresses, shirts and fabric by the metre, made in Lusaka.',
    accent: 'from-fuchsia-600 to-orange-600',
    emoji: '👗',
    products: [
      { id: 'f1', name: 'Chitenge fabric', price: 120, unit: '2 m', emoji: '🧵', popular: true },
      { id: 'f2', name: 'Tailored shirt', price: 450, emoji: '👔' },
      { id: 'f3', name: 'Wrap dress', price: 650, emoji: '👗' },
      { id: 'f4', name: 'Head wrap', price: 90, emoji: '🧣' },
    ],
  },
  {
    id: 'volt-electronics',
    name: 'Volt Electronics',
    category: 'Electronics',
    areaId: 'ndola-cbd',
    rating: 4.4,
    reviews: 98,
    openHours: '08:30 – 18:00',
    description: 'Phones, solar kits and accessories. Same-day delivery across Ndola.',
    accent: 'from-violet-600 to-slate-900',
    emoji: '🔌',
    products: [
      { id: 'e1', name: 'Solar lantern kit', price: 520, emoji: '☀️', popular: true },
      { id: 'e2', name: 'Power bank 20,000 mAh', price: 380, emoji: '🔋' },
      { id: 'e3', name: 'USB-C cable', price: 60, emoji: '🔌' },
      { id: 'e4', name: 'Bluetooth speaker', price: 450, emoji: '🔊' },
    ],
  },
]

export const storeById = (id: string) => stores.find((s) => s.id === id)

export interface OpenJob {
  id: string
  service: ServiceId
  title: string
  fromAreaId: string
  toAreaId: string
  payout: number
  when: string
  items?: number
}

export const openJobs: OpenJob[] = [
  { id: 'j1', service: 'shopping', title: 'Weekly groceries, 14 items', fromAreaId: 'manda-hill', toAreaId: 'roma', payout: 85, when: 'Now', items: 14 },
  { id: 'j2', service: 'school', title: 'Pick up 2 kids from school', fromAreaId: 'kabulonga', toAreaId: 'ibex-hill', payout: 140, when: 'Today 14:30' },
  { id: 'j3', service: 'parcel', title: 'Signed documents to law firm', fromAreaId: 'woodlands', toAreaId: 'cairo-road', payout: 60, when: 'Now' },
  { id: 'j4', service: 'airport', title: 'Arrival meet & greet, 2 bags', fromAreaId: 'kkia', toAreaId: 'kabulonga', payout: 420, when: 'Today 18:05' },
  { id: 'j5', service: 'car-service', title: 'Hilux to the garage and back', fromAreaId: 'chilenje', toAreaId: 'cairo-road', payout: 210, when: 'Tomorrow 08:00' },
  { id: 'j6', service: 'shopping', title: 'Kapenta & chicken from Soweto', fromAreaId: 'soweto', toAreaId: 'kalingalinga', payout: 70, when: 'Now', items: 3 },
  { id: 'j7', service: 'errand', title: 'Queue & pay at PACRA', fromAreaId: 'cairo-road', toAreaId: 'cairo-road', payout: 90, when: 'Today 10:00' },
  { id: 'j8', service: 'parcel', title: 'Birthday cake delivery', fromAreaId: 'east-park', toAreaId: 'chilenje', payout: 55, when: 'Now' },
]

export const stats = {
  runners: '2,400+',
  towns: 9,
  avgMatch: '3 min',
  rating: '4.9',
}
