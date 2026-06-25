/**
 * Wishlist store — Zustand
 * Persisted to localStorage so wishlist survives page refresh.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types'

interface WishlistState {
  items:     Product[]
  itemIds:   Set<string>   // for O(1) lookup
  toggle:    (product: Product) => void
  isInList:  (id: string) => boolean
  clear:     () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items:   [],
      itemIds: new Set(),

      toggle(product) {
        const { itemIds, items } = get()
        if (itemIds.has(product.id)) {
          const next = items.filter((p) => p.id !== product.id)
          set({ items: next, itemIds: new Set(next.map((p) => p.id)) })
        } else {
          const next = [...items, product]
          set({ items: next, itemIds: new Set(next.map((p) => p.id)) })
        }
      },

      isInList(id) {
        return get().itemIds.has(id)
      },

      clear() {
        set({ items: [], itemIds: new Set() })
      },
    }),
    {
      name: 'autopartspro-wishlist',
      // Re-hydrate Set from array on load
      onRehydrateStorage: () => (state) => {
        if (state) state.itemIds = new Set(state.items.map((p) => p.id))
      },
    }
  )
)

export const selectWishlistCount = (s: WishlistState) => s.items.length
export const selectWishlistIds   = (s: WishlistState) => s.itemIds
