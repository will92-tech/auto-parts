'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import {
  ShoppingCart, Heart, Share2, Shield, Truck,
  RefreshCw, CheckCircle2, Minus, Plus, Zap,
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
import { useWishlistStore, selectWishlistIds } from '@/hooks/useWishlist'
import { PRODUCTS } from '@/lib/data'
import { formatPrice, hasDiscount, discountPercent, badgeConfig, cn } from '@/lib/utils'

export default function ProductPage() {
  const params  = useParams()
  const slug    = params?.slug as string
  const product = PRODUCTS.find((p) => p.slug === slug) ?? PRODUCTS[0]

  const [qty, setQty] = useState(1)

  const addItem        = useCartStore((s) => s.addItem)
  const inCart         = useCartStore((s) => s.items.some((i) => i.product.id === product.id))
  const toggleWishlist = useWishlistStore((s) => s.toggle)
  const wishlistIds    = useWishlistStore(selectWishlistIds)
  const wishlisted     = wishlistIds.has(product.id)

  const discounted = hasDiscount(product)
  const savings    = discounted ? discountPercent(product.originalPrice!, product.price) : 0
  const badge      = badgeConfig(product.badge)
  const related    = PRODUCTS.filter((p) => p.category.slug === product.category.slug && p.id !== product.id).slice(0, 4)

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb items={[
            { label: 'Shop', href: '/shop' },
            { label: product.category.name, href: `/shop?category=${product.category.slug}` },
            { label: product.name },
          ]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* Gallery */}
          <div className="lg:sticky lg:top-20 self-start">
            <ProductGallery images={product.images} productName={product.name} categorySlug={product.category.slug} />
          </div>

          {/* Info panel */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">{product.brand}</span>
              {badge && <Badge variant={product.badge}>{badge.label}</Badge>}
              {product.condition === 'new' && (
                <span className="text-[10px] px-2 py-0.5 bg-green-50 border border-green-200 text-green-700 rounded-full font-medium">OEM / Genuine</span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-navy leading-tight font-display">{product.name}</h1>

            <div className="flex items-center gap-4 flex-wrap">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />
              <span className="text-[11px] text-slate-400">SKU: {product.sku}</span>
              {product.inStock
                ? <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-600"><CheckCircle2 size={12} aria-hidden /> In Stock ({product.stockCount} units)</span>
                : <span className="text-[11px] font-semibold text-red-500">Out of Stock</span>
              }
            </div>

            <div className="flex items-end gap-3">
              <span className="text-3xl font-extrabold text-navy">{formatPrice(product.price)}</span>
              {discounted && (
                <>
                  <span className="text-base text-slate-400 line-through mb-0.5">{formatPrice(product.originalPrice!)}</span>
                  <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded px-2 py-0.5 mb-0.5">Save {savings}%</span>
                </>
              )}
            </div>

            {product.inStock && product.stockCount <= 5 && (
              <p className="text-xs font-semibold text-brand-orange flex items-center gap-1.5">
                <Zap size={12} aria-hidden /> Only {product.stockCount} left — order soon!
              </p>
            )}

            <CompatibilityChecker compatibleVehicles={product.compatibleVehicles} />

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-500 w-12">Qty:</span>
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease" className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors">
                    <Minus size={13} aria-hidden />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-navy" aria-live="polite">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(product.stockCount, q + 1))} disabled={qty >= product.stockCount} aria-label="Increase" className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors">
                    <Plus size={13} aria-hidden />
                  </button>
                </div>
                <span className="text-xs text-slate-400">Total: <strong className="text-navy">{formatPrice(product.price * qty)}</strong></span>
              </div>

              <div className="flex gap-2">
                <Button variant="primary" size="lg" fullWidth disabled={!product.inStock} iconLeft={<ShoppingCart size={16} aria-hidden />} onClick={() => addItem(product, qty)} className={inCart ? 'bg-brand-green border-brand-green' : ''}>
                  {inCart ? 'Added to Cart ✓' : 'Add to Cart'}
                </Button>
                <Button variant="orange" size="lg" fullWidth disabled={!product.inStock} onClick={() => { addItem(product, qty); window.location.href = '/checkout' }}>
                  Buy Now
                </Button>
                <button onClick={() => toggleWishlist(product)} aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'} aria-pressed={wishlisted} className={cn('w-11 h-11 flex-shrink-0 border rounded-lg flex items-center justify-center transition-all', wishlisted ? 'bg-orange-50 border-brand-orange text-brand-orange' : 'border-slate-200 text-slate-400 hover:border-brand-orange hover:text-brand-orange')}>
                  <Heart size={17} fill={wishlisted ? 'currentColor' : 'none'} aria-hidden />
                </button>
              </div>

              <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-blue transition-colors">
                <Share2 size={12} aria-hidden /> Share this product
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
              {[
                { icon: Truck,     text: 'Delivery\n1–3 days' },
                { icon: RefreshCw, text: '30-Day\nReturns'    },
                { icon: Shield,    text: '1-Year\nWarranty'   },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1 text-center">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Icon size={15} className="text-brand-blue" aria-hidden />
                  </div>
                  <span className="text-[10px] text-slate-500 leading-tight whitespace-pre-line">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-8">
          <ProductTabs product={product} />
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-base font-bold text-navy mb-4">
              Related <span className="text-brand-blue">Products</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} isWishlisted={wishlistIds.has(p.id)} onAddToCart={addItem} onToggleWishlist={(pr) => toggleWishlist(pr)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
