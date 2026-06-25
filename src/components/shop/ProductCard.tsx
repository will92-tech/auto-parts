'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react'
import { cn, formatPrice, hasDiscount, discountPercent, badgeConfig, productUrl } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { StarRating } from '@/components/ui/StarRating'
import type { Product } from '@/types'

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: Product
  /** 'grid' = standard 2-col card | 'list' = horizontal layout | 'compact' = mini card */
  variant?: 'grid' | 'list' | 'compact'
  onAddToCart?: (product: Product) => void
  onToggleWishlist?: (product: Product, wishlisted: boolean) => void
  isWishlisted?: boolean
  className?: string
  priority?: boolean   // true for above-the-fold images (LCP)
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function ProductCardSkeleton({ variant = 'grid' }: { variant?: 'grid' | 'list' }) {
  if (variant === 'list') {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex gap-3 animate-pulse">
        <div className="w-24 h-24 bg-slate-100 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2 py-1">
          <div className="h-3 bg-slate-100 rounded w-1/4" />
          <div className="h-4 bg-slate-100 rounded w-3/4" />
          <div className="h-3 bg-slate-100 rounded w-1/3" />
          <div className="h-5 bg-slate-100 rounded w-1/4" />
        </div>
      </div>
    )
  }
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden animate-pulse">
      <div className="h-36 bg-slate-100" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-slate-100 rounded w-1/3" />
        <div className="h-4 bg-slate-100 rounded w-4/5" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 bg-slate-100 rounded w-1/4" />
          <div className="h-7 w-7 bg-slate-100 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProductCard({
  product,
  variant = 'grid',
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  className,
  priority = false,
}: ProductCardProps) {
  const [wishlisted, setWishlisted]     = useState(isWishlisted)
  const [cartAdded,  setCartAdded]      = useState(false)
  const [imgError,   setImgError]       = useState(false)

  const badge      = badgeConfig(product.badge)
  const discounted = hasDiscount(product)
  const savings    = discounted ? discountPercent(product.originalPrice!, product.price) : 0

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const next = !wishlisted
      setWishlisted(next)
      onToggleWishlist?.(product, next)
    },
    [wishlisted, onToggleWishlist, product]
  )

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!product.inStock) return
      setCartAdded(true)
      onAddToCart?.(product)
      // Reset feedback after 2s
      setTimeout(() => setCartAdded(false), 2000)
    },
    [onAddToCart, product]
  )

  // ── Image fallback ───────────────────────────────────────────────────────────

  const productEmojis: Record<string, string> = {
    'service-parts':  '🔧',
    'engine-parts':   '⚙️',
    'transmission':   '⚙️',
    'body-parts':     '🚗',
    'sound-systems':  '🔊',
    'efc-components': '💡',
    'electrical':     '⚡',
    'suspension':     '🔩',
    'brakes':         '🛞',
  }
  const fallbackEmoji = productEmojis[product.category.slug] ?? '📦'

  // ────────────────────────────────────────────────────────────────────────────
  // COMPACT VARIANT (carousel / related products)
  // ────────────────────────────────────────────────────────────────────────────

  if (variant === 'compact') {
    return (
      <Link
        href={productUrl(product.slug)}
        className={cn(
          'bg-white border border-slate-200 rounded-xl overflow-hidden flex-shrink-0',
          'hover:border-brand-blue hover:shadow-hover transition-all duration-200 w-36 block',
          className
        )}
      >
        {/* Image */}
        <div className="h-20 bg-slate-50 flex items-center justify-center relative">
          {!imgError && product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              className="object-contain p-2"
              onError={() => setImgError(true)}
              sizes="144px"
            />
          ) : (
            <span className="text-3xl" role="img" aria-label={product.name}>{fallbackEmoji}</span>
          )}
        </div>

        {/* Info */}
        <div className="p-2">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{product.brand}</p>
          <p className="text-xs font-semibold text-navy leading-tight mt-0.5 line-clamp-2">{product.name}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-bold text-navy">{formatPrice(product.price)}</span>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              aria-label={`Add ${product.name} to cart`}
              className={cn(
                'w-6 h-6 rounded-md flex items-center justify-center transition-colors',
                product.inStock
                  ? 'bg-brand-blue text-white hover:bg-blue-700'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              )}
            >
              <ShoppingCart size={11} aria-hidden />
            </button>
          </div>
        </div>
      </Link>
    )
  }

  // ────────────────────────────────────────────────────────────────────────────
  // LIST VARIANT (shop list view)
  // ────────────────────────────────────────────────────────────────────────────

  if (variant === 'list') {
    return (
      <Link
        href={productUrl(product.slug)}
        className={cn(
          'bg-white border border-slate-200 rounded-xl p-3 flex gap-3 items-start',
          'hover:border-brand-blue hover:shadow-hover transition-all duration-200 group',
          className
        )}
      >
        {/* Image */}
        <div className="w-24 h-24 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden">
          {badge && (
            <span className={cn('absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded', badge.className)}>
              {badge.label}
            </span>
          )}
          {!imgError && product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              className="object-contain p-2"
              onError={() => setImgError(true)}
              sizes="96px"
            />
          ) : (
            <span className="text-3xl" role="img" aria-label={product.name}>{fallbackEmoji}</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{product.brand}</p>
          <h3 className="text-sm font-semibold text-navy mt-0.5 line-clamp-2 group-hover:text-brand-blue transition-colors">
            {product.name}
          </h3>
          <StarRating rating={product.rating} reviewCount={product.reviewCount} className="mt-1" />

          <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
            <div>
              <span className="text-base font-bold text-navy">{formatPrice(product.price)}</span>
              {discounted && (
                <span className="text-xs text-slate-400 line-through ml-1.5">
                  {formatPrice(product.originalPrice!)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {/* Wishlist */}
              <button
                onClick={handleWishlist}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-pressed={wishlisted}
                className={cn(
                  'w-8 h-8 rounded-lg border flex items-center justify-center transition-all',
                  wishlisted
                    ? 'bg-orange-50 border-brand-orange text-brand-orange'
                    : 'bg-white border-slate-200 text-slate-400 hover:border-brand-orange hover:text-brand-orange'
                )}
              >
                <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} aria-hidden />
              </button>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                aria-label={product.inStock ? `Add ${product.name} to cart` : 'Out of stock'}
                className={cn(
                  'h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all',
                  product.inStock
                    ? cartAdded
                      ? 'bg-brand-green text-white'
                      : 'bg-brand-blue text-white hover:bg-blue-700'
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                )}
              >
                <ShoppingCart size={12} aria-hidden />
                {cartAdded ? 'Added!' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // ────────────────────────────────────────────────────────────────────────────
  // GRID VARIANT (default)
  // ────────────────────────────────────────────────────────────────────────────

  return (
    <Link
      href={productUrl(product.slug)}
      className={cn(
        'bg-white border border-slate-200 rounded-xl overflow-hidden',
        'hover:border-brand-blue hover:shadow-hover transition-all duration-200 group',
        'flex flex-col',
        className
      )}
      aria-label={`${product.name} — ${formatPrice(product.price)}`}
    >
      {/* ── Image Section ─────────────────────────────────────────────────── */}
      <div className="relative bg-slate-50 h-36 overflow-hidden">

        {/* Product image or emoji fallback */}
        {!imgError && product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            priority={priority}
            className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <span className="text-5xl" role="img" aria-label={product.name}>{fallbackEmoji}</span>
          </div>
        )}

        {/* Badge (HOT / SALE / NEW) */}
        {badge && (
          <div className="absolute top-2 left-2">
            <Badge variant={product.badge}>{badge.label}</Badge>
          </div>
        )}

        {/* Discount pill */}
        {discounted && savings > 0 && (
          <div className="absolute top-2 right-10">
            <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded">
              -{savings}%
            </span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
          className={cn(
            'absolute top-2 right-2 w-7 h-7 rounded-lg border flex items-center justify-center',
            'opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-150',
            wishlisted
              ? 'bg-orange-50 border-brand-orange text-brand-orange opacity-100'
              : 'bg-white border-slate-200 text-slate-400 hover:border-brand-orange hover:text-brand-orange'
          )}
        >
          <Heart size={13} fill={wishlisted ? 'currentColor' : 'none'} aria-hidden />
        </button>

        {/* Quick view (hover reveal) */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-150 translate-y-1 group-hover:translate-y-0">
          <button
            onClick={(e) => { e.preventDefault(); /* open quick view modal */ }}
            className="flex items-center gap-1 bg-white border border-slate-200 rounded-full px-2.5 py-1 text-[10px] font-medium text-slate-600 hover:text-brand-blue shadow-sm whitespace-nowrap"
            aria-label="Quick view"
          >
            <Eye size={10} aria-hidden /> Quick View
          </button>
        </div>

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* ── Info Section ──────────────────────────────────────────────────── */}
      <div className="p-3 flex flex-col flex-1">

        {/* Brand */}
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
          {product.brand}
        </p>

        {/* Name */}
        <h3 className="text-[13px] font-semibold text-navy mt-0.5 leading-snug line-clamp-2 group-hover:text-brand-blue transition-colors flex-1">
          {product.name}
        </h3>

        {/* Rating */}
        <StarRating
          rating={product.rating}
          reviewCount={product.reviewCount}
          className="mt-1.5"
        />

        {/* Price + Cart */}
        <div className="flex items-center justify-between mt-2.5 gap-2">
          <div>
            <span className="text-[15px] font-bold text-navy leading-none">
              {formatPrice(product.price)}
            </span>
            {discounted && (
              <span className="text-[11px] text-slate-400 line-through block leading-none mt-0.5">
                {formatPrice(product.originalPrice!)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            aria-label={product.inStock ? `Add ${product.name} to cart` : 'Out of stock'}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0',
              product.inStock
                ? cartAdded
                  ? 'bg-brand-green text-white scale-95'
                  : 'bg-brand-blue text-white hover:bg-blue-700 active:scale-95'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            )}
          >
            <ShoppingCart size={14} aria-hidden />
          </button>
        </div>

        {/* Low stock warning */}
        {product.inStock && product.stockCount <= 5 && (
          <p className="text-[10px] text-brand-orange mt-1.5 font-medium">
            Only {product.stockCount} left in stock
          </p>
        )}
      </div>
    </Link>
  )
}
