'use client'

import { useState, useMemo } from 'react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { FilterPanel, ActiveFilters } from '@/components/shop/FilterPanel'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { Pagination } from '@/components/ui/Pagination'
import { useCartStore } from '@/hooks/useCart'
import { useWishlistStore, selectWishlistIds } from '@/hooks/useWishlist'
import { PRODUCTS } from '@/lib/data'
import type { Product, ProductFilters, SortOption } from '@/types'

const PER_PAGE = 8

// ─── Simple client-side filter + sort (replace with API calls later) ──────────

function applyFilters(products: Product[], filters: ProductFilters, sort: SortOption): Product[] {
  let result = [...products]

  if (filters.categories?.length)
    result = result.filter((p) => filters.categories!.includes(p.category.slug))

  if (filters.vehicle?.make)
    result = result.filter((p) =>
      p.compatibleVehicles?.some((v) => v.make === filters.vehicle!.make)
    )

  if (filters.inStockOnly)
    result = result.filter((p) => p.inStock)

  if (filters.conditions?.length)
    result = result.filter((p) => filters.conditions!.includes(p.condition))

  if (filters.maxPrice)
    result = result.filter((p) => p.price <= filters.maxPrice!)

  if (filters.rating)
    result = result.filter((p) => p.rating >= filters.rating!)

  switch (sort) {
    case 'price-asc':    result.sort((a, b) => a.price - b.price);            break
    case 'price-desc':   result.sort((a, b) => b.price - a.price);            break
    case 'best-rated':   result.sort((a, b) => b.rating - a.rating);          break
    case 'most-popular': result.sort((a, b) => b.reviewCount - a.reviewCount); break
    case 'newest':       result.sort((a, b) => a.id.localeCompare(b.id));     break
  }

  return result
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function ShopPage() {
  const [filters,        setFilters]        = useState<ProductFilters>({})
  const [sort,           setSort]           = useState<SortOption>('best-match')
  const [page,           setPage]           = useState(1)
  const [mobileFilters,  setMobileFilters]  = useState(false)

  const addItem        = useCartStore((s) => s.addItem)
  const toggleWishlist = useWishlistStore((s) => s.toggle)
  const wishlistIds    = useWishlistStore(selectWishlistIds)

  const filtered   = useMemo(() => applyFilters(PRODUCTS, filters, sort), [filters, sort])
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleFilterChange = (next: ProductFilters) => {
    setFilters(next)
    setPage(1)
  }

  const handleSortChange = (s: SortOption) => {
    setSort(s)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Top Bar ────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb items={[{ label: 'Shop', href: '/shop' }]} />
          <h1 className="text-lg font-bold text-navy mt-1">
            All Parts
            <span className="text-sm font-normal text-slate-400 ml-2">
              ({filtered.length.toLocaleString()} products)
            </span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex min-h-screen">

        {/* ── Desktop Filter Sidebar ─────────────────────────────────── */}
        <div className="hidden lg:block sticky top-14 self-start h-[calc(100vh-56px)] overflow-y-auto">
          <FilterPanel
            filters={filters}
            onChange={handleFilterChange}
            totalCount={filtered.length}
          />
        </div>

        {/* ── Main Content ───────────────────────────────────────────── */}
        <main className="flex-1 p-4 min-w-0">

          {/* Active filters */}
          <ActiveFilters filters={filters} onChange={handleFilterChange} />

          {/* Product grid with toolbar */}
          <ProductGrid
            products={paginated}
            totalCount={filtered.length}
            wishlisted={wishlistIds}
            onAddToCart={addItem}
            onToggleWishlist={(p) => toggleWishlist(p)}
            onSortChange={handleSortChange}
            onToggleMobileFilters={() => setMobileFilters(true)}
          />

          {/* Pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="mt-6"
          />
        </main>
      </div>

      {/* ── Mobile Filter Drawer ───────────────────────────────────── */}
      {mobileFilters && (
        <FilterPanel
          filters={filters}
          onChange={handleFilterChange}
          onClose={() => setMobileFilters(false)}
          isMobile
          totalCount={filtered.length}
        />
      )}
    </div>
  )
}
