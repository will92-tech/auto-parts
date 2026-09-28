'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore, selectCartTotal } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'

export default function CheckoutPage() {
  const router = useRouter(); const items = useCartStore(s => s.items); const total = useCartStore(selectCartTotal); const clearCart = useCartStore(s => s.clearCart)
  const [paymentMethod, setPaymentMethod] = useState('mpesa'); const [address, setAddress] = useState(''); const [message, setMessage] = useState('')
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setMessage('Order details captured. Connect authentication and payment to submit this order.'); }
  if (!items.length) return <section className="max-w-3xl mx-auto px-4 py-16 text-center"><h1 className="text-2xl font-bold text-navy">Your cart is empty</h1><button onClick={() => router.push('/shop')} className="mt-4 rounded-lg bg-brand-blue text-white px-5 py-2.5 text-sm">Browse parts</button></section>
  return <section className="max-w-3xl mx-auto px-4 py-8"><h1 className="text-3xl font-display font-bold text-navy">Checkout</h1><form onSubmit={submit} className="mt-6 bg-white border border-slate-200 rounded-2xl p-5 space-y-5"><label className="block text-sm font-medium text-navy">Delivery address<textarea required value={address} onChange={e => setAddress(e.target.value)} rows={4} className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-sm" placeholder="Street, estate, town, county" /></label><fieldset><legend className="text-sm font-medium text-navy">Payment method</legend><div className="flex gap-3 mt-2">{['mpesa', 'card', 'cash'].map(method => <label key={method} className="flex items-center gap-2 text-sm capitalize"><input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={e => setPaymentMethod(e.target.value)} />{method}</label>)}</div></fieldset><div className="flex justify-between border-t pt-4 font-bold text-navy"><span>Total</span><span>{formatPrice(total)}</span></div>{message && <p className="rounded-lg bg-blue-50 text-brand-blue p-3 text-sm">{message}</p>}<button type="submit" className="w-full rounded-lg bg-brand-orange text-white py-3 text-sm font-semibold">Place order</button></form></section>
}
