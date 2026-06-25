// ─── UI Primitives ────────────────────────────────────────────────────────────
export { Button }      from '@/components/ui/Button'
export { Badge }       from '@/components/ui/Badge'
export { StarRating }  from '@/components/ui/StarRating'

// ─── Layout ───────────────────────────────────────────────────────────────────
export { Navbar }         from '@/components/layout/Navbar'
export { NavbarWrapper }  from '@/components/layout/NavbarWrapper'

// ─── Shop Components ──────────────────────────────────────────────────────────
export { ProductCard, ProductCardSkeleton }          from '@/components/shop/ProductCard'
export { CategoryCard, CategoryGrid, CategoryCardSkeleton } from '@/components/shop/CategoryCard'
export { ProductGrid }                               from '@/components/shop/ProductGrid'

// ─── Types ────────────────────────────────────────────────────────────────────
export type { Product, Category, CartItem, User, Order, Review, ProductFilters, SortOption } from '@/types'

// ─── Hooks / Stores ───────────────────────────────────────────────────────────
export { useCartStore, selectCartCount, selectCartSubtotal, selectCartTotal } from '@/hooks/useCart'
export { useWishlistStore, selectWishlistCount, selectWishlistIds }           from '@/hooks/useWishlist'

// ─── Utils ────────────────────────────────────────────────────────────────────
export { cn, formatPrice, discountPercent, hasDiscount, productUrl, categoryUrl, formatDate } from '@/lib/utils'

// ─── Data ─────────────────────────────────────────────────────────────────────
export { CATEGORIES, PRODUCTS, REVIEWS, VEHICLE_MAKES, VEHICLE_MODELS, YEARS } from '@/lib/data'
