const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export interface ApiProduct {
  id: string
  name: string
  brand: string
  sku: string
  slug: string
  price: number
  original_price?: number | null
  thumbnail: string
  images?: string[]
  description?: string | null
  specifications?: Record<string, string>
  rating?: number
  review_count?: number
  stock_count?: number
  in_stock?: boolean
  condition?: string
  badge?: string | null
  tags?: string[]
  compatibilities?: Array<{ id: string; make: string; model: string; year_from: number; year_to: number; engine?: string | null }>
}

export interface ProductListResponse { items: ApiProduct[]; total: number; skip: number; limit: number }

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) }, cache: 'no-store' })
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.detail ?? 'Request failed')
  return response.json()
}

export const api = {
  products: (params = '') => request<ProductListResponse>(`/api/products/${params ? `?${params}` : ''}`),
  product: (slug: string) => request<ApiProduct>(`/api/products/slug/${encodeURIComponent(slug)}`),
  search: (query: string) => request<ApiProduct[]>(`/api/products/search?q=${encodeURIComponent(query)}`),
  categories: () => request<Array<{ id: string; name: string; slug: string; icon: string; item_count: number; color: string; icon_color: string; image?: string }>>('/api/categories/'),
}
