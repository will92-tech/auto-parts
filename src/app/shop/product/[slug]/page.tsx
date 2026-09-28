'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { api, type ApiProduct } from '@/lib/api'
import { useCartStore } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const addItem = useCartStore(s => s.addItem)
  const [product, setProduct] = useState<ApiProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => { api.product(slug).then(setProduct).catch(e => setError(e instanceof Error ? e.message : 'Product not found')).finally(() => setLoading(false)) }, [slug])
  if (loading) return <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-500">Loading product…</div>
  if (error || !product) return <div className="max-w-5xl mx-auto px-4 py-16"><p className="text-red-600">{error || 'Product not found'}</p><Link href="/shop" className="text-brand-blue text-sm mt-3 inline-block">Back to shop</Link></div>
  const frontendProduct = { id: product.id, name: product.name, brand: product.brand, sku: product.sku, slug: product.slug, price: product.price, originalPrice: product.original_price ?? undefined, thumbnail: product.thumbnail, images: product.images ?? [product.thumbnail], category: { id: 'api', name: 'Auto Parts', slug: 'service-parts' as const, icon: 'Wrench', itemCount: 0, color: 'bg-blue-50', iconColor: 'text-brand-blue' }, rating: product.rating ?? 0, reviewCount: product.review_count ?? 0, stockCount: product.stock_count ?? 0, inStock: product.in_stock ?? false, condition: (product.condition as 'new' | 'aftermarket' | 'refurbished') ?? 'new', badge: (product.badge as 'hot' | 'sale' | 'new') ?? undefined, description: product.description ?? undefined, specifications: product.specifications ?? {} }
  return <section className="max-w-5xl mx-auto px-4 py-8"><Link href="/shop" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-blue"><ArrowLeft size={16} /> Back to shop</Link><div className="grid md:grid-cols-2 gap-8 mt-6 bg-white rounded-2xl border border-slate-200 p-5"><div className="bg-slate-50 rounded-xl min-h-80 flex items-center justify-center"><img src={product.thumbnail} alt={product.name} className="max-h-80 max-w-full object-contain" /></div><div><p className="text-xs uppercase tracking-widest text-slate-400 font-bold">{product.brand}</p><h1 className="text-2xl font-display font-bold text-navy mt-2">{product.name}</h1><p className="text-2xl font-bold text-brand-blue mt-4">{formatPrice(product.price)}</p><p className="text-sm text-slate-600 leading-relaxed mt-5">{product.description || 'Quality replacement part backed by AutoPartsPro support.'}</p><button disabled={!product.in_stock} onClick={() => addItem(frontendProduct)} className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-brand-blue px-5 py-3 text-sm font-semibold text-white disabled:bg-slate-300"><ShoppingCart size={17} /> {product.in_stock ? 'Add to cart' : 'Out of stock'}</button>{Object.keys(product.specifications ?? {}).length > 0 && <div className="mt-8"><h2 className="font-semibold text-navy">Specifications</h2><dl className="mt-3 divide-y divide-slate-100 text-sm">{Object.entries(product.specifications ?? {}).map(([key, value]) => <div key={key} className="flex justify-between gap-4 py-2"><dt className="text-slate-500">{key}</dt><dd className="font-medium text-navy text-right">{value}</dd></div>)}</dl></div>}</div></div></section>
}
