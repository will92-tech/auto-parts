import { cn } from '@/lib/utils'

type BadgeVariant = 'hot' | 'sale' | 'new' | 'in-stock' | 'low-stock' | 'out-of-stock' | 'default'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  hot:           'bg-red-50 text-red-600',
  sale:          'bg-orange-50 text-orange-500',
  new:           'bg-green-50 text-green-600',
  'in-stock':    'bg-green-50 text-green-600',
  'low-stock':   'bg-orange-50 text-orange-500',
  'out-of-stock':'bg-red-50 text-red-600',
  default:       'bg-slate-100 text-slate-600',
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
