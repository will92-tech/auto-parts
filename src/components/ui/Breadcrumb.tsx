import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center flex-wrap gap-1', className)}
    >
      <ol className="flex items-center flex-wrap gap-1 list-none">
        {/* Home always first */}
        <li>
          <Link
            href="/"
            className="text-slate-400 hover:text-brand-blue transition-colors"
            aria-label="Home"
          >
            <Home size={12} aria-hidden />
          </Link>
        </li>

        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={item.label} className="flex items-center gap-1">
              <ChevronRight size={11} className="text-slate-300" aria-hidden />
              {isLast || !item.href ? (
                <span
                  className={cn(
                    'text-[11px]',
                    isLast ? 'text-navy font-medium' : 'text-slate-500'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-[11px] text-slate-500 hover:text-brand-blue transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
