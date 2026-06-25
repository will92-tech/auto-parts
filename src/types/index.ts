// ─── Product Types ──────────────────────────────────────────────────────────

export interface Product {
  id: string
  name: string
  brand: string
  sku: string
  slug: string
  price: number
  originalPrice?: number
  images: string[]
  thumbnail: string
  category: Category
  rating: number
  reviewCount: number
  stockCount: number
  inStock: boolean
  condition: 'new' | 'aftermarket' | 'refurbished'
  badge?: 'hot' | 'sale' | 'new'
  compatibleVehicles?: CompatibleVehicle[]
  description?: string
  specifications?: Record<string, string>
  tags?: string[]
}

export interface CompatibleVehicle {
  make: string
  model: string
  yearFrom: number
  yearTo: number
  engine?: string
}

// ─── Category Types ──────────────────────────────────────────────────────────

export type CategorySlug =
  | 'service-parts'
  | 'engine-parts'
  | 'transmission'
  | 'body-parts'
  | 'sound-systems'
  | 'efc-components'
  | 'electrical'
  | 'suspension'
  | 'brakes'

export interface Category {
  id: string
  name: string
  slug: CategorySlug
  icon: string          // lucide icon name
  itemCount: number
  color: string         // Tailwind bg class
  iconColor: string     // Tailwind text class
  image?: string
}

// ─── Cart Types ──────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  couponCode?: string
  discount: number
}

// ─── User & Auth Types ───────────────────────────────────────────────────────

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatarInitials: string
  savedVehicles?: SavedVehicle[]
}

export interface SavedVehicle {
  id: string
  make: string
  model: string
  year: number
  engine: string
  registration?: string
}

// ─── Order Types ─────────────────────────────────────────────────────────────

export type OrderStatus = 'pending' | 'processing' | 'in-transit' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  date: string
  items: CartItem[]
  total: number
  status: OrderStatus
  trackingNumber?: string
}

// ─── Filter & Search Types ───────────────────────────────────────────────────

export interface VehicleFilter {
  make?: string
  model?: string
  year?: number
  engine?: string
}

export interface ProductFilters {
  vehicle?: VehicleFilter
  categories?: CategorySlug[]
  brands?: string[]
  minPrice?: number
  maxPrice?: number
  conditions?: Product['condition'][]
  inStockOnly?: boolean
  rating?: number
}

export type SortOption =
  | 'best-match'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'best-rated'
  | 'most-popular'

// ─── Navigation Types ─────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

export interface MegaMenuColumn {
  title: string
  items: { label: string; href: string; icon?: string }[]
}

// ─── Review Types ─────────────────────────────────────────────────────────────

export interface Review {
  id: string
  authorName: string
  authorInitials: string
  avatarColor: string
  rating: number
  comment: string
  date: string
  verified: boolean
  location?: string
}

// ─── Utility Types ────────────────────────────────────────────────────────────

export type Size = 'sm' | 'md' | 'lg'
export type Variant = 'primary' | 'outline' | 'ghost' | 'orange'

export interface PaginationState {
  page: number
  perPage: number
  total: number
}
