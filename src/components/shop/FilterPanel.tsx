'use client'

import { useState } from 'react'
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { CATEGORIES, PART_SEARCH_COMPANIES, VEHICLE_MAKES, YEARS } from '@/lib/data'
import { Button } from '@/components/ui/Button'
import type { ProductFilters, CategorySlug } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FilterPanelProps {
  filters: ProductFilters
  onChange: (filters: ProductFilters) => void
  onClose?: () => void          // mobile only
  isMobile?: boolean
  totalCount?: number
}

// ─── Collapsible section wrapper ──────────────────────────────────────────────

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-slate-100 pb-4 mb-4 last:border-none last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full mb-3 group"
        aria-expanded={open}
      >
        <span className="text-[11px] font-bold text-navy uppercase tracking-widest">
          {title}
        </span>
        {open
          ? <ChevronUp size={13} className="text-slate-400 group-hover:text-navy transition-colors" aria-hidden />
          : <ChevronDown size={13} className="text-slate-400 group-hover:text-navy transition-colors" aria-hidden />
        }
      </button>
      {open && <div className="space-y-0.5">{children}</div>}
    </div>
  )
}

// ─── Checkbox option ──────────────────────────────────────────────────────────

function FilterOption({
  id,
  label,
  count,
  checked,
  onChange,
}: {
  id: string
  label: string
  count?: number
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center justify-between py-1.5 cursor-pointer group"
    >
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-3.5 h-3.5 rounded accent-brand-blue cursor-pointer"
        />
        <span className={cn(
          'text-xs transition-colors',
          checked ? 'text-navy font-medium' : 'text-slate-600 group-hover:text-navy'
        )}>
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className="text-[10px] text-slate-400">{count.toLocaleString()}</span>
      )}
    </label>
  )
}

// ─── Active filter tags ───────────────────────────────────────────────────────

export function ActiveFilters({
  filters,
  onChange,
}: {
  filters: ProductFilters
  onChange: (filters: ProductFilters) => void
}) {
  const tags: { label: string; remove: () => void }[] = []

  filters.categories?.forEach((slug) => {
    const cat = CATEGORIES.find((c) => c.slug === slug)
    if (cat) tags.push({ label: cat.name, remove: () =>
      onChange({ ...filters, categories: filters.categories?.filter((s) => s !== slug) })
    })
  })

  filters.vehicle?.make && tags.push({
    label: filters.vehicle.make,
    remove: () => onChange({ ...filters, vehicle: { ...filters.vehicle, make: undefined } }),
  })

  filters.brands?.forEach((brand) => {
    tags.push({
      label: brand,
      remove: () => onChange({ ...filters, brands: filters.brands?.filter((b) => b !== brand) }),
    })
  })

  filters.inStockOnly && tags.push({
    label: 'In Stock',
    remove: () => onChange({ ...filters, inStockOnly: false }),
  })

  filters.conditions?.forEach((c) => {
    tags.push({ label: c.charAt(0).toUpperCase() + c.slice(1), remove: () =>
      onChange({ ...filters, conditions: filters.conditions?.filter((x) => x !== c) })
    })
  })

  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5 mb-3">
      {tags.map(({ label, remove }) => (
        <button
          key={label}
          onClick={remove}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-full text-[11px] text-brand-blue font-medium hover:bg-blue-100 transition-colors"
        >
          {label}
          <X size={10} aria-hidden />
        </button>
      ))}
      <button
        onClick={() => onChange({})}
        className="text-[11px] text-slate-400 hover:text-red-500 transition-colors px-1"
      >
        Clear all
      </button>
    </div>
  )
}

// ─── Main FilterPanel ─────────────────────────────────────────────────────────

export function FilterPanel({
  filters,
  onChange,
  onClose,
  isMobile = false,
  totalCount,
}: FilterPanelProps) {
  const [priceMax, setPriceMax] = useState(filters.maxPrice ?? 50000)

  const toggleCategory = (slug: CategorySlug, checked: boolean) => {
    const current = filters.categories ?? []
    onChange({
      ...filters,
      categories: checked
        ? [...current, slug]
        : current.filter((s) => s !== slug),
    })
  }

  const toggleCondition = (cond: 'new' | 'aftermarket' | 'refurbished', checked: boolean) => {
    const current = filters.conditions ?? []
    onChange({
      ...filters,
      conditions: checked
        ? [...current, cond]
        : current.filter((c) => c !== cond),
    })
  }

  const setMake = (make: string) =>
    onChange({ ...filters, vehicle: { ...filters.vehicle, make: make || undefined } })

  const setYear = (year: string) =>
    onChange({ ...filters, vehicle: { ...filters.vehicle, year: year ? parseInt(year) : undefined } })

  const applyPrice = () =>
    onChange({ ...filters, maxPrice: priceMax })

  const clearAll = () => {
    setPriceMax(50000)
    onChange({})
  }

  const panel = (
    <aside
      className={cn(
        'bg-white',
        isMobile
          ? 'h-full overflow-y-auto flex flex-col'
          : 'w-[220px] flex-shrink-0 border-r border-slate-200 overflow-y-auto'
      )}
      aria-label="Product filters"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-slate-400" aria-hidden />
          <span className="text-xs font-bold text-navy">Filters</span>
          {Object.keys(filters).length > 0 && (
            <span className="w-4 h-4 bg-brand-blue rounded-full text-[9px] font-bold text-white flex items-center justify-center">
              {(filters.categories?.length ?? 0) +
               (filters.conditions?.length ?? 0) +
               (filters.inStockOnly ? 1 : 0) +
               (filters.vehicle?.make ? 1 : 0) +
               (filters.brands?.length ?? 0)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {Object.keys(filters).length > 0 && (
            <button
              onClick={clearAll}
              className="text-[11px] text-brand-blue hover:underline"
            >
              Clear
            </button>
          )}
          {isMobile && (
            <button onClick={onClose} aria-label="Close filters">
              <X size={16} className="text-slate-400" aria-hidden />
            </button>
          )}
        </div>
      </div>

      {/* Filter body */}
      <div className="p-4 flex-1">

        {/* Category */}
        <FilterSection title="Category">
          {CATEGORIES.map((cat) => (
            <FilterOption
              key={cat.id}
              id={`cat-${cat.slug}`}
              label={cat.name}
              count={cat.itemCount}
              checked={filters.categories?.includes(cat.slug) ?? false}
              onChange={(v) => toggleCategory(cat.slug, v)}
            />
          ))}
        </FilterSection>

        {/* Company */}
        <FilterSection title="Company">
          <label htmlFor="filter-brand" className="sr-only">Select company</label>
          <select
            id="filter-brand"
            value={filters.brands?.[0] ?? ''}
            onChange={(e) => onChange({ ...filters, brands: e.target.value ? [e.target.value] : undefined })}
            className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 focus:outline-none focus:border-brand-blue"
          >
            <option value="">All companies</option>
            {PART_SEARCH_COMPANIES.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </FilterSection>

        {/* Vehicle Make */}
        <FilterSection title="Vehicle Make">
          <label htmlFor="filter-make" className="sr-only">Select vehicle make</label>
          <select
            id="filter-make"
            value={filters.vehicle?.make ?? ''}
            onChange={(e) => setMake(e.target.value)}
            className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 focus:outline-none focus:border-brand-blue"
          >
            <option value="">All makes</option>
            {VEHICLE_MAKES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </FilterSection>

        {/* Year */}
        <FilterSection title="Year" defaultOpen={false}>
          <label htmlFor="filter-year" className="sr-only">Select year</label>
          <select
            id="filter-year"
            value={filters.vehicle?.year ?? ''}
            onChange={(e) => setYear(e.target.value)}
            className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 focus:outline-none focus:border-brand-blue"
          >
            <option value="">All years</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range (KES)">
          <div className="space-y-3">
            <input
              type="range"
              min={0}
              max={100000}
              step={500}
              value={priceMax}
              onChange={(e) => setPriceMax(parseInt(e.target.value))}
              onMouseUp={applyPrice}
              onTouchEnd={applyPrice}
              className="w-full accent-brand-blue"
              aria-label="Maximum price"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>KES 0</span>
              <span className="font-semibold text-navy">{formatPrice(priceMax)}</span>
            </div>
          </div>
        </FilterSection>

        {/* Condition */}
        <FilterSection title="Condition">
          {(['new', 'aftermarket', 'refurbished'] as const).map((c) => (
            <FilterOption
              key={c}
              id={`cond-${c}`}
              label={c.charAt(0).toUpperCase() + c.slice(1)}
              checked={filters.conditions?.includes(c) ?? false}
              onChange={(v) => toggleCondition(c, v)}
            />
          ))}
        </FilterSection>

        {/* Availability */}
        <FilterSection title="Availability">
          <FilterOption
            id="avail-instock"
            label="In Stock Only"
            checked={filters.inStockOnly ?? false}
            onChange={(v) => onChange({ ...filters, inStockOnly: v })}
          />
        </FilterSection>

        {/* Rating */}
        <FilterSection title="Min Rating" defaultOpen={false}>
          {[4, 3, 2].map((r) => (
            <FilterOption
              key={r}
              id={`rating-${r}`}
              label={`${'★'.repeat(r)}${'☆'.repeat(5 - r)} & up`}
              checked={filters.rating === r}
              onChange={(v) => onChange({ ...filters, rating: v ? r : undefined })}
            />
          ))}
        </FilterSection>
      </div>

      {/* Mobile footer CTA */}
      {isMobile && (
        <div className="p-4 border-t border-slate-100">
          <Button fullWidth onClick={onClose}>
            Show {totalCount?.toLocaleString() ?? ''} results
          </Button>
        </div>
      )}
    </aside>
  )

  if (isMobile) {
    return (
      <div
        className="fixed inset-0 z-50 flex"
        role="dialog"
        aria-modal="true"
        aria-label="Filter products"
      >
        {/* Backdrop */}
        <button
          className="absolute inset-0 bg-black/40"
          onClick={onClose}
          aria-label="Close filters"
        />
        <div className="relative w-72 max-w-full h-full animate-slide-up">
          {panel}
        </div>
      </div>
    )
  }

  return panel
}
