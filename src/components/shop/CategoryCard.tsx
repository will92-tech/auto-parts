'use client'

import Link from 'next/link'
import {
  Wrench, Cog, Settings, Car, Volume2, CircuitBoard,
  Zap, Package, ArrowRight,
} from 'lucide-react'
import { cn, categoryUrl } from '@/lib/utils'
import type { Category } from '@/types'

// ─── Icon Registry ────────────────────────────────────────────────────────────
// Maps the string icon name stored in data to actual Lucide components

const ICON_MAP: Record<string, React.ElementType> = {
  Wrench,
  Cog,
  Settings,
  Car,
  Volume2,
  CircuitBoard,
  Zap,
  Package,
}

function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name] ?? Package
  return <Icon className={className} aria-hidden="true" />
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface CategoryCardProps {
  category: Category
  /**
   * 'default' — standard grid card with icon + name + count
   * 'featured' — larger card with prominent icon, used in hero grids
   * 'pill'     — compact horizontal pill for filter chips or sidebars
   */
  variant?: 'default' | 'featured' | 'pill'
  className?: string
  /** Override the href (defaults to /shop?category=slug) */
  href?: string
  /** Show the item count badge */
  showCount?: boolean
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function CategoryCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'featured' }) {
  if (variant === 'featured') {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse flex flex-col items-center gap-3">
        <div className="w-12 h-12 bg-slate-100 rounded-xl" />
        <div className="h-4 bg-slate-100 rounded w-24" />
        <div className="h-3 bg-slate-100 rounded w-16" />
      </div>
    )
  }
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-slate-100 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3.5 bg-slate-100 rounded w-3/4" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CategoryCard({
  category,
  variant = 'default',
  className,
  href,
  showCount = true,
}: CategoryCardProps) {
  const destination = href ?? categoryUrl(category.slug)

  // ────────────────────────────────────────────────────────────────────────────
  // PILL VARIANT — horizontal chip used in filter sidebars
  // ────────────────────────────────────────────────────────────────────────────

  if (variant === 'pill') {
    return (
      <Link
        href={destination}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white',
          'text-xs font-medium text-slate-600',
          'hover:border-brand-blue hover:text-brand-blue hover:bg-blue-50',
          'transition-all duration-150 whitespace-nowrap',
          className
        )}
      >
        <div className={cn('w-5 h-5 rounded-md flex items-center justify-center', category.color)}>
          <CategoryIcon name={category.icon} className={cn('w-3 h-3', category.iconColor)} />
        </div>
        {category.name}
        {showCount && (
          <span className="text-slate-400">({category.itemCount.toLocaleString()})</span>
        )}
      </Link>
    )
  }

  // ────────────────────────────────────────────────────────────────────────────
  // FEATURED VARIANT — centered layout, larger icon, used in hero sections
  // ────────────────────────────────────────────────────────────────────────────

  if (variant === 'featured') {
    return (
      <Link
        href={destination}
        className={cn(
          'bg-white border border-slate-200 rounded-xl p-5',
          'flex flex-col items-center text-center gap-2',
          'hover:border-brand-blue hover:shadow-hover hover:-translate-y-1',
          'transition-all duration-200 group cursor-pointer',
          className
        )}
      >
        {/* Icon container */}
        <div
          className={cn(
            'w-14 h-14 rounded-2xl flex items-center justify-center',
            'group-hover:scale-110 transition-transform duration-200',
            category.color
          )}
        >
          <CategoryIcon
            name={category.icon}
            className={cn('w-7 h-7', category.iconColor)}
          />
        </div>

        {/* Name */}
        <h3 className="text-sm font-semibold text-navy group-hover:text-brand-blue transition-colors">
          {category.name}
        </h3>

        {/* Count */}
        {showCount && (
          <p className="text-[11px] text-slate-400">
            {category.itemCount.toLocaleString()} parts
          </p>
        )}

        {/* Arrow */}
        <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight size={14} className="text-brand-blue" aria-hidden />
        </div>
      </Link>
    )
  }

  // ────────────────────────────────────────────────────────────────────────────
  // DEFAULT VARIANT — standard grid card with left-aligned icon
  // ────────────────────────────────────────────────────────────────────────────

  return (
    <Link
      href={destination}
      className={cn(
        'bg-white border border-slate-200 rounded-xl p-4 relative overflow-hidden',
        'hover:border-brand-blue hover:shadow-hover hover:-translate-y-0.5',
        'transition-all duration-200 group cursor-pointer block',
        className
      )}
      aria-label={`Browse ${category.name} — ${category.itemCount.toLocaleString()} parts`}
    >
      {/* Decorative background circle (subtle) */}
      <div
        className={cn(
          'absolute -right-4 -bottom-4 w-20 h-20 rounded-full opacity-30',
          'group-hover:opacity-50 transition-opacity',
          category.color
        )}
        aria-hidden
      />

      {/* Icon */}
      <div
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center mb-3',
          'group-hover:scale-110 transition-transform duration-200',
          category.color
        )}
      >
        <CategoryIcon name={category.icon} className={cn('w-5 h-5', category.iconColor)} />
      </div>

      {/* Name */}
      <h3 className="text-[13px] font-semibold text-navy leading-tight group-hover:text-brand-blue transition-colors">
        {category.name}
      </h3>

      {/* Count */}
      {showCount && (
        <p className="text-[11px] text-slate-400 mt-0.5">
          {category.itemCount.toLocaleString()} items
        </p>
      )}

      {/* Arrow badge — top-right, reveals on hover */}
      <div
        className={cn(
          'absolute top-3 right-3 w-6 h-6 bg-brand-blue rounded-lg',
          'flex items-center justify-center',
          'opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0',
          'transition-all duration-200'
        )}
        aria-hidden
      >
        <ArrowRight size={12} className="text-white" />
      </div>
    </Link>
  )
}

// ─── Category Grid ─────────────────────────────────────────────────────────────
// Convenience wrapper that renders a responsive grid of CategoryCards

interface CategoryGridProps {
  categories: Category[]
  variant?: CategoryCardProps['variant']
  columns?: 2 | 3 | 4 | 6
  showCount?: boolean
  className?: string
  loading?: boolean
}

const colClasses: Record<NonNullable<CategoryGridProps['columns']>, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
}

export function CategoryGrid({
  categories,
  variant = 'default',
  columns = 3,
  showCount = true,
  className,
  loading = false,
}: CategoryGridProps) {
  return (
    <div className={cn('grid gap-2.5', colClasses[columns], className)}>
      {loading
        ? Array.from({ length: columns * 2 }).map((_, i) => (
            <CategoryCardSkeleton key={i} variant={variant === 'featured' ? 'featured' : 'default'} />
          ))
        : categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              variant={variant}
              showCount={showCount}
            />
          ))}
    </div>
  )
}
