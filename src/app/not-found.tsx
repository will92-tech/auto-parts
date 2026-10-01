'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-50 text-3xl">🚗</div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">404</p>
        <h1 className="mt-3 text-3xl font-bold text-navy">Page not found</h1>
        <p className="mt-3 text-sm text-slate-500">
          The page you requested is not available yet. Browse our shop to continue exploring parts.
        </p>
        <div className="mt-6">
          <Link href="/">
            <Button variant="primary">Go home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
