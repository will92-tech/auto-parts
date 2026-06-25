'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import type { Size, Variant } from '@/types'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-6 text-sm gap-2',
}

const variantClasses: Record<Variant, string> = {
  primary: [
    'bg-brand-blue text-white border border-brand-blue',
    'hover:bg-blue-700 hover:border-blue-700',
    'active:scale-[0.98]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),

  outline: [
    'bg-transparent text-brand-blue border border-brand-blue',
    'hover:bg-brand-blue hover:text-white',
    'active:scale-[0.98]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),

  ghost: [
    'bg-transparent text-navy-600 border border-navy-200',
    'hover:bg-navy-100',
    'active:scale-[0.98]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),

  orange: [
    'bg-brand-orange text-white border border-brand-orange',
    'hover:bg-orange-600 hover:border-orange-600',
    'active:scale-[0.98]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      iconLeft,
      iconRight,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Base
          'inline-flex items-center justify-center font-medium rounded-lg',
          'transition-all duration-150 cursor-pointer select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2',
          // Size
          sizeClasses[size],
          // Variant
          variantClasses[variant],
          // Full width
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Loading…
          </span>
        ) : (
          <>
            {iconLeft && <span className="flex-shrink-0">{iconLeft}</span>}
            {children}
            {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
export type { ButtonProps }
