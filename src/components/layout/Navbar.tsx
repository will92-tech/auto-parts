'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Car,
  Wrench,
  Cog,
  Settings,
  Volume2,
  CircuitBoard,
  Zap,
  Package,
  Phone,
  Bell,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import type { MegaMenuColumn } from '@/types'

// ─── Mega Menu Data ───────────────────────────────────────────────────────────

const MEGA_MENU_COLUMNS: MegaMenuColumn[] = [
  {
    title: 'By Category',
    items: [
      { label: 'Service Parts',   href: '/shop?category=service-parts',   icon: 'Wrench'  },
      { label: 'Engine Parts',    href: '/shop?category=engine-parts',    icon: 'Cog'     },
      { label: 'Transmission',    href: '/shop?category=transmission',    icon: 'Settings' },
      { label: 'Body Parts',      href: '/shop?category=body-parts',      icon: 'Car'     },
      { label: 'Sound Systems',   href: '/shop?category=sound-systems',   icon: 'Volume2' },
      { label: 'EFC Components',  href: '/shop?category=efc-components',  icon: 'CircuitBoard' },
    ],
  },
  {
    title: 'Popular Brands',
    items: [
      { label: 'Toyota Genuine', href: '/shop?brand=toyota' },
      { label: 'Denso',          href: '/shop?brand=denso'  },
      { label: 'Bosch',          href: '/shop?brand=bosch'  },
      { label: 'Castrol',        href: '/shop?brand=castrol'},
      { label: 'NGK',            href: '/shop?brand=ngk'    },
      { label: 'Aisin',          href: '/shop?brand=aisin'  },
    ],
  },
  {
    title: 'Quick Links',
    items: [
      { label: 'Today\'s Deals', href: '/deals'         },
      { label: 'New Arrivals',   href: '/shop?sort=newest' },
      { label: 'Best Sellers',   href: '/shop?sort=best-rated' },
      { label: 'Clearance',      href: '/shop?badge=sale'  },
      { label: 'Trade / Bulk',   href: '/trade'          },
    ],
  },
]

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Wrench, Cog, Settings, Car, Volume2, CircuitBoard, Zap, Package,
}

// ─── Main Nav Links ───────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Home',       href: '/'          },
  { label: 'Shop',       href: '/shop',     hasMega: true },
  { label: 'Categories', href: '/categories'},
  { label: 'Brands',     href: '/brands'    },
  { label: 'Deals',      href: '/deals'     },
]

// ─── Props ────────────────────────────────────────────────────────────────────

interface NavbarProps {
  cartCount?: number
  wishlistCount?: number
  notificationCount?: number
  user?: { firstName: string; avatarInitials: string } | null
  activePath?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Navbar({
  cartCount = 0,
  wishlistCount = 0,
  notificationCount = 0,
  user = null,
  activePath = '/',
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen,   setMegaOpen]   = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  // Close mega menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (!target.closest('[data-mega]')) setMegaOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  // Close mobile menu on route change (simplified)
  useEffect(() => {
    setMobileOpen(false)
    setMegaOpen(false)
  }, [activePath])

  return (
    <>
      {/* ── Top Banner ───────────────────────────────────────────────────── */}
      <div className="bg-brand-blue text-white text-center text-xs py-1.5 px-4 hidden md:flex items-center justify-center gap-6">
        <span className="flex items-center gap-1">
          <Phone size={11} aria-hidden />
          <a href="tel:+254700123456" className="hover:underline">+254 700 123 456</a>
        </span>
        <span>Free delivery on orders over KES 5,000</span>
        <span className="flex items-center gap-1">
          <Zap size={11} aria-hidden />
          Same-day dispatch before 12pm
        </span>
      </div>

      {/* ── Main Navbar ───────────────────────────────────────────────────── */}
      <header className="bg-navy sticky top-0 z-50 shadow-nav">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0 group"
            aria-label="AutoPartsPro — Home"
          >
            <div className="w-7 h-7 bg-brand-blue rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
              <Car size={16} className="text-white" aria-hidden />
            </div>
            <span className="text-white font-bold text-base font-display">
              AutoParts<span className="text-brand-orange">Pro</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 flex-1" aria-label="Main navigation">
            {NAV_LINKS.map((link) =>
              link.hasMega ? (
                <div key={link.href} data-mega className="relative">
                  <button
                    onClick={() => setMegaOpen((o) => !o)}
                    aria-expanded={megaOpen}
                    aria-haspopup="true"
                    className={cn(
                      'flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-all',
                      'text-white/75 hover:text-white hover:bg-white/10',
                      megaOpen && 'text-white bg-white/10'
                    )}
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      aria-hidden
                      className={cn('transition-transform', megaOpen && 'rotate-180')}
                    />
                  </button>

                  {/* Mega Menu Dropdown */}
                  {megaOpen && (
                    <div
                      className={cn(
                        'absolute top-full left-0 mt-2 w-[520px] bg-white border border-slate-200',
                        'rounded-xl shadow-2xl p-5 z-50 animate-fade-in'
                      )}
                      role="region"
                      aria-label="Shop categories"
                    >
                      <div className="grid grid-cols-3 gap-4">
                        {MEGA_MENU_COLUMNS.map((col) => (
                          <div key={col.title}>
                            <p className="text-[10px] font-bold text-navy uppercase tracking-widest mb-3 pb-2 border-b border-slate-100">
                              {col.title}
                            </p>
                            <ul className="space-y-0.5">
                              {col.items.map((item) => {
                                const Icon = item.icon ? CATEGORY_ICONS[item.icon] : null
                                return (
                                  <li key={item.href}>
                                    <Link
                                      href={item.href}
                                      onClick={() => setMegaOpen(false)}
                                      className="flex items-center gap-2 py-1.5 text-xs text-slate-600 hover:text-brand-blue transition-colors rounded"
                                    >
                                      {Icon && <Icon size={13} className="text-slate-400" aria-hidden />}
                                      {item.label}
                                    </Link>
                                  </li>
                                )
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* Bottom promo strip */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2">
                        <span className="text-xs text-blue-700 font-medium">
                          🔥 Up to 30% off engine parts this week
                        </span>
                        <Link
                          href="/deals"
                          onClick={() => setMegaOpen(false)}
                          className="text-xs font-semibold text-brand-blue hover:underline"
                        >
                          Shop deals →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-lg transition-all',
                    activePath === link.href
                      ? 'text-white border-b-2 border-brand-orange pb-1 rounded-none'
                      : 'text-white/75 hover:text-white hover:bg-white/10'
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Search Bar (expandable) */}
          <div className={cn('hidden md:flex items-center transition-all', searchOpen ? 'flex-1' : 'w-auto')}>
            {searchOpen ? (
              <div className="flex-1 flex items-center bg-white/10 border border-white/20 rounded-lg overflow-hidden">
                <Search size={14} className="ml-3 text-white/50 flex-shrink-0" aria-hidden />
                <input
                  ref={searchRef}
                  type="search"
                  placeholder="Search parts, brands, SKU…"
                  aria-label="Search parts"
                  className="flex-1 bg-transparent text-white text-sm px-2.5 py-2 outline-none placeholder:text-white/40"
                  onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className="p-2 text-white/60 hover:text-white"
                >
                  <X size={14} aria-hidden />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Search size={18} aria-hidden />
              </button>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 ml-auto md:ml-0">
            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              aria-label={`Wishlist (${wishlistCount} items)`}
              className="relative p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors hidden md:flex"
            >
              <Heart size={18} aria-hidden />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-orange rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label={`Shopping cart (${cartCount} items)`}
              className="relative p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ShoppingCart size={18} aria-hidden />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-orange rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Notifications (logged in) */}
            {user && notificationCount > 0 && (
              <button
                aria-label={`${notificationCount} notifications`}
                className="relative p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors hidden md:flex"
              >
                <Bell size={18} aria-hidden />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {notificationCount}
                </span>
              </button>
            )}

            {/* User / Sign In */}
            {user ? (
              <Link
                href="/account"
                aria-label="My account"
                className="hidden md:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-brand-blue flex items-center justify-center text-[10px] font-bold text-white">
                  {user.avatarInitials}
                </div>
                <span className="text-xs font-medium">{user.firstName}</span>
              </Link>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="hidden md:inline-flex border-white/25 text-white/80 hover:bg-white hover:text-navy hover:border-white"
                onClick={() => {/* open auth modal */}}
              >
                Sign In
              </Button>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
            </button>
          </div>
        </div>

        {/* ── Mobile Search ─────────────────────────────────────────────────── */}
        <div className="md:hidden px-4 pb-3">
          <div className="flex items-center bg-white/10 border border-white/20 rounded-lg overflow-hidden">
            <Search size={14} className="ml-3 text-white/50 flex-shrink-0" aria-hidden />
            <input
              type="search"
              placeholder="Search parts, brands, SKU…"
              aria-label="Search parts"
              className="flex-1 bg-transparent text-white text-sm px-2.5 py-2.5 outline-none placeholder:text-white/40"
            />
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ─────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          className="md:hidden fixed inset-0 z-40 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          {/* Backdrop */}
          <button
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />

          {/* Drawer Panel */}
          <nav className="relative w-72 max-w-full bg-navy h-full overflow-y-auto shadow-2xl flex flex-col animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-white/10">
              <span className="text-white font-bold font-display">
                AutoParts<span className="text-brand-orange">Pro</span>
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="p-1.5 text-white/60 hover:text-white"
              >
                <X size={18} aria-hidden />
              </button>
            </div>

            {/* User section */}
            {user ? (
              <div className="px-4 py-4 border-b border-white/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-blue flex items-center justify-center text-xs font-bold text-white">
                  {user.avatarInitials}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{user.firstName}</p>
                  <Link href="/account" className="text-xs text-brand-blue" onClick={() => setMobileOpen(false)}>
                    View account
                  </Link>
                </div>
              </div>
            ) : (
              <div className="px-4 py-4 border-b border-white/10 flex gap-2">
                <Button variant="primary" size="sm" fullWidth onClick={() => setMobileOpen(false)}>
                  Sign In
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  className="border-white/20 text-white/70"
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </Button>
              </div>
            )}

            {/* Nav Links */}
            <ul className="flex-1 py-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center justify-between px-4 py-3 text-sm transition-colors',
                      activePath === link.href
                        ? 'text-white bg-white/10 border-l-2 border-brand-orange pl-3.5'
                        : 'text-white/70 hover:text-white hover:bg-white/8'
                    )}
                  >
                    {link.label}
                    {link.hasMega && <ChevronDown size={14} className="-rotate-90" aria-hidden />}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Bottom actions */}
            <div className="px-4 py-4 border-t border-white/10 flex items-center gap-4">
              <Link
                href="/account/wishlist"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-xs text-white/60 hover:text-white"
              >
                <Heart size={15} aria-hidden /> Wishlist
                {wishlistCount > 0 && (
                  <span className="w-4 h-4 bg-brand-orange rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-xs text-white/60 hover:text-white"
              >
                <ShoppingCart size={15} aria-hidden /> Cart
                {cartCount > 0 && (
                  <span className="w-4 h-4 bg-brand-orange rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
