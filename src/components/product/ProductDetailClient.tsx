'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ShoppingCart, Heart, Share2, Truck, RefreshCw,
  Shield, Minus, Plus, CheckCircle2, AlertCircle,
} from 'lucide-react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Badge } from '@/components/ui/Badge'
import { StarRating } from '@/components/ui/StarRating'
import { Button } from '@/components/ui/Button'
import { ProductGallery } from '@/components/product/ProductGallery'
import { CompatibilityChecker } from '@/components/product/CompatibilityChecker'
import { ProductTabs } from '@/components/product/ProductTabs'
import { ProductCard } from '@/components/shop/ProductCard'
import { useCartStore } from '@/hooks/useCart'
import { useWishlistStore } from '@/hooks/useWishlist'
import { PRODUCTS } from '@/lib/data'
import {
  formatPrice, hasDiscount, discountPercent, badgeConfig,
  savedAmount, stockStatus, cn,
} from '@/lib/utils'
import type { Product } from '@/types'

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProductDetailClientProps {
  product: Product
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [qty, setQty] = useState(1)
  const [shared, setShared] = useState(false)

  const addItem        = useCartStore((s) => s.addItem)
  const toggle         = useWishlistStore((s) => s.toggle)
  const isWishlisted   = useWishlistStore((s) => s.isInList(product.id))

  const badge      = badgeConfig(product.badge)
  const discounted = hasDiscount(product)
  const savings    = discounted ? savedAmount(product.originalPrice!, product.price) : 0
  const pct        = discounted ? discountPercent(product.originalPrice!, product.price) : 0
  const stock      = stockStatus(product)

  const decQty = () => setQty((q) => Math.max(1, q - 1))
  const incQty = () => setQty((q) => Math.min(product.stockCount, q + 1))

  const handleAddToCart = () => {
    if (!product.inStock) return
    addItem(product, qty)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    }
  }

  // Related: same category, exclude self
  const related = PRODUCTS
    .filter((p) => p.category.slug === product.category.slug && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Breadcrumb bar ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb
            items={[
              { label: 'Shop',             href: '/shop'                               },
              { label: product.category.name, href: `/shop?category=${product.category.slug}` },
              { label: product.name                                                    },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── LEFT: Gallery ─────────────────────────────────────────── */}
          <div className="space-y-4">
            <ProductGallery
              images={product.images}
              productName={product.name}
              categorySlug={product.category.slug}
            />

            {/* Trust badges below gallery (desktop) */}
            <div className="hidden lg:grid grid-cols-3 gap-2">
              {[
                { icon: Truck,    label: '1–3 day delivery'  },
                { icon: Shield,   label: '1-year warranty'   },
                { icon: RefreshCw,label: '30-day returns'    },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-2">
                  <Icon size={13} className="text-brand-blue flex-shrink-0" aria-hidden />
                  <span className="text-[11px] text-slate-600">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Product info ────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Brand + badge row */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-brand-blue uppercase tracking-widest">
                {product.brand}
              </span>
              <div className="flex items-center gap-1.5">
                {badge && <Badge variant={product.badge}>{badge.label}</Badge>}
                <button
                  onClick={handleShare}
                  aria-label="Share product"
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:border-brand-blue hover:text-brand-blue transition-colors"
                >
                  <Share2 size={12} aria-hidden />
                </button>
              </div>
            </div>

            {/* Product name */}
            <h1 className="text-xl font-bold text-navy leading-snug font-display">
              {product.name}
            </h1>

            {/* SKU + Rating row */}
            <div className="flex items-center flex-wrap gap-3">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />
              <span className="text-slate-300">|</span>
              <span className="text-[11px] text-slate-400">SKU: <strong className="text-navy">{product.sku}</strong></span>
              <span className="text-slate-300">|</span>
              <span className={cn('text-[11px] font-semibold flex items-center gap-1', stock.color)}>
                {product.inStock
                  ? <CheckCircle2 size={11} aria-hidden />
                  : <AlertCircle size={11} aria-hidden />
                }
                {stock.label}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 flex-wrap">
              <span className="text-3xl font-extrabold text-navy font-display">
                {formatPrice(product.price)}
              </span>
              {discounted && (
                <>
                  <span className="text-base text-slate-400 line-through pb-0.5">
                    {formatPrice(product.originalPrice!)}
                  </span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs font-bold">
                    Save {pct}% · {formatPrice(savings)}
                  </span>
                </>
              )}
            </div>

            {/* Compatibility checker */}
            <CompatibilityChecker compatibleVehicles={product.compatibleVehicles} />

            {/* ── Purchase section ──────────────────────────────────── */}
            <div className="space-y-3">

              {/* Qty + Add to cart */}
              <div className="flex gap-2 items-center">
                {/* Quantity control */}
                <div
                  className="flex items-center border border-slate-200 rounded-lg overflow-hidden"
                  role="group"
                  aria-label="Quantity"
                >
                  <button
                    onClick={decQty}
                    disabled={qty <= 1}
                    aria-label="Decrease quantity"
                    className="w-9 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus size={13} aria-hidden />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-navy" aria-live="polite">
                    {qty}
                  </span>
                  <button
                    onClick={incQty}
                    disabled={qty >= product.stockCount}
                    aria-label="Increase quantity"
                    className="w-9 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus size={13} aria-hidden />
                  </button>
                </div>

                {/* Add to cart */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={!product.inStock}
                  onClick={handleAddToCart}
                  iconLeft={<ShoppingCart size={16} aria-hidden />}
                >
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>

                {/* Wishlist */}
                <button
                  onClick={() => toggle(product)}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  aria-pressed={isWishlisted}
                  className={cn(
                    'w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0',
                    isWishlisted
                      ? 'bg-orange-50 border-brand-orange text-brand-orange'
                      : 'border-slate-200 text-slate-400 hover:border-brand-orange hover:text-brand-orange'
                  )}
                >
                  <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} aria-hidden />
                </button>
              </div>

              {/* Buy Now */}
              <Button
                variant="orange"
                size="lg"
                fullWidth
                disabled={!product.inStock}
                onClick={() => {
                  handleAddToCart()
                  window.location.href = '/checkout'
                }}
              >
                Buy Now — {formatPrice(product.price * qty)}
              </Button>

              {/* Share success toast */}
              {shared && (
                <p className="text-xs text-green-600 text-center animate-fade-in">
                  ✓ Link copied to clipboard!
                </p>
              )}
            </div>

            {/* Trust strip (mobile) */}
            <div className="lg:hidden grid grid-cols-3 gap-2">
              {[
                { icon: Truck,    label: '1–3 day delivery'  },
                { icon: Shield,   label: '1-year warranty'   },
                { icon: RefreshCw,label: '30-day returns'    },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-2">
                  <Icon size={13} className="text-brand-blue flex-shrink-0" aria-hidden />
                  <span className="text-[11px] text-slate-600">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────────────────────── */}
        <div className="mt-10 bg-white rounded-xl border border-slate-200 p-5">
          <ProductTabs product={product} />
        </div>

        {/* ── Related products ──────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-10" aria-labelledby="related-heading">
            <div className="flex items-center justify-between mb-4">
              <h2 id="related-heading" className="text-base font-bold text-navy">
                You may also <span className="text-brand-blue">like</span>
              </h2>
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="text-xs font-semibold text-brand-blue hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={addItem} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
