'use client'

import { useState } from 'react'
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProductCard, ProductCardSkeleton } from '@/components/shop/ProductCard'
import type { Product, SortOption } from '@/types'

// ─── Sort Options ─────────────────────────────────────────────────────────────

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'best-match',   label: 'Best Match'       },
  { value: 'price-asc',    label: 'Price: Low → High' },
  { value: 'price-desc',   label: 'Price: High → Low' },
  { value: 'newest',       label: 'Newest First'      },
  { value: 'best-rated',   label: 'Best Rated'        },
  { value: 'most-popular', label: 'Most Popular'      },
]

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProductGridProps {
  products: Product[]
  totalCount?: number
  loading?: boolean
  skeletonCount?: number
  wishlisted?: Set<string>
  onAddToCart?: (product: Product) => void
  onToggleWishlist?: (product: Product, wishlisted: boolean) => void
  onSortChange?: (sort: SortOption) => void
  onToggleMobileFilters?: () => void
  className?: string
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        <span className="text-3xl" role="img" aria-label="No results">📦</span>
      </div>
      <h3 className="text-base font-semibold text-navy mb-1">No parts found</h3>
      <p className="text-sm text-slate-400 max-w-xs">
        Try adjusting your filters or search term to find what you're looking for.
      </p>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProductGrid({
  products,
  totalCount,
  loading = false,
  skeletonCount = 6,
  wishlisted = new Set(),
  onAddToCart,
  onToggleWishlist,
  onSortChange,
  onToggleMobileFilters,
  className,
}: ProductGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sort,     setSort]     = useState<SortOption>('best-match')

  const handleSortChange = (value: SortOption) => {
    setSort(value)
    onSortChange?.(value)
  }

  const displayCount = totalCount ?? products.length

  return (
    <div className={cn('flex flex-col gap-3', className)}>

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">

        {/* Result count + mobile filter toggle */}
        <div className="flex items-center gap-2">
          {/* Mobile filters button */}
          {onToggleMobileFilters && (
            <button
              onClick={onToggleMobileFilters}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:border-brand-blue hover:text-brand-blue transition-colors"
              aria-label="Open filters"
            >
              <SlidersHorizontal size={13} aria-hidden />
              Filters
            </button>
          )}

          <p className="text-xs text-slate-500">
            {loading ? (
              <span className="inline-block w-24 h-3 bg-slate-100 rounded animate-pulse" />
            ) : (
              <>
                <strong className="text-navy font-semibold">
                  {displayCount.toLocaleString()}
                </strong>{' '}
                result{displayCount !== 1 ? 's' : ''}
              </>
            )}
          </p>
        </div>

        {/* Sort + view toggle */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="sr-only">Sort by</label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="h-8 pl-2 pr-7 border border-slate-200 rounded-lg text-xs text-slate-600 bg-white focus:outline-none focus:border-brand-blue cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* View mode toggle — hidden on mobile */}
          <div className="hidden sm:flex gap-0.5 border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
              className={cn(
                'w-8 h-8 flex items-center justify-center transition-colors',
                viewMode === 'grid'
                  ? 'bg-brand-blue text-white'
                  : 'bg-white text-slate-400 hover:text-slate-600'
              )}
            >
              <LayoutGrid size={14} aria-hidden />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
              className={cn(
                'w-8 h-8 flex items-center justify-center transition-colors',
                viewMode === 'list'
                  ? 'bg-brand-blue text-white'
                  : 'bg-white text-slate-400 hover:text-slate-600'
              )}
            >
              <List size={14} aria-hidden />
            </button>
          </div>
        </div>
      </div>

      {/* ── Grid / List ─────────────────────────────────────────────────── */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {loading
            ? Array.from({ length: skeletonCount }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : products.length === 0
              ? <EmptyState />
              : products.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    variant="grid"
                    isWishlisted={wishlisted.has(p.id)}
                    onAddToCart={onAddToCart}
                    onToggleWishlist={onToggleWishlist}
                  />
                ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {loading
            ? Array.from({ length: skeletonCount }).map((_, i) => (
                <ProductCardSkeleton key={i} variant="list" />
              ))
            : products.length === 0
              ? <EmptyState />
              : products.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    variant="list"
                    isWishlisted={wishlisted.has(p.id)}
                    onAddToCart={onAddToCart}
                    onToggleWishlist={onToggleWishlist}
                  />
                ))}
        </div>
      )}
    </div>
  )
}
