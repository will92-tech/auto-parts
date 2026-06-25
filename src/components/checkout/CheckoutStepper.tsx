import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type CheckoutStep = 'information' | 'shipping' | 'payment' | 'confirmation'

const STEPS: { id: CheckoutStep; label: string; short: string }[] = [
  { id: 'information',  label: 'Information',  short: '1' },
  { id: 'shipping',     label: 'Shipping',     short: '2' },
  { id: 'payment',      label: 'Payment',      short: '3' },
  { id: 'confirmation', label: 'Confirmation', short: '4' },
]

interface StepperProps {
  current: CheckoutStep
}

export function CheckoutStepper({ current }: StepperProps) {
  const currentIdx = STEPS.findIndex((s) => s.id === current)

  return (
    <nav aria-label="Checkout steps" className="flex items-center justify-center gap-0 py-5">
      {STEPS.map((step, i) => {
        const isDone    = i < currentIdx
        const isActive  = i === currentIdx
        const isPending = i > currentIdx

        return (
          <div key={step.id} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all',
                  isDone   && 'bg-brand-green text-white',
                  isActive && 'bg-brand-blue text-white ring-4 ring-blue-100',
                  isPending && 'bg-slate-200 text-slate-400'
                )}
                aria-current={isActive ? 'step' : undefined}
              >
                {isDone
                  ? <CheckCircle2 size={16} aria-hidden />
                  : step.short
                }
              </div>
              <span className={cn(
                'text-[10px] font-medium whitespace-nowrap',
                isActive  ? 'text-brand-blue font-semibold' : '',
                isDone    ? 'text-brand-green' : '',
                isPending ? 'text-slate-400' : '',
              )}>
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div className={cn(
                'w-10 sm:w-16 h-0.5 mx-1 mb-5 transition-colors',
                i < currentIdx ? 'bg-brand-green' : 'bg-slate-200'
              )} aria-hidden />
            )}
          </div>
        )
      })}
    </nav>
  )
}
