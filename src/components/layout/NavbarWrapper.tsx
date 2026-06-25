'use client'

/**
 * NavbarWrapper
 *
 * A thin client component that reads live cart + wishlist counts
 * from Zustand and passes them into the Navbar.
 *
 * This pattern keeps Navbar's props-based API clean while still
 * giving it live reactive data — and avoids making the entire layout
 * a client component unnecessarily.
 */

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { useCartStore,    selectCartCount    } from '@/hooks/useCart'
import { useWishlistStore, selectWishlistCount } from '@/hooks/useWishlist'

export function NavbarWrapper() {
  const cartCount     = useCartStore(selectCartCount)
  const wishlistCount = useWishlistStore(selectWishlistCount)
  const pathname      = usePathname()

  // TODO: swap this for real auth state (e.g. NextAuth session)
  const user = null

  return (
    <Navbar
      cartCount={cartCount}
      wishlistCount={wishlistCount}
      notificationCount={0}
      user={user}
      activePath={pathname}
    />
  )
}
