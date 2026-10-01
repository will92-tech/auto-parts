import Link from 'next/link'
import { PRODUCTS } from '@/lib/data'
import { ProductCard } from '@/components/shop/ProductCard'

export default function DealsPage() {
  const dealProducts = PRODUCTS.filter((product) => product.badge === 'sale' || product.badge === 'hot')

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">Deals</p>
          <h1 className="mt-2 text-3xl font-bold text-navy">Hot deals this week</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} variant="grid" />
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-brand-blue p-8 text-white">
          <h2 className="text-2xl font-bold">Need a bulk discount?</h2>
          <p className="mt-2 max-w-xl text-sm text-blue-100">
            Talk to our commercial team for workshop pricing and fleet supply contracts across Kenya.
          </p>
          <div className="mt-5">
            <Link href="/trade" className="inline-flex rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand-blue">
              Explore trade offers
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
