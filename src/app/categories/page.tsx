import Link from 'next/link'
import { CategoryGrid } from '@/components/shop/CategoryCard'
import { CATEGORIES } from '@/lib/data'

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">Categories</p>
          <h1 className="mt-2 text-3xl font-bold text-navy">Shop by category</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <CategoryGrid categories={CATEGORIES} columns={3} />
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="rounded-2xl bg-brand-blue p-8 text-white">
          <h2 className="text-2xl font-bold">Need help choosing?</h2>
          <p className="mt-2 max-w-xl text-sm text-blue-100">
            Explore by engine part, body part, transmission, or electrical components to find the exact fit for your car.
          </p>
          <div className="mt-5">
            <Link href="/shop" className="inline-flex rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand-blue">
              Browse all parts
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
