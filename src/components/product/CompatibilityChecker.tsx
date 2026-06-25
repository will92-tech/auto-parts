'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { VEHICLE_MAKES, VEHICLE_MODELS, YEARS } from '@/lib/data'
import type { CompatibleVehicle } from '@/types'

interface CompatibilityCheckerProps {
  compatibleVehicles?: CompatibleVehicle[]
}

export function CompatibilityChecker({ compatibleVehicles = [] }: CompatibilityCheckerProps) {
  const [make,   setMake]   = useState('')
  const [model,  setModel]  = useState('')
  const [year,   setYear]   = useState('')
  const [result, setResult] = useState<'compatible' | 'incompatible' | null>(null)

  const models = make ? (VEHICLE_MODELS[make] ?? []) : []

  const check = () => {
    if (!make || !model || !year) return
    const y = parseInt(year)
    const ok = compatibleVehicles.some(
      (v) =>
        v.make.toLowerCase() === make.toLowerCase() &&
        v.model.toLowerCase() === model.toLowerCase() &&
        y >= v.yearFrom &&
        y <= v.yearTo
    )
    setResult(ok ? 'compatible' : 'incompatible')
  }

  const reset = () => {
    setMake('')
    setModel('')
    setYear('')
    setResult(null)
  }

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
        <CheckCircle2 size={15} className="text-brand-green flex-shrink-0" aria-hidden />
        <span className="text-xs font-bold text-navy uppercase tracking-wide">
          Vehicle Compatibility Checker
        </span>
      </div>

      <div className="p-4 space-y-3">
        {/* Pre-confirmed vehicles list */}
        {compatibleVehicles.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Confirmed compatible with:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {compatibleVehicles.map((v, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full text-[11px] text-green-700 font-medium"
                >
                  <CheckCircle2 size={10} aria-hidden />
                  {v.make} {v.model} {v.yearFrom}–{v.yearTo}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Check your vehicle */}
        <div className="pt-1 border-t border-slate-100">
          <p className="text-[11px] font-medium text-slate-600 mb-2">Check your specific vehicle:</p>
          <div className="grid grid-cols-3 gap-2">
            {/* Make */}
            <div>
              <label htmlFor="compat-make" className="sr-only">Vehicle make</label>
              <div className="relative">
                <select
                  id="compat-make"
                  value={make}
                  onChange={(e) => { setMake(e.target.value); setModel(''); setResult(null) }}
                  className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 focus:outline-none focus:border-brand-blue appearance-none"
                >
                  <option value="">Make</option>
                  {VEHICLE_MAKES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Model */}
            <div>
              <label htmlFor="compat-model" className="sr-only">Vehicle model</label>
              <select
                id="compat-model"
                value={model}
                onChange={(e) => { setModel(e.target.value); setResult(null) }}
                disabled={!make}
                className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 focus:outline-none focus:border-brand-blue disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Model</option>
                {models.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label htmlFor="compat-year" className="sr-only">Year</label>
              <select
                id="compat-year"
                value={year}
                onChange={(e) => { setYear(e.target.value); setResult(null) }}
                className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 focus:outline-none focus:border-brand-blue"
              >
                <option value="">Year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={check}
            disabled={!make || !model || !year}
            className="mt-2.5 w-full py-2 bg-navy text-white text-xs font-semibold rounded-lg hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Check Compatibility
          </button>
        </div>

        {/* Result */}
        {result && (
          <div
            className={cn(
              'flex items-start gap-2.5 p-3 rounded-lg border',
              result === 'compatible'
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            )}
            role="alert"
          >
            {result === 'compatible' ? (
              <CheckCircle2 size={16} className="text-green-600 flex-shrink-0 mt-0.5" aria-hidden />
            ) : (
              <XCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" aria-hidden />
            )}
            <div>
              <p className={cn(
                'text-xs font-semibold',
                result === 'compatible' ? 'text-green-700' : 'text-red-600'
              )}>
                {result === 'compatible'
                  ? `✓ Compatible with your ${year} ${make} ${model}`
                  : `✗ Not confirmed for ${year} ${make} ${model}`}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {result === 'compatible'
                  ? 'This part is confirmed to fit your vehicle.'
                  : 'This part may not fit. Contact our team to verify before ordering.'}
              </p>
              <button onClick={reset} className="text-[11px] text-brand-blue hover:underline mt-1">
                Check another vehicle
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
