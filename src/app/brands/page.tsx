import Link from 'next/link'
import { PRODUCTS } from '@/lib/data'

export default function BrandsPage() {
  const brands = Array.from(new Set(PRODUCTS.map((product) => product.brand))).sort()

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">Brands</p>
          <h1 className="mt-2 text-3xl font-bold text-navy">Trusted product brands</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <Link
              key={brand}
              href={`/shop?brand=${encodeURIComponent(brand)}`}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-brand-blue hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-brand-blue">
                {brand.slice(0, 1).toUpperCase()}
              </div>
              <h2 className="mt-4 text-lg font-semibold text-navy">{brand}</h2>
              <p className="mt-2 text-sm text-slate-500">Shop all products from {brand}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
