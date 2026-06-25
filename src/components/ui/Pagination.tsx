'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null

  // Build visible page numbers with ellipsis
  const getPages = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (page <= 4) return [1, 2, 3, 4, 5, '...', totalPages]
    if (page >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, '...', page - 1, page, page + 1, '...', totalPages]
  }

  return (
    <nav
      className={cn('flex items-center justify-center gap-1', className)}
      aria-label="Pagination"
    >
      {/* Prev */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-brand-blue hover:text-brand-blue disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={14} aria-hidden />
      </button>

      {/* Pages */}
      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="w-8 text-center text-slate-400 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              'w-8 h-8 rounded-lg text-xs font-medium transition-colors',
              p === page
                ? 'bg-brand-blue text-white border border-brand-blue'
                : 'border border-slate-200 text-slate-600 hover:border-brand-blue hover:text-brand-blue'
            )}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-brand-blue hover:text-brand-blue disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={14} aria-hidden />
      </button>
    </nav>
  )
}
