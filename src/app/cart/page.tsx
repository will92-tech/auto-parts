'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Trash2, ShoppingBag, ArrowRight, Tag, Truck, Shield, RefreshCw } from 'lucide-react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { useCartStore, selectCartSubtotal, selectCartTotal } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'

const EMOJI_MAP: Record<string, string> = {
  'service-parts': '🔧', 'engine-parts': '⚙️', 'transmission': '⚙️',
  'body-parts': '🚗', 'sound-systems': '🔊', 'efc-components': '💡',
}

export default function CartPage() {
  const items       = useCartStore((s) => s.items)
  const removeItem  = useCartStore((s) => s.removeItem)
  const updateQty   = useCartStore((s) => s.updateQty)
  const applyCoupon = useCartStore((s) => s.applyCoupon)
  const couponCode  = useCartStore((s) => s.couponCode)
  const discount    = useCartStore((s) => s.discount)
  const subtotal    = useCartStore(selectCartSubtotal)
  const total       = useCartStore(selectCartTotal)

  const [couponInput,  setCouponInput]  = useState('')
  const [couponStatus, setCouponStatus] = useState<'idle' | 'ok' | 'bad'>('idle')
  const [imgErrors,    setImgErrors]    = useState<Set<string>>(new Set())

  const FREE_THRESHOLD  = 5000
  const shippingFee     = subtotal >= FREE_THRESHOLD ? 0 : 350
  const discountAmount  = Math.round(subtotal * discount)

  const handleApplyCoupon = () => {
    const known = ['SAVE10', 'SAVE20', 'WELCOME']
    if (known.includes(couponInput.toUpperCase())) {
      applyCoupon(couponInput)
      setCouponStatus('ok')
    } else {
      setCouponStatus('bad')
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-4xl">🛒</div>
        <h1 className="text-xl font-bold text-navy mb-2">Your cart is empty</h1>
        <p className="text-sm text-slate-400 mb-6">Add some genuine parts to get started.</p>
        <Link href="/shop"><Button variant="primary" iconRight={<ArrowRight size={15} />}>Browse Parts</Button></Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb items={[{ label: 'Cart' }]} />
          <h1 className="text-lg font-bold text-navy mt-1">Shopping Cart <span className="text-sm font-normal text-slate-400 ml-2">({items.length} items)</span></h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-4">
              <div className="w-20 h-20 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden border border-slate-100">
                {product.thumbnail && !imgErrors.has(product.id)
                  ? <Image src={product.thumbnail} alt={product.name} fill className="object-contain p-1.5" sizes="80px" onError={() => setImgErrors((s) => new Set([...s, product.id]))} />
                  : <span className="text-3xl">{EMOJI_MAP[product.category.slug] ?? '📦'}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{product.brand}</p>
                <Link href={`/shop/product/${product.slug}`} className="text-sm font-semibold text-navy hover:text-brand-blue transition-colors line-clamp-2">{product.name}</Link>
                <p className="text-[11px] text-slate-400 mt-0.5">SKU: {product.sku}</p>
                <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                    <button onClick={() => updateQty(product.id, quantity - 1)} aria-label="Decrease" className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors text-sm">−</button>
                    <span className="w-8 text-center text-sm font-semibold text-navy">{quantity}</span>
                    <button onClick={() => updateQty(product.id, quantity + 1)} disabled={quantity >= product.stockCount} aria-label="Increase" className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors text-sm">+</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-navy">{formatPrice(product.price * quantity)}</span>
                    <button onClick={() => removeItem(product.id)} aria-label={`Remove ${product.name}`} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={15} aria-hidden /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs text-brand-blue hover:underline mt-1">
            <ShoppingBag size={13} aria-hidden /> Continue shopping
          </Link>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-bold text-navy mb-3 flex items-center gap-1.5"><Tag size={13} className="text-brand-orange" aria-hidden /> Coupon Code</p>
            <div className="flex gap-2">
              <input value={couponInput} onChange={(e) => { setCouponInput(e.target.value); setCouponStatus('idle') }} placeholder="e.g. SAVE10" aria-label="Coupon code" className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-blue" />
              <Button variant="outline" size="sm" onClick={handleApplyCoupon}>Apply</Button>
            </div>
            {couponStatus === 'ok' && <p className="text-[11px] text-green-600 mt-1.5 font-medium">✓ Coupon applied — {discount * 100}% off!</p>}
            {couponStatus === 'bad' && <p className="text-[11px] text-red-500 mt-1.5">✗ Invalid coupon code.</p>}
            {couponStatus === 'idle' && !couponCode && <p className="text-[10px] text-slate-400 mt-1.5">Try: SAVE10 · SAVE20 · WELCOME</p>}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-sm font-bold text-navy mb-4">Order Summary</p>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600"><span>Subtotal</span><span className="font-medium text-navy">{formatPrice(subtotal)}</span></div>
              {discountAmount > 0 && <div className="flex justify-between text-red-600"><span>Discount</span><span>− {formatPrice(discountAmount)}</span></div>}
              <div className="flex justify-between text-slate-600"><span>Shipping</span>{shippingFee === 0 ? <span className="text-green-600 font-medium">Free</span> : <span className="font-medium text-navy">{formatPrice(shippingFee)}</span>}</div>
            </div>
            {subtotal < FREE_THRESHOLD && (
              <div className="mt-3 p-2.5 bg-blue-50 rounded-lg">
                <p className="text-[11px] text-brand-blue font-medium mb-1.5">Add {formatPrice(FREE_THRESHOLD - subtotal)} more for free shipping</p>
                <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden"><div className="h-full bg-brand-blue rounded-full transition-all" style={{ width: `${Math.min(100, (subtotal / FREE_THRESHOLD) * 100)}%` }} /></div>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-navy border-t border-slate-100 mt-3 pt-3"><span>Total</span><span className="text-base">{formatPrice(total + shippingFee)}</span></div>
            <Link href="/checkout"><Button variant="primary" size="lg" fullWidth className="mt-4" iconRight={<ArrowRight size={15} />}>Proceed to Checkout</Button></Link>
            <div className="flex items-center justify-center gap-4 mt-3">
              {[{ icon: Shield, text: 'Secure SSL' }, { icon: Truck, text: 'Fast Delivery' }, { icon: RefreshCw, text: 'Easy Returns' }].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1 text-[10px] text-slate-400"><Icon size={11} aria-hidden /> {text}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
