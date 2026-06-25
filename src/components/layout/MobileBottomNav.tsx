'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LayoutGrid, Search, Heart, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWishlistStore, selectWishlistCount } from '@/hooks/useWishlist'

const NAV = [
  { href:'/',         icon:Home,        label:'Home'    },
  { href:'/shop',     icon:LayoutGrid,  label:'Shop'    },
  { href:'/shop',     icon:Search,      label:'Search', center:true },
  { href:'/account/wishlist', icon:Heart, label:'Wishlist' },
  { href:'/account',  icon:User,        label:'Account' },
]

export function MobileBottomNav() {
  const pathname      = usePathname()
  const wishlistCount = useWishlistStore(selectWishlistCount)
  if (pathname?.startsWith('/checkout')) return null

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200" aria-label="Mobile navigation">
      <div className="flex items-center">
        {NAV.map(({ href, icon:Icon, label, center }) => {
          const active = pathname === href || (href !== '/' && pathname?.startsWith(href))
          return (
            <Link key={label} href={href} aria-label={label} aria-current={active?'page':undefined}
              className={cn('flex-1 flex flex-col items-center justify-end pb-2 pt-1.5 relative', active?'text-brand-blue':'text-slate-400')}>
              {center
                ? <div className="absolute -top-5 w-12 h-12 bg-brand-blue rounded-full flex items-center justify-center shadow-lg border-4 border-white"><Icon size={20} className="text-white" aria-hidden /></div>
                : <div className="relative"><Icon size={20} aria-hidden />{label==='Wishlist' && wishlistCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-brand-orange rounded-full text-[8px] font-bold text-white flex items-center justify-center">{wishlistCount}</span>}</div>
              }
              {!center && <span className="text-[10px] font-medium mt-0.5">{label}</span>}
              {center && <div className="h-5" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
