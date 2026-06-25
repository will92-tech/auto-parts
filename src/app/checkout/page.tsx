'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Lock, ChevronLeft, ChevronRight, Truck, CreditCard, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCartStore, selectCartSubtotal, selectCartTotal } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'

type Step = 1 | 2 | 3 | 4

interface FormData {
  firstName: string; lastName: string; email: string; phone: string
  county: string; town: string; address: string; notes: string
  paymentMethod: 'mpesa' | 'card' | 'pod'
  mpesaPhone: string; cardNumber: string; cardExpiry: string; cardCvv: string; cardName: string
}

const COUNTIES = ['Nairobi','Mombasa','Kisumu','Nakuru','Kiambu','Machakos','Kajiado','Uasin Gishu']
const STEPS = [{ num:1,label:'Information' },{ num:2,label:'Shipping' },{ num:3,label:'Payment' },{ num:4,label:'Confirm' }]

function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
              step.num < current ? 'bg-brand-green text-white' :
              step.num === current ? 'bg-brand-blue text-white ring-4 ring-blue-100' :
              'bg-slate-200 text-slate-400')}>
              {step.num < current ? <CheckCircle2 size={16} /> : step.num}
            </div>
            <span className={cn('text-[10px] mt-1 font-medium whitespace-nowrap',
              step.num === current ? 'text-brand-blue' : step.num < current ? 'text-green-600' : 'text-slate-400')}>
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={cn('w-12 sm:w-20 h-0.5 mb-4 mx-1 transition-colors', step.num < current ? 'bg-brand-green' : 'bg-slate-200')} />
          )}
        </div>
      ))}
    </div>
  )
}

function Field({ label,id,type='text',placeholder,value,onChange,required,className }: { label:string;id:string;type?:string;placeholder?:string;value:string;onChange:(v:string)=>void;required?:boolean;className?:string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-xs font-medium text-slate-600 mb-1.5">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <input id={id} type={type} value={value} placeholder={placeholder} required={required} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-blue transition-colors" />
    </div>
  )
}

function SelectField({ label,id,value,onChange,options,required,className }: { label:string;id:string;value:string;onChange:(v:string)=>void;options:string[];required?:boolean;className?:string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-xs font-medium text-slate-600 mb-1.5">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <select id={id} value={value} required={required} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-blue transition-colors">
        <option value="">Select {label}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormData>({
    firstName:'',lastName:'',email:'',phone:'',county:'',town:'',address:'',notes:'',
    paymentMethod:'mpesa',mpesaPhone:'',cardNumber:'',cardExpiry:'',cardCvv:'',cardName:'',
  })

  const items     = useCartStore((s) => s.items)
  const subtotal  = useCartStore(selectCartSubtotal)
  const total     = useCartStore(selectCartTotal)
  const clearCart = useCartStore((s) => s.clearCart)
  const update    = (key: keyof FormData) => (val: string) => setForm((f) => ({ ...f, [key]: val }))
  const shipping  = subtotal >= 5000 ? 0 : 350
  const orderTotal = total + shipping

  const OrderSummary = () => (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sticky top-20">
      <p className="text-xs font-bold text-navy mb-3">Order Summary</p>
      <div className="space-y-2 mb-3">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-5 h-5 flex-shrink-0 bg-slate-100 rounded text-[10px] flex items-center justify-center font-bold text-slate-500">{quantity}</span>
              <span className="text-xs text-slate-600 truncate">{product.name}</span>
            </div>
            <span className="text-xs font-medium text-navy flex-shrink-0">{formatPrice(product.price * quantity)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs">
        <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
        <div className="flex justify-between text-slate-500"><span>Shipping</span><span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
        <div className="flex justify-between font-bold text-navy text-sm pt-1 border-t border-slate-100"><span>Total</span><span>{formatPrice(orderTotal)}</span></div>
      </div>
    </div>
  )

  if (step === 4) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-brand-green" />
          </div>
          <h1 className="text-2xl font-bold text-navy mb-2">Order Confirmed!</h1>
          <p className="text-sm text-slate-500 mb-1">Order <strong className="text-navy">#ORD-{Date.now().toString().slice(-6)}</strong></p>
          <p className="text-sm text-slate-500 mb-6">Confirmation sent to <strong className="text-navy">{form.email || 'your email'}</strong>.</p>
          <div className="bg-white border border-slate-200 rounded-xl p-5 text-left mb-6 space-y-3">
            <div className="flex items-start gap-3">
              <Truck size={16} className="text-brand-blue flex-shrink-0 mt-0.5" />
              <div><p className="text-xs font-semibold text-navy">Delivery to {form.county || 'your address'}</p><p className="text-xs text-slate-500">Estimated: 1–3 business days</p></div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={16} className="text-brand-green flex-shrink-0 mt-0.5" />
              <div><p className="text-xs font-semibold text-navy">{form.paymentMethod === 'mpesa' ? 'M-Pesa' : form.paymentMethod === 'card' ? 'Card' : 'Pay on Delivery'}</p><p className="text-xs text-slate-500">{form.paymentMethod === 'mpesa' ? `STK Push sent to ${form.mpesaPhone || form.phone}` : form.paymentMethod === 'pod' ? 'Pay when your order arrives' : 'Payment authorised'}</p></div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/account/orders" className="flex-1"><Button variant="outline" fullWidth>Track Order</Button></Link>
            <Link href="/shop" className="flex-1"><Button variant="primary" fullWidth>Continue Shopping</Button></Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-navy px-4 py-3 flex items-center justify-between">
        <span className="text-white font-bold font-display text-sm">AutoParts<span className="text-brand-orange">Pro</span><span className="text-white/40 font-normal ml-3 text-xs">Secure Checkout</span></span>
        <div className="flex items-center gap-1.5 text-white/50 text-xs"><Lock size={12} /> SSL Encrypted</div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <StepIndicator current={step} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">

            {step === 1 && (
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h2 className="text-sm font-bold text-navy mb-4">Contact Information</h2>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First name" id="fn" value={form.firstName} onChange={update('firstName')} required placeholder="James" />
                  <Field label="Last name" id="ln" value={form.lastName} onChange={update('lastName')} required placeholder="Mwangi" />
                  <Field label="Email" id="email" type="email" value={form.email} onChange={update('email')} required placeholder="james@email.com" className="col-span-2" />
                  <Field label="Phone" id="phone" type="tel" value={form.phone} onChange={update('phone')} required placeholder="+254 7XX XXX XXX" className="col-span-2" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h2 className="text-sm font-bold text-navy mb-4">Delivery Address</h2>
                <div className="grid grid-cols-2 gap-3">
                  <SelectField label="County" id="county" value={form.county} onChange={update('county')} options={COUNTIES} required />
                  <Field label="Town / Area" id="town" value={form.town} onChange={update('town')} required placeholder="e.g. Westlands" />
                  <Field label="Street / Building" id="address" value={form.address} onChange={update('address')} placeholder="Kilimani Road, Block C" className="col-span-2" />
                  <Field label="Delivery notes" id="notes" value={form.notes} onChange={update('notes')} placeholder="Landmark, gate colour…" className="col-span-2" />
                </div>
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <p className="text-xs font-bold text-navy mb-3">Delivery Options</p>
                  {[
                    { id:'std', label:'Standard (1–3 days)', price: subtotal >= 5000 ? 'Free' : 'KES 350' },
                    { id:'exp', label:'Express — Nairobi (Same day)', price:'KES 650' },
                  ].map(({ id, label, price }) => (
                    <label key={id} htmlFor={id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer hover:border-brand-blue transition-colors mb-2">
                      <div className="flex items-center gap-2"><input type="radio" id={id} name="delivery" defaultChecked={id==='std'} className="accent-brand-blue" /><span className="text-xs text-slate-700">{label}</span></div>
                      <span className={cn('text-xs font-semibold', price==='Free'?'text-green-600':'text-navy')}>{price}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h2 className="text-sm font-bold text-navy mb-4">Payment Method</h2>
                <div className="space-y-2 mb-4">
                  {[
                    { value:'mpesa', label:'M-Pesa', desc:'STK Push to your phone', icon:'📱' },
                    { value:'card',  label:'Debit / Credit Card', desc:'Visa, Mastercard', icon:'💳' },
                    { value:'pod',   label:'Pay on Delivery', desc:'Cash or M-Pesa at door', icon:'🏠' },
                  ].map(({ value, label, desc, icon }) => (
                    <label key={value} htmlFor={`pay-${value}`} className={cn('flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all', form.paymentMethod===value?'border-brand-blue bg-blue-50':'border-slate-200 hover:border-slate-300')}>
                      <input type="radio" id={`pay-${value}`} name="payment" checked={form.paymentMethod===value as any} onChange={() => update('paymentMethod')(value)} className="accent-brand-blue" />
                      <span className="text-xl">{icon}</span>
                      <div className="flex-1"><p className="text-xs font-semibold text-navy">{label}</p><p className="text-[10px] text-slate-400">{desc}</p></div>
                    </label>
                  ))}
                </div>
                {form.paymentMethod === 'mpesa' && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-green-700 mb-2">M-Pesa Phone</p>
                    <Field label="M-Pesa number" id="mpesa" type="tel" value={form.mpesaPhone || form.phone} onChange={update('mpesaPhone')} placeholder="+254 7XX XXX XXX" required />
                    <p className="text-[10px] text-green-600 mt-2">An STK Push will be sent when you place your order.</p>
                  </div>
                )}
                {form.paymentMethod === 'card' && (
                  <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-semibold text-navy mb-3 flex items-center gap-1.5"><CreditCard size={13} /> Card Details</p>
                    <Field label="Name on card" id="cname" value={form.cardName} onChange={update('cardName')} placeholder="James Mwangi" required />
                    <Field label="Card number" id="cnum" value={form.cardNumber} onChange={update('cardNumber')} placeholder="1234 5678 9012 3456" required />
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Expiry (MM/YY)" id="cexp" value={form.cardExpiry} onChange={update('cardExpiry')} placeholder="08/27" required />
                      <Field label="CVV" id="ccvv" value={form.cardCvv} onChange={update('cardCvv')} placeholder="123" required />
                    </div>
                  </div>
                )}
                {form.paymentMethod === 'pod' && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="text-xs text-slate-600">Have the exact amount ready at delivery. Our agent will confirm before accepting payment.</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              {step > 1 && (
                <Button variant="ghost" size="md" iconLeft={<ChevronLeft size={15} />} onClick={() => setStep((s) => (s - 1) as Step)}>Back</Button>
              )}
              {step < 3
                ? <Button variant="primary" size="md" fullWidth iconRight={<ChevronRight size={15} />} onClick={() => setStep((s) => (s + 1) as Step)}>Continue</Button>
                : <Button variant="primary" size="lg" fullWidth iconLeft={<Lock size={15} />} onClick={() => { clearCart(); setStep(4) }}>Place Order — {formatPrice(orderTotal)}</Button>
              }
            </div>
          </div>

          <div className="hidden lg:block"><OrderSummary /></div>
        </div>
      </div>
    </div>
  )
}
