// ─── Domain Types ─────────────────────────────────────────────────────────────

export interface Profile {
  id: string
  full_name: string | null
  phone: string
  avatar_url: string | null
  created_at: string
}

export interface Brand {
  id: string
  name: string
  logo_url: string | null
  description: string | null
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image_url: string | null
  created_at: string
}

export interface ProductVariant {
  id: string
  product_id: string
  size: string
  color: string
  color_hex: string | null
  stock: number
  price_override: number | null
  sku: string
  created_at: string
}

export interface Product {
  id: string
  reference: string
  name: string
  slug: string
  description: string | null
  brand_id: string | null
  category_id: string | null
  base_price: number
  images: string[]
  is_active: boolean
  is_featured: boolean
  gender: "hombre" | "mujer" | "unisex"
  created_at: string
  // Joined
  brand?: Brand
  category?: Category
  variants?: ProductVariant[]
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}

export type OrderStatus =
  | "pendiente"
  | "confirmado"
  | "despachado"
  | "entregado"
  | "cancelado"

export type PaymentMethod = "bold" | "contraentrega"

export interface ShippingAddress {
  full_name: string
  phone: string
  address: string
  city: string
  department: string
  postal_code?: string
  notes?: string
}

export interface Order {
  id: string
  user_id: string | null
  guest_email: string | null
  guest_phone: string | null
  status: OrderStatus
  total: number
  shipping_address: ShippingAddress
  payment_method: PaymentMethod
  bold_transaction_id: string | null
  tracking_number: string | null
  created_at: string
  // Joined
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  variant_id: string
  quantity: number
  unit_price: number
  // Joined
  product?: Product
  variant?: ProductVariant
}

export type AdminRole = "superadmin" | "admin" | "agente"

export interface AdminUser {
  id: string
  email: string
  name: string
  role: AdminRole
  is_active: boolean
  created_at: string
}

// ─── Cart Types ────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string
  variantId: string
  name: string
  brand: string
  size: string
  color: string
  price: number
  quantity: number
  image: string
  slug: string
}

// ─── Filter Types ──────────────────────────────────────────────────────────────

export interface ProductFilters {
  category?: string
  brand?: string
  sizes?: string[]
  colors?: string[]
  minPrice?: number
  maxPrice?: number
  sortBy?: "relevance" | "price_asc" | "price_desc" | "newest"
  page?: number
  search?: string
}

// ─── Notification Types ────────────────────────────────────────────────────────

export type OrderEventType = "confirmed" | "shipped" | "delivered" | "cancelled"

export interface OrderEvent {
  type: OrderEventType
  orderId: string
  customerPhone: string
  customerName: string
  trackingNumber?: string
}

// ─── Bold Payment Types ────────────────────────────────────────────────────────

export interface BoldPaymentData {
  orderId: string
  amount: number
  currency: "COP"
  description: string
  customerEmail: string
  integritySignature: string
}

// ─── Admin Dashboard Types ─────────────────────────────────────────────────────

export interface DashboardStats {
  salesTotal: number
  ordersCount: number
  ordersNew: number
  lowStockCount: number
  salesByDay: { date: string; total: number }[]
}
