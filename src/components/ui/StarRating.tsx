import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number          // 0–5, supports decimals
  reviewCount?: number
  size?: 'sm' | 'md'
  showCount?: boolean
  className?: string
}

export function StarRating({
  rating,
  reviewCount,
  size = 'sm',
  showCount = true,
  className,
}: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(rating)
    const half   = !filled && i < rating
    return { filled, half, index: i }
  })

  const starSize = size === 'sm' ? 'text-xs' : 'text-sm'

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <span className={cn('text-yellow-400', starSize)} aria-hidden="true">
        {stars.map(({ filled, half, index }) =>
          filled ? '★' : half ? '½' : '☆'
        ).join('')}
      </span>
      <span className="sr-only">{rating} out of 5 stars</span>
      {showCount && reviewCount !== undefined && (
        <span className={cn('text-slate-400', size === 'sm' ? 'text-[11px]' : 'text-xs')}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  )
}
