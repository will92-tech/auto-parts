/**
 * API Client Configuration
 * 
 * Usage in components:
 * import { api } from '@/lib/api'
 * 
 * const products = await api.getProducts({ category: 'service-parts' })
 * const cart = await api.getCart()
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

interface FetchOptions extends RequestInit {
  skipAuth?: boolean
}

async function fetchAPI<T = any>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options || {}

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  }

  // Add JWT token if available and not skipped
  if (!skipAuth) {
    const token = localStorage.getItem('accessToken')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  const url = `${API_URL}${endpoint}`
  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `API Error: ${response.statusText}`)
  }

  return response.json()
}

// ── Products ──────────────────────────────────────────────────────────

export const api = {
  // Products
  products: {
    list: async (filters?: {
      category?: string
      brand?: string
      minPrice?: number
      maxPrice?: number
      inStockOnly?: boolean
      sort?: 'best-match' | 'price-asc' | 'price-desc' | 'newest' | 'best-rated' | 'most-popular'
      skip?: number
      limit?: number
    }) => {
      const params = new URLSearchParams()
      if (filters?.category) params.append('category', filters.category)
      if (filters?.brand) params.append('brand', filters.brand)
      if (filters?.minPrice) params.append('min_price', String(filters.minPrice))
      if (filters?.maxPrice) params.append('max_price', String(filters.maxPrice))
      if (filters?.inStockOnly !== undefined) params.append('in_stock_only', String(filters.inStockOnly))
      if (filters?.sort) params.append('sort', filters.sort)
      if (filters?.skip) params.append('skip', String(filters.skip))
      if (filters?.limit) params.append('limit', String(filters.limit))

      return fetchAPI(`/products?${params.toString()}`, { skipAuth: true })
    },

    get: (id: string) => fetchAPI(`/products/${id}`, { skipAuth: true }),
    getBySlug: (slug: string) => fetchAPI(`/products/slug/${slug}`, { skipAuth: true }),
    search: (query: string, limit?: number) => {
      const params = new URLSearchParams({ q: query })
      if (limit) params.append('limit', String(limit))
      return fetchAPI(`/products/search?${params.toString()}`, { skipAuth: true })
    },
  },

  // Categories
  categories: {
    list: () => fetchAPI('/categories', { skipAuth: true }),
    get: (id: string) => fetchAPI(`/categories/${id}`, { skipAuth: true }),
    getBySlug: (slug: string) => fetchAPI(`/categories/slug/${slug}`, { skipAuth: true }),
  },

  // Cart
  cart: {
    get: () => fetchAPI('/cart'),
    addItem: (productId: string, quantity: number = 1) =>
      fetchAPI('/cart/items', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, quantity }),
      }),
    updateItem: (itemId: string, quantity: number) =>
      fetchAPI(`/cart/items/${itemId}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity }),
      }),
    removeItem: (itemId: string) =>
      fetchAPI(`/cart/items/${itemId}`, { method: 'DELETE' }),
    clear: () => fetchAPI('/cart', { method: 'DELETE' }),
  },

  // Orders
  orders: {
    create: (items: Array<{ product_id: string; quantity: number }>, paymentMethod: string) =>
      fetchAPI('/orders', {
        method: 'POST',
        body: JSON.stringify({
          items,
          payment_method: paymentMethod,
        }),
      }),
    list: (skip?: number, limit?: number, status?: string) => {
      const params = new URLSearchParams()
      if (skip) params.append('skip', String(skip))
      if (limit) params.append('limit', String(limit))
      if (status) params.append('status_filter', status)
      return fetchAPI(`/orders?${params.toString()}`)
    },
    get: (id: string) => fetchAPI(`/orders/${id}`),
  },

  // Authentication
  auth: {
    register: async (email: string, firstName: string, lastName: string, password: string) => {
      const response = await fetchAPI('/auth/register', {
        method: 'POST',
        skipAuth: true,
        body: JSON.stringify({
          email,
          first_name: firstName,
          last_name: lastName,
          password,
        }),
      })
      localStorage.setItem('accessToken', response.access_token)
      return response
    },

    login: async (email: string, password: string) => {
      const response = await fetchAPI('/auth/login', {
        method: 'POST',
        skipAuth: true,
        body: JSON.stringify({ email, password }),
      })
      localStorage.setItem('accessToken', response.access_token)
      return response
    },

    logout: () => {
      localStorage.removeItem('accessToken')
    },

    me: () => fetchAPI('/auth/me'),
  },

  // Users
  users: {
    getProfile: () => fetchAPI('/users/profile'),
    addSavedVehicle: (vehicle: {
      make: string
      model: string
      year: string
      engine?: string
      registration?: string
    }) =>
      fetchAPI('/users/saved-vehicles', {
        method: 'POST',
        body: JSON.stringify(vehicle),
      }),
    getSavedVehicles: () => fetchAPI('/users/saved-vehicles'),
    deleteSavedVehicle: (vehicleId: string) =>
      fetchAPI(`/users/saved-vehicles/${vehicleId}`, { method: 'DELETE' }),
  },
}
"