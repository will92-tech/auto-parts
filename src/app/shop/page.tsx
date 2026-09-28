'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { useCartStore } from '@/hooks/useCart'
import { useWishlistStore, selectWishlistIds } from '@/hooks/useWishlist'
import { api, type ApiProduct } from '@/lib/api'
import type { Product, SortOption } from '@/types'

function mapProduct(p: ApiProduct): Product {
  return { id: p.id, name: p.name, brand: p.brand, sku: p.sku, slug: p.slug, price: p.price, originalPrice: p.original_price ?? undefined, thumbnail: p.thumbnail, images: p.images ?? [p.thumbnail], category: { id: 'api', name: 'Auto Parts', slug: 'service-parts', icon: 'Wrench', itemCount: 0, color: 'bg-blue-50', iconColor: 'text-brand-blue' }, rating: p.rating ?? 0, reviewCount: p.review_count ?? 0, stockCount: p.stock_count ?? 0, inStock: p.in_stock ?? false, condition: (p.condition as Product['condition']) ?? 'new', badge: (p.badge as Product['badge']) ?? undefined, description: p.description ?? undefined, specifications: p.specifications ?? {}, tags: p.tags ?? [], compatibleVehicles: p.compatibilities?.map(c => ({ make: c.make, model: c.model, yearFrom: c.year_from, yearTo: c.year_to, engine: c.engine ?? undefined })) }
}

export default function ShopPage() {
  const params = useSearchParams()
  const addItem = useCartStore(s => s.addItem)
  const toggleWishlist = useWishlistStore(s => s.toggle)
  const wishlistIds = useWishlistStore(selectWishlistIds)
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sort, setSort] = useState<SortOption>((params.get('sort') as SortOption) || 'best-match')

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError('')
      try {
        const query = new URLSearchParams({ limit: '24', sort })
        for (const key of ['category', 'company']) { const value = params.get(key); if (value) query.set(key === 'company' ? 'brand' : key, value) }
        const q = params.get('q'); if (q) { const result = await api.search(q); setProducts(result.map(mapProduct)); setTotal(result.length); return }
        const result = await api.products(query.toString()); setProducts(result.items.map(mapProduct)); setTotal(result.total)
      } catch (e) { setError(e instanceof Error ? e.message : 'Unable to load products') } finally { setLoading(false) }
    }
    load()
  }, [params, sort])

  return <section className="max-w-7xl mx-auto px-4 py-8"><div className="mb-6"><p className="text-xs uppercase tracking-widest text-brand-blue font-bold">AutoPartsPro shop</p><h1 className="text-3xl font-display font-bold text-navy mt-1">Find the right part</h1><p className="text-sm text-slate-500 mt-2">Search genuine parts by name, brand, category, or SKU.</p></div>{error ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}. Make sure the backend is running at {process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}.</div> : <ProductGrid products={products} totalCount={total} loading={loading} wishlisted={wishlistIds} onAddToCart={addItem} onToggleWishlist={toggleWishlist} onSortChange={setSort} />}</section>
}
