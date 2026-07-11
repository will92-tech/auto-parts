/**
 * app/page.tsx — Homepage
 *
 * Demonstrates Navbar (via layout), CategoryCard, and ProductCard
 * all working together with real data and Zustand cart integration.
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowRight, Truck, Shield, Headphones, RefreshCw, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CategoryGrid } from '@/components/shop/CategoryCard'
import { ProductCard } from '@/components/shop/ProductCard'
import { CATEGORIES, PRODUCTS, REVIEWS, VEHICLE_MAKES, YEARS, ENGINE_TYPES, PART_SEARCH_COMPANIES, POPULAR_PART_TYPES } from '@/lib/data'
import { useCartStore } from '@/hooks/useCart'
import { useWishlistStore, selectWishlistIds } from '@/hooks/useWishlist'
import { formatPrice } from '@/lib/utils'
import { StarRating } from '@/components/ui/StarRating'
import type { Product } from '@/types'

// ─── Why Choose Us Data ───────────────────────────────────────────────────────

const WHY_US = [
  { icon: Shield,      title: 'Genuine Parts',       desc: 'Every part verified for authenticity — no counterfeits, ever.' },
  { icon: Truck,       title: 'Nationwide Delivery',  desc: 'All 47 counties covered. Same-day dispatch in Nairobi.' },
  { icon: RefreshCw,   title: '30-Day Returns',       desc: 'Wrong fitment or changed your mind? Easy returns, no hassle.' },
  { icon: Headphones,  title: '24/7 Expert Support',  desc: 'Our certified mechanics help you pick the right part.' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter()
  const addItem = useCartStore((s) => s.addItem)
  const toggleWishlist = useWishlistStore((s) => s.toggle)
  const wishlistIds = useWishlistStore(selectWishlistIds)
  const [company, setCompany] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const handleAddToCart = (product: Product) => addItem(product)
  const handleWishlist = (product: Product) => toggleWishlist(product)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (company) params.set('company', company)
    if (searchTerm.trim()) params.set('q', searchTerm.trim())
    router.push(`/shop${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const bestSellers = PRODUCTS.slice(0, 4)

  return (
    <>
      {/* ────────────────────────── HERO ────────────────────────────────── */}
      <section
        className="relative bg-navy overflow-hidden"
        aria-label="Search for vehicle parts"
      >
        {/* Background watermark */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 text-[160px] font-black text-blue-900/20 font-display leading-none select-none pointer-events-none hidden lg:block"
          aria-hidden
        >
          AUTO
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-14 lg:py-20">
          <div className="max-w-xl">

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/15 border border-orange-500/30 rounded-full text-brand-orange text-xs font-semibold mb-4">
              <Zap size={11} aria-hidden /> Kenya's #1 Parts Marketplace
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3">
              Find Genuine <br />
              <span className="text-brand-orange">Vehicle Parts</span> Fast
            </h1>

            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Over 50,000 parts for all makes and models. Delivered to your door or nearest garage across Kenya.
            </p>

            {/* Vehicle Search Card */}
            <div className="bg-white/8 backdrop-blur border border-white/12 rounded-xl p-5">
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-3">
                Search by your vehicle
              </p>

              {/* Selects grid */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { label: 'Make',   options: VEHICLE_MAKES,      placeholder: 'Select Make'        },
                  { label: 'Model',  options: ['Select Make first'], placeholder: 'Select Model'    },
                  { label: 'Year',   options: YEARS.map(String),  placeholder: 'Year'               },
                  { label: 'Engine', options: ENGINE_TYPES,        placeholder: 'Engine Type'        },
                ].map(({ label, placeholder, options }) => (
                  <div key={label}>
                    <label htmlFor={`hero-${label}`} className="sr-only">{label}</label>
                    <select
                      id={`hero-${label}`}
                      defaultValue=""
                      className="w-full px-3 py-2.5 bg-white/8 border border-white/15 rounded-lg text-sm text-white/80 focus:outline-none focus:border-brand-blue appearance-none"
                    >
                      <option value="" disabled>{placeholder}</option>
                      {options.map((o) => (
                        <option key={o} value={o} className="bg-navy">{o}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Search row */}
              <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row">
                <div className="flex-1 flex items-center bg-white/8 border border-white/15 rounded-lg px-3">
                  <svg className="w-4 h-4 text-white/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                  </svg>
                  <input
                    type="search"
                    placeholder="Search parts, brands, SKU…"
                    aria-label="Search parts"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-white px-2 py-2.5 outline-none placeholder:text-white/35"
                  />
                </div>
                <select
                  aria-label="Search by company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="min-w-[140px] px-3 py-2.5 bg-white/8 border border-white/15 rounded-lg text-sm text-white/80 focus:outline-none focus:border-brand-blue appearance-none"
                >
                  <option value="" className="bg-navy">Company</option>
                  {PART_SEARCH_COMPANIES.map((item) => (
                    <option key={item} value={item} className="bg-navy">{item}</option>
                  ))}
                </select>
                <Button type="submit" variant="primary" size="md">
                  Search Parts
                </Button>
              </form>
            </div>

            {/* CTA links */}
            <div className="flex items-center gap-4 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="border-white/25 text-white/80 hover:bg-white hover:text-navy hover:border-white"
              >
                Shop All Parts
              </Button>
              <span className="text-white/40 text-xs flex items-center gap-1.5">
                <Truck size={12} aria-hidden /> Free delivery on KES 5,000+
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── STATS BAR ───────────────────────────────── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-200">
            {[
              { icon: '📦', value: '50,000+', label: 'Parts in stock' },
              { icon: '🚚', value: 'Nationwide', label: 'Delivery' },
              { icon: '✅', value: 'Genuine', label: 'Warranty on all parts' },
              { icon: '🎧', value: '24/7', label: 'Customer support' },
            ].map(({ icon, value, label }) => (
              <div key={label} className="flex items-center gap-3 py-3 px-4">
                <span className="text-xl flex-shrink-0" role="img" aria-hidden>{icon}</span>
                <div>
                  <p className="text-sm font-semibold text-navy">{value}</p>
                  <p className="text-xs text-slate-400">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────── CATEGORIES ──────────────────────────────── */}
      <section className="bg-white py-10 px-4" aria-labelledby="categories-heading">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 id="categories-heading" className="text-lg font-bold text-navy">
                Shop by <span className="text-brand-blue">Category</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Browse 6 major part categories</p>
            </div>
            <Link href="/categories" className="text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} aria-hidden />
            </Link>
          </div>

          <CategoryGrid categories={CATEGORIES} columns={3} variant="default" />
        </div>
      </section>

      {/* ─────────────────────── POPULAR PART TYPES ─────────────────────── */}
      <section className="py-10 px-4 bg-slate-50" aria-labelledby="popular-parts-heading">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 id="popular-parts-heading" className="text-lg font-bold text-navy">
                Popular <span className="text-brand-blue">Part Types</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Spark plugs, air cleaners, and brake pads for everyday maintenance</p>
            </div>
            <Link href="/shop" className="text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1">
              Explore shop <ArrowRight size={12} aria-hidden />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {POPULAR_PART_TYPES.map((part) => (
              <Link
                key={part.slug}
                href={`/shop?company=${encodeURIComponent(part.company)}&q=${encodeURIComponent(part.name)}`}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white hover:border-brand-blue hover:shadow-hover transition-all"
              >
                <div className="relative h-36 bg-slate-50">
                  <Image src={part.image} alt={part.name} fill className="object-contain p-3" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{part.company}</p>
                  <h3 className="mt-1 text-sm font-semibold text-navy group-hover:text-brand-blue transition-colors">{part.name}</h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">{part.blurb}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── BEST SELLERS ────────────────────────────── */}
      <section className="py-10 px-4 bg-white" aria-labelledby="bestsellers-heading">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 id="bestsellers-heading" className="text-lg font-bold text-navy">
                Best <span className="text-brand-blue">Sellers</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Most ordered this month</p>
            </div>
            <Link href="/shop?sort=most-popular" className="text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} aria-hidden />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {bestSellers.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={i < 2}
                isWishlisted={wishlistIds.has(product.id)}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleWishlist}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── WHY CHOOSE US ───────────────────────────── */}
      <section className="py-10 px-4 bg-white" aria-labelledby="why-us-heading">
        <div className="max-w-7xl mx-auto">
          <h2 id="why-us-heading" className="text-lg font-bold text-navy text-center mb-6">
            Why <span className="text-brand-blue">Choose</span> AutoPartsPro
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {WHY_US.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-2 p-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icon size={20} className="text-brand-blue" aria-hidden />
                </div>
                <h3 className="text-sm font-semibold text-navy">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── REVIEWS ────────────────────────────────── */}
      <section className="py-10 px-4 bg-slate-50" aria-labelledby="reviews-heading">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 id="reviews-heading" className="text-lg font-bold text-navy">
                Customer <span className="text-brand-blue">Reviews</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Trusted by 12,000+ customers</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-extrabold text-navy">4.8</span>
              <span className="text-yellow-400 text-lg">★</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {REVIEWS.map((review) => (
              <article
                key={review.id}
                className="bg-white border border-slate-200 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${review.avatarColor}`}>
                      {review.authorInitials}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-navy">{review.authorName}</p>
                      <p className="text-[10px] text-slate-400">
                        Verified Buyer{review.location ? ` · ${review.location}` : ''}
                      </p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} showCount={false} size="sm" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{review.comment}</p>
                <p className="text-[10px] text-slate-400 mt-2">
                  {new Date(review.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── NEWSLETTER ─────────────────────────────── */}
      <section className="bg-brand-blue py-10 px-4" aria-labelledby="newsletter-heading">
        <div className="max-w-lg mx-auto text-center">
          <h2 id="newsletter-heading" className="text-base font-bold text-white mb-1">
            Get exclusive deals in your inbox
          </h2>
          <p className="text-xs text-white/70 mb-4">
            Join 8,000+ subscribers. Only genuine part offers and service tips — no spam.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-2"
            aria-label="Newsletter signup"
          >
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Your email address"
              className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-white/50"
            />
            <Button variant="orange" type="submit" size="md">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </>
  )
}
