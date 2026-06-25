'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, Heart, MapPin, Car,
  Settings, LogOut, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/account',           icon: LayoutDashboard, label: 'Dashboard'       },
  { href: '/account/orders',    icon: Package,         label: 'My Orders'       },
  { href: '/account/wishlist',  icon: Heart,           label: 'Wishlist'        },
  { href: '/account/addresses', icon: MapPin,          label: 'Addresses'       },
  { href: '/account/vehicles',  icon: Car,             label: 'My Vehicles'     },
  { href: '/account/settings',  icon: Settings,        label: 'Account Settings' },
]

interface DashboardSidebarProps {
  user?: { firstName: string; lastName: string; email: string; avatarInitials: string } | null
  className?: string
}

export function DashboardSidebar({ user, className }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={cn('bg-navy flex flex-col', className)}>
      {/* User info */}
      {user && (
        <div className="px-4 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              {user.avatarInitials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[11px] text-white/40 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-2" aria-label="Account navigation">
        <ul>
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 text-sm transition-all group',
                    active
                      ? 'bg-white/8 text-white border-l-2 border-brand-orange pl-3.5 font-medium'
                      : 'text-white/60 hover:text-white hover:bg-white/6'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon size={16} aria-hidden />
                  <span className="flex-1">{label}</span>
                  {active && <ChevronRight size={13} className="text-white/30" aria-hidden />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-white/10">
        <button className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors w-full">
          <LogOut size={14} aria-hidden />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
