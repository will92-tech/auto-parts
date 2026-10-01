import Link from 'next/link'

export default function TradePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">Trade & fleet</p>
          <h1 className="mt-2 text-3xl font-bold text-navy">Commercial pricing, parts access, and support</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ['Wholesale pricing', 'Flexible pricing for garages, fleet operators, and bulk buyers.'],
            ['Fast dispatch', 'Priority warehouse handling for repeat business orders.'],
            ['Dedicated account support', 'Work with a specialist to manage your vehicle and parts requirements.'],
          ].map(([title, description]) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-navy">{title}</h2>
              <p className="mt-2 text-sm text-slate-600">{description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-navy p-8 text-white">
          <h2 className="text-2xl font-bold">Ready to order in bulk?</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-200">
            Connect with our trade desk for commercial pricing, workshop support, and investment in vehicle fleet parts.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="tel:+254700123456" className="inline-flex rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white">
              Call trade desk
            </a>
            <Link href="/shop" className="inline-flex rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white">
              Browse parts
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
