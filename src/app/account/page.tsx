'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Package, Heart, MapPin, Settings, LogOut, Car, ChevronRight, CheckCircle2, Truck, AlertCircle, Clock } from 'lucide-react'
import { cn, formatPrice, orderStatusConfig, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

const USER = { firstName:'James',lastName:'Mwangi',email:'j.mwangi@email.com',phone:'+254 712 345 678',avatarInitials:'JM' }
const ORDERS = [
  { id:'ORD-20264821',date:'2026-06-10',items:2,total:7000,  status:'in-transit' as const },
  { id:'ORD-20264720',date:'2026-06-02',items:1,total:6500,  status:'delivered'  as const },
  { id:'ORD-20264612',date:'2026-05-28',items:3,total:12400, status:'delivered'  as const },
  { id:'ORD-20264402',date:'2026-05-01',items:2,total:9200,  status:'cancelled'  as const },
]
const VEHICLES = [
  { id:'v1',make:'Toyota',model:'Corolla',year:2019,engine:'1.8L Petrol',reg:'KBY 123A' },
  { id:'v2',make:'Nissan',model:'X-Trail',year:2017,engine:'2.5L Petrol',reg:'KCZ 456B' },
]

type View = 'overview'|'orders'|'wishlist'|'addresses'|'vehicles'|'settings'
const NAV = [
  { id:'overview'  as View, label:'Dashboard',        icon:LayoutDashboard },
  { id:'orders'    as View, label:'My Orders',        icon:Package },
  { id:'wishlist'  as View, label:'Wishlist',         icon:Heart },
  { id:'addresses' as View, label:'Addresses',        icon:MapPin },
  { id:'vehicles'  as View, label:'My Vehicles',      icon:Car },
  { id:'settings'  as View, label:'Account Settings', icon:Settings },
]

export default function DashboardPage() {
  const [view, setView] = useState<View>('overview')

  const Sidebar = () => (
    <aside className="bg-navy lg:min-h-screen">
      <div className="px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold text-sm">{USER.avatarInitials}</div>
          <div>
            <p className="text-white text-sm font-semibold">{USER.firstName} {USER.lastName}</p>
            <p className="text-white/40 text-[11px] truncate max-w-[130px]">{USER.email}</p>
          </div>
        </div>
      </div>
      <nav className="py-2" aria-label="Dashboard navigation">
        {NAV.map(({ id, label, icon:Icon }) => (
          <button key={id} onClick={() => setView(id)} className={cn('w-full flex items-center gap-2.5 px-4 py-3 text-xs font-medium transition-colors text-left', view===id ? 'text-white bg-white/10 border-l-2 border-brand-orange pl-3.5' : 'text-white/60 hover:text-white hover:bg-white/8')}>
            <Icon size={15} aria-hidden /> {label}
          </button>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4 mt-auto">
        <button className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors"><LogOut size={14} aria-hidden /> Sign Out</button>
      </div>
    </aside>
  )

  const Overview = () => (
    <div className="space-y-6">
      <div><h2 className="text-base font-bold text-navy">Welcome back, {USER.firstName} 👋</h2><p className="text-xs text-slate-400 mt-0.5">Here's your account at a glance.</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { val:ORDERS.length, label:'Total Orders', color:'text-navy' },
          { val:1, label:'In Transit', color:'text-brand-orange' },
          { val:8, label:'Wishlist Items', color:'text-brand-blue' },
          { val:'KES 2,400', label:'Total Saved', color:'text-brand-green' },
        ].map(({ val, label, color }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-4">
            <p className={cn('text-2xl font-extrabold', color)}>{val}</p>
            <p className="text-xs font-medium text-navy mt-0.5">{label}</p>
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-bold text-navy">Recent Orders</h3><button className="text-xs text-brand-blue hover:underline" onClick={() => setView('orders')}>View all</button></div>
        <div className="space-y-2">
          {ORDERS.slice(0,3).map((order) => {
            const st = orderStatusConfig(order.status)
            return (
              <div key={order.id} className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                <div><p className="text-xs font-bold text-navy">#{order.id}</p><p className="text-[10px] text-slate-400">{formatDate(order.date)} · {order.items} items</p></div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-navy hidden sm:block">{formatPrice(order.total)}</span>
                  <span className={cn('text-[10px] font-semibold px-2.5 py-1 rounded-full', st.className)}>{st.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-bold text-navy">My Vehicles</h3><button className="text-xs text-brand-blue hover:underline" onClick={() => setView('vehicles')}>Manage</button></div>
        <div className="space-y-2">
          {VEHICLES.map((v) => (
            <div key={v.id} className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-xl">🚗</div>
                <div><p className="text-sm font-semibold text-navy">{v.year} {v.make} {v.model}</p><p className="text-[10px] text-slate-400">{v.engine} · {v.reg}</p></div>
              </div>
              <Link href={`/shop?make=${v.make}`} className="text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1">Find parts <ChevronRight size={12} /></Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const Orders = () => (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-navy">My Orders</h2>
      {ORDERS.map((order) => {
        const st = orderStatusConfig(order.status)
        const Icon = order.status==='delivered' ? CheckCircle2 : order.status==='in-transit' ? Truck : order.status==='cancelled' ? AlertCircle : Clock
        return (
          <div key={order.id} className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div><p className="text-sm font-bold text-navy">#{order.id}</p><p className="text-[11px] text-slate-400 mt-0.5">{formatDate(order.date)} · {order.items} items</p></div>
              <div className="text-right">
                <p className="text-sm font-bold text-navy">{formatPrice(order.total)}</p>
                <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1', st.className)}><Icon size={10} /> {st.label}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View Details</Button>
              {order.status==='delivered' && <Button variant="outline" size="sm">Reorder</Button>}
              {order.status==='in-transit' && <Button variant="primary" size="sm">Track</Button>}
            </div>
          </div>
        )
      })}
    </div>
  )

  const Settings = () => (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-navy">Account Settings</h2>
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-navy">Personal Information</h3>
        <div className="grid grid-cols-2 gap-3">
          {[['First name',USER.firstName],['Last name',USER.lastName]].map(([label,val]) => (
            <div key={label}><label className="block text-xs font-medium text-slate-500 mb-1.5">{label}</label><input defaultValue={val} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-blue" /></div>
          ))}
          <div className="col-span-2"><label className="block text-xs font-medium text-slate-500 mb-1.5">Email</label><input defaultValue={USER.email} type="email" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-blue" /></div>
          <div className="col-span-2"><label className="block text-xs font-medium text-slate-500 mb-1.5">Phone</label><input defaultValue={USER.phone} type="tel" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-blue" /></div>
        </div>
        <Button variant="primary" size="md">Save Changes</Button>
      </div>
    </div>
  )

  const Placeholder = ({ text }: { text: string }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3 text-2xl">📦</div>
      <p className="text-sm text-slate-400">{text}</p>
    </div>
  )

  const views: Record<View, React.ReactNode> = {
    overview:  <Overview />,
    orders:    <Orders />,
    wishlist:  <Placeholder text="Your wishlist is empty. Start saving parts you love." />,
    addresses: <Placeholder text="No saved addresses yet." />,
    vehicles:  <Placeholder text="No saved vehicles yet. Add your vehicle to get tailored parts." />,
    settings:  <Settings />,
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[220px_1fr]">
        <Sidebar />
        <main className="p-6">{views[view]}</main>
      </div>
    </div>
  )
}
