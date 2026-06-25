import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Product, OrderStatus } from '@/types'

// ─── Class Merging ────────────────────────────────────────────────────────────

/**
 * Merges Tailwind classes safely, resolving conflicts.
 * Use this for all conditional class building.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Price Formatting ─────────────────────────────────────────────────────────

/** Format a number as Kenyan Shillings, e.g. KES 2,800 */
export function formatPrice(amount: number): string {
  return `KES ${amount.toLocaleString('en-KE')}`
}

/** Calculate discount percentage between original and sale price */
export function discountPercent(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100)
}

/** Amount saved between original and sale price */
export function savedAmount(original: number, sale: number): number {
  return original - sale
}

// ─── Product Helpers ──────────────────────────────────────────────────────────

/** Returns true if a product has an active discount */
export function hasDiscount(product: Product): boolean {
  return !!product.originalPrice && product.originalPrice > product.price
}

/** Returns stock availability label and color */
export function stockStatus(product: Product): { label: string; color: string } {
  if (!product.inStock)             return { label: 'Out of Stock', color: 'text-red-600' }
  if (product.stockCount <= 5)      return { label: `Only ${product.stockCount} left`, color: 'text-orange-500' }
  return { label: `In Stock (${product.stockCount})`, color: 'text-green-600' }
}

/** Returns badge label and styling for product badges */
export function badgeConfig(badge?: Product['badge']): { label: string; className: string } | null {
  if (!badge) return null
  const map: Record<NonNullable<Product['badge']>, { label: string; className: string }> = {
    hot:  { label: 'HOT',  className: 'bg-red-50 text-red-600' },
    sale: { label: 'SALE', className: 'bg-orange-50 text-orange-500' },
    new:  { label: 'NEW',  className: 'bg-green-50 text-green-600' },
  }
  return map[badge]
}

// ─── Vehicle Helpers ──────────────────────────────────────────────────────────

/** Format a vehicle compatibility range as a readable string */
export function formatVehicleRange(make: string, model: string, from: number, to: number): string {
  return `${make} ${model} ${from}–${to}`
}

// ─── Order Helpers ────────────────────────────────────────────────────────────

export function orderStatusConfig(status: OrderStatus): { label: string; className: string } {
  const map: Record<OrderStatus, { label: string; className: string }> = {
    pending:     { label: 'Pending',     className: 'bg-slate-100 text-slate-600' },
    processing:  { label: 'Processing',  className: 'bg-blue-50 text-blue-600' },
    'in-transit':{ label: 'In Transit',  className: 'bg-orange-50 text-orange-500' },
    delivered:   { label: 'Delivered',   className: 'bg-green-50 text-green-600' },
    cancelled:   { label: 'Cancelled',   className: 'bg-red-50 text-red-600' },
  }
  return map[status]
}

// ─── Rating Helpers ───────────────────────────────────────────────────────────

/** Render star characters for a rating (0–5) */
export function renderStars(rating: number): string {
  const full  = Math.floor(rating)
  const half  = rating % 1 >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty)
}

// ─── URL Helpers ──────────────────────────────────────────────────────────────

export function productUrl(slug: string): string {
  return `/shop/product/${slug}`
}

export function categoryUrl(slug: string): string {
  return `/shop?category=${slug}`
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-KE', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}
