# AutoPartsPro — Next.js Frontend

Kenya's #1 automotive parts e-commerce platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Tech Stack

| Layer       | Technology                |
|-------------|---------------------------|
| Framework   | Next.js 14 (App Router)   |
| Language    | TypeScript (strict)       |
| Styling     | Tailwind CSS 3            |
| State       | Zustand (cart + wishlist) |
| Icons       | Lucide React              |
| Fonts       | Inter + Poppins (Google)  |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Open browser
# http://localhost:3000
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout — wraps all pages with Navbar
│   ├── page.tsx            # Homepage
│   └── globals.css         # Tailwind directives + base styles
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx      # Multi-variant button (primary/outline/ghost/orange)
│   │   ├── Badge.tsx       # Product labels — HOT, SALE, NEW, stock status
│   │   └── StarRating.tsx  # Accessible star display with review count
│   │
│   ├── layout/
│   │   ├── Navbar.tsx      # Full navbar — desktop mega menu + mobile drawer
│   │   └── NavbarWrapper.tsx # Client wrapper feeding Zustand counts to Navbar
│   │
│   └── shop/
│       ├── ProductCard.tsx # 3 variants: grid | list | compact
│       ├── CategoryCard.tsx # 3 variants: default | featured | pill
│       └── ProductGrid.tsx  # Grid/list wrapper with sort + view toggle
│
├── hooks/
│   ├── useCart.ts          # Zustand cart store (persisted to localStorage)
│   └── useWishlist.ts      # Zustand wishlist store (persisted)
│
├── lib/
│   ├── utils.ts            # cn(), formatPrice(), helpers
│   └── data.ts             # Mock data — replace with API calls
│
├── types/
│   └── index.ts            # All TypeScript interfaces
│
└── index.ts                # Barrel exports — clean import paths
```

## Component Usage

### Navbar
```tsx
import { Navbar } from '@/components/layout/Navbar'

// In a client component with live counts:
<Navbar
  cartCount={3}
  wishlistCount={5}
  user={{ firstName: 'James', avatarInitials: 'JM' }}
  activePath="/shop"
/>

// Or use NavbarWrapper (reads Zustand automatically)
import { NavbarWrapper } from '@/components/layout/NavbarWrapper'
<NavbarWrapper />
```

### ProductCard
```tsx
import { ProductCard } from '@/components/shop/ProductCard'

// Grid card (default)
<ProductCard
  product={product}
  onAddToCart={(p) => addItem(p)}
  onToggleWishlist={(p) => toggleWishlist(p)}
  isWishlisted={wishlistIds.has(product.id)}
/>

// List view
<ProductCard product={product} variant="list" onAddToCart={...} />

// Compact (carousel / related products)
<ProductCard product={product} variant="compact" />
```

### CategoryCard
```tsx
import { CategoryCard, CategoryGrid } from '@/components/shop/CategoryCard'

// Single card
<CategoryCard category={category} variant="default" />
<CategoryCard category={category} variant="featured" />
<CategoryCard category={category} variant="pill" />

// Responsive grid of all categories
<CategoryGrid categories={CATEGORIES} columns={3} />
```

### Cart Store
```tsx
import { useCartStore, selectCartCount } from '@/hooks/useCart'

const addItem    = useCartStore((s) => s.addItem)
const cartCount  = useCartStore(selectCartCount)
const cartTotal  = useCartStore(selectCartTotal)
```

## Design Tokens

| Token             | Value     |
|-------------------|-----------|
| Navy (primary)    | #0F172A   |
| Brand Blue        | #2563EB   |
| Brand Orange      | #F97316   |
| Brand Green       | #22C55E   |
| Border radius     | 8px / 12px / 16px |
| Font (body)       | Inter     |
| Font (headings)   | Poppins   |

## Next Steps — Backend Integration

1. Replace `src/lib/data.ts` mock data with `fetch()` calls to your API
2. Add `app/shop/page.tsx` — full shop page with FilterPanel sidebar
3. Add `app/shop/product/[slug]/page.tsx` — product detail page
4. Add `app/cart/page.tsx` — cart page
5. Add `app/checkout/page.tsx` — 4-step checkout
6. Add `app/account/` — user dashboard, orders, wishlist
7. Wire authentication (NextAuth.js recommended)
8. Add M-Pesa payment integration (Safaricom Daraja API)
