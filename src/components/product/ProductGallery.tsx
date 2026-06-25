'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// Emoji fallbacks per category slug
const EMOJI_MAP: Record<string, string> = {
  'service-parts':  '🔧',
  'engine-parts':   '⚙️',
  'transmission':   '⚙️',
  'body-parts':     '🚗',
  'sound-systems':  '🔊',
  'efc-components': '💡',
  'electrical':     '⚡',
  'suspension':     '🔩',
  'brakes':         '🛞',
}

interface ProductGalleryProps {
  images: string[]
  productName: string
  categorySlug: string
}

export function ProductGallery({ images, productName, categorySlug }: ProductGalleryProps) {
  const [active, setActive] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set())

  const emoji = EMOJI_MAP[categorySlug] ?? '📦'
  const hasImages = images.length > 0

  const prev = () => setActive((i) => (i === 0 ? images.length - 1 : i - 1))
  const next = () => setActive((i) => (i === images.length - 1 ? 0 : i + 1))

  const markError = (i: number) =>
    setImgErrors((s) => new Set([...s, i]))

  return (
    <div className="space-y-3">
      {/* ── Main image ─────────────────────────────────────────────── */}
      <div
        className="relative bg-slate-50 rounded-xl border border-slate-200 overflow-hidden"
        style={{ aspectRatio: '4/3' }}
      >
        {hasImages && !imgErrors.has(active) ? (
          <Image
            src={images[active]}
            alt={`${productName} — image ${active + 1}`}
            fill
            className={cn(
              'object-contain p-6 transition-transform duration-300',
              zoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
            )}
            onClick={() => setZoomed((z) => !z)}
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={() => markError(active)}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-2">
            <span className="text-7xl" role="img" aria-label={productName}>{emoji}</span>
            <p className="text-xs text-slate-400">Product image</p>
          </div>
        )}

        {/* Prev/next arrows (only if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm hover:border-brand-blue transition-colors"
            >
              <ChevronLeft size={14} aria-hidden />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm hover:border-brand-blue transition-colors"
            >
              <ChevronRight size={14} aria-hidden />
            </button>
          </>
        )}

        {/* Zoom hint */}
        <button
          onClick={() => setZoomed((z) => !z)}
          aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
          className="absolute bottom-2 right-2 w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:border-brand-blue transition-colors"
        >
          <ZoomIn size={13} className="text-slate-500" aria-hidden />
        </button>

        {/* Counter badge */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-2 bg-black/40 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
            {active + 1} / {images.length}
          </div>
        )}
      </div>

      {/* ── Thumbnails ─────────────────────────────────────────────── */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === active}
              className={cn(
                'flex-shrink-0 w-14 h-14 rounded-lg border-2 overflow-hidden bg-slate-50 transition-all',
                i === active
                  ? 'border-brand-blue shadow-sm'
                  : 'border-transparent hover:border-slate-300'
              )}
            >
              {!imgErrors.has(i) ? (
                <div className="relative w-full h-full">
                  <Image
                    src={src}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    className="object-contain p-1"
                    sizes="56px"
                    onError={() => markError(i)}
                  />
                </div>
              ) : (
                <span className="w-full h-full flex items-center justify-center text-xl">
                  {emoji}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
