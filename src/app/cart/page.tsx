'use client'

import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore, selectCartSubtotal, selectCartTotal } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const items = useCartStore(s => s.items)
  const updateQty = useCartStore(s => s.updateQty)
  const removeItem = useCartStore(s => s.removeItem)
  const subtotal = useCartStore(selectCartSubtotal)
  const total = useCartStore(selectCartTotal)
  return <section className="max-w-5xl mx-auto px-4 py-8"><h1 className="text-3xl font-display font-bold text-navy">Your cart</h1>{items.length === 0 ? <div className="mt-8 rounded-2xl bg-white border border-slate-200 p-10 text-center"><p className="text-slate-500">Your cart is empty.</p><Link href="/shop" className="inline-block mt-4 rounded-lg bg-brand-blue text-white px-5 py-2.5 text-sm font-semibold">Browse parts</Link></div> : <div className="grid lg:grid-cols-[1fr_320px] gap-5 mt-6"><div className="space-y-3">{items.map(item => <article key={item.product.id} className="flex gap-4 items-center bg-white border border-slate-200 rounded-xl p-4"><div className="w-20 h-20 bg-slate-50 rounded-lg flex items-center justify-center"><img src={item.product.thumbnail} alt="" className="max-h-16 max-w-full object-contain" /></div><div className="flex-1"><h2 className="font-semibold text-sm text-navy">{item.product.name}</h2><p className="text-xs text-slate-400">{formatPrice(item.product.price)}</p><div className="flex items-center gap-2 mt-3"><button aria-label="Decrease quantity" onClick={() => updateQty(item.product.id, item.quantity - 1)} className="w-7 h-7 border rounded"><Minus size={13} className="mx-auto" /></button><span className="text-sm w-5 text-center">{item.quantity}</span><button aria-label="Increase quantity" onClick={() => updateQty(item.product.id, item.quantity + 1)} className="w-7 h-7 border rounded"><Plus size={13} className="mx-auto" /></button></div></div><button aria-label={`Remove ${item.product.name}`} onClick={() => removeItem(item.product.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={17} /></button></article>)}</div><aside className="bg-white border border-slate-200 rounded-xl p-5 h-fit"><h2 className="font-semibold text-navy">Order summary</h2><div className="flex justify-between text-sm text-slate-500 mt-5"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><div className="flex justify-between font-bold text-navy mt-3"><span>Total</span><span>{formatPrice(total)}</span></div><Link href="/checkout" className="block text-center mt-5 rounded-lg bg-brand-orange text-white px-4 py-3 text-sm font-semibold">Continue to checkout</Link></aside></div>}</section>
}
