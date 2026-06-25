'use client'

import { useState } from 'react'
import { CheckCircle2, Truck, RefreshCw, Shield } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { StarRating } from '@/components/ui/StarRating'
import { REVIEWS } from '@/lib/data'
import type { Product } from '@/types'

interface ProductTabsProps {
  product: Product
}

type TabId = 'description' | 'specifications' | 'reviews' | 'shipping'

const TABS: { id: TabId; label: string }[] = [
  { id: 'description',    label: 'Description'     },
  { id: 'specifications', label: 'Specifications'  },
  { id: 'reviews',        label: 'Reviews'         },
  { id: 'shipping',       label: 'Shipping & Returns' },
]

// ─── Specification table ──────────────────────────────────────────────────────

function SpecsTable({ specs }: { specs: Record<string, string> }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <tbody>
          {Object.entries(specs).map(([key, val], i) => (
            <tr key={key} className={cn('border-b border-slate-100', i % 2 === 0 ? 'bg-slate-50' : 'bg-white')}>
              <td className="py-2.5 px-3 text-xs font-medium text-slate-600 w-40 align-top">{key}</td>
              <td className="py-2.5 px-3 text-xs text-navy font-semibold">{val}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Reviews tab ─────────────────────────────────────────────────────────────

function ReviewsTab({ product }: { product: Product }) {
  const reviews = REVIEWS  // would be filtered by product.id in a real app

  const ratingBreakdown: Record<number, number> = { 5: 68, 4: 22, 3: 7, 2: 2, 1: 1 }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-start gap-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="text-center">
          <p className="text-4xl font-extrabold text-navy">{product.rating}</p>
          <StarRating rating={product.rating} showCount={false} size="md" className="justify-center my-1" />
          <p className="text-[11px] text-slate-400">{product.reviewCount} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((r) => (
            <div key={r} className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 w-4">{r}</span>
              <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${ratingBreakdown[r] ?? 0}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400 w-6">{ratingBreakdown[r]}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review list */}
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="border border-slate-100 rounded-xl p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${r.avatarColor}`}>
                  {r.authorInitials}
                </div>
                <div>
                  <p className="text-xs font-semibold text-navy">{r.authorName}</p>
                  <p className="text-[10px] text-slate-400">
                    {r.verified && (
                      <span className="text-green-600 inline-flex items-center gap-0.5 mr-1">
                        <CheckCircle2 size={9} aria-hidden /> Verified
                      </span>
                    )}
                    {r.location}
                  </p>
                </div>
              </div>
              <StarRating rating={r.rating} showCount={false} size="sm" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{r.comment}</p>
            <p className="text-[10px] text-slate-400 mt-2">{formatDate(r.date)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Shipping tab ─────────────────────────────────────────────────────────────

function ShippingTab() {
  return (
    <div className="space-y-4">
      {[
        {
          icon: Truck,
          color: 'text-brand-blue bg-blue-50',
          title: 'Delivery Options',
          items: [
            'Standard Delivery (1–3 business days) — KES 350 or FREE over KES 5,000',
            'Express Delivery (Same day, Nairobi) — KES 650',
            'Overnight Courier (All counties) — KES 850',
          ],
        },
        {
          icon: RefreshCw,
          color: 'text-brand-green bg-green-50',
          title: '30-Day Returns',
          items: [
            'Return unused parts in original packaging within 30 days',
            'Free returns for wrong fitment or manufacturer defects',
            'Refund processed within 3–5 business days',
          ],
        },
        {
          icon: Shield,
          color: 'text-brand-orange bg-orange-50',
          title: 'Warranty',
          items: [
            '1-year warranty on all genuine OEM parts',
            '6-month warranty on aftermarket parts',
            'Warranty claims handled directly — no third parties',
          ],
        },
      ].map(({ icon: Icon, color, title, items }) => (
        <div key={title} className="border border-slate-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', color)}>
              <Icon size={15} aria-hidden />
            </div>
            <h3 className="text-sm font-semibold text-navy">{title}</h3>
          </div>
          <ul className="space-y-1.5">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-slate-600">
                <CheckCircle2 size={12} className="text-brand-green flex-shrink-0 mt-0.5" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ProductTabs({ product }: ProductTabsProps) {
  const [active, setActive] = useState<TabId>('description')

  return (
    <div>
      {/* Tab headers */}
      <div className="flex gap-0 border-b border-slate-200 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            aria-selected={active === tab.id}
            role="tab"
            className={cn(
              'flex-shrink-0 px-4 py-2.5 text-xs font-medium border-b-2 -mb-px transition-colors',
              active === tab.id
                ? 'text-brand-blue border-brand-blue'
                : 'text-slate-500 border-transparent hover:text-navy'
            )}
          >
            {tab.label}
            {tab.id === 'reviews' && (
              <span className="ml-1.5 text-[10px] text-slate-400">({product.reviewCount})</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="pt-4" role="tabpanel">
        {active === 'description' && (
          <div className="prose prose-sm max-w-none">
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description ?? 'No description available for this product.'}
            </p>
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 bg-slate-100 rounded-full text-[11px] text-slate-600">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {active === 'specifications' && product.specifications && (
          <SpecsTable specs={product.specifications} />
        )}

        {active === 'reviews' && <ReviewsTab product={product} />}

        {active === 'shipping' && <ShippingTab />}
      </div>
    </div>
  )
}
