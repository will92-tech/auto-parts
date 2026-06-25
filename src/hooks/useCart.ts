/**
 * Cart store — Zustand
 *
 * Provides global cart state consumed by Navbar (badge count),
 * CartPage (line items), and ProductCard (add-to-cart feedback).
 *
 * Install: npm install zustand
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, CartItem } from '@/types'

interface CartState {
  items: CartItem[]
  couponCode: string
  discount: number

  // Actions
  addItem:        (product: Product, qty?: number) => void
  removeItem:     (productId: string) => void
  updateQty:      (productId: string, qty: number) => void
  applyCoupon:    (code: string) => void
  clearCart:      () => void

  // Derived (computed in selectors below)
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items:      [],
      couponCode: '',
      discount:   0,

      addItem(product, qty = 1) {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: Math.min(i.quantity + qty, i.product.stockCount) }
                  : i
              ),
            }
          }
          return { items: [...state.items, { product, quantity: qty }] }
        })
      },

      removeItem(productId) {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }))
      },

      updateQty(productId, qty) {
        if (qty < 1) {
          get().removeItem(productId)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId
              ? { ...i, quantity: Math.min(qty, i.product.stockCount) }
              : i
          ),
        }))
      },

      applyCoupon(code) {
        // TODO: validate against backend
        const knownCodes: Record<string, number> = {
          SAVE10: 0.10,
          SAVE20: 0.20,
          WELCOME: 0.05,
        }
        const rate = knownCodes[code.toUpperCase()] ?? 0
        set({ couponCode: code, discount: rate })
      },

      clearCart() {
        set({ items: [], couponCode: '', discount: 0 })
      },
    }),
    {
      name: 'autopartspro-cart',   // localStorage key
      partialize: (state) => ({    // only persist these fields
        items: state.items,
        couponCode: state.couponCode,
        discount: state.discount,
      }),
    }
  )
)

// ─── Selectors ─────────────────────────────────────────────────────────────────
// Use these in components rather than computing in render

export const selectCartCount    = (s: CartState) => s.items.reduce((n, i) => n + i.quantity, 0)
export const selectCartSubtotal = (s: CartState) => s.items.reduce((n, i) => n + i.product.price * i.quantity, 0)
export const selectCartTotal    = (s: CartState) => {
  const sub = selectCartSubtotal(s)
  return Math.round(sub * (1 - s.discount))
}
export const selectIsInCart     = (id: string) => (s: CartState) =>
  s.items.some((i) => i.product.id === id)
