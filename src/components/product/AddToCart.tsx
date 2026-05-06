"use client"

import { useState } from "react"
import { Heart, ShoppingBag, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/stores/cartStore"
import { useWishlistStore } from "@/stores/wishlistStore"
import { cn } from "@/lib/utils"
import type { Product, ProductVariant } from "@/types"

interface AddToCartProps {
  product: Product
  selectedVariant: ProductVariant | null
}

export function AddToCart({ product, selectedVariant }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCartStore()
  const { toggle, has } = useWishlistStore()
  const isWishlisted = has(product.id)

  const canAdd = selectedVariant && selectedVariant.stock > 0
  const maxQty = selectedVariant?.stock ?? 1

  const handleAdd = () => {
    if (!selectedVariant) return
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      brand: product.brand?.name ?? "",
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: selectedVariant.price_override ?? product.base_price,
      quantity,
      image: product.images[0] ?? "/placeholder.jpg",
      slug: product.slug,
    })
    setQuantity(1)
  }

  return (
    <div className="space-y-4">
      {/* Quantity */}
      <div className="flex items-center gap-4">
        <span className="text-xs uppercase tracking-widest font-bold">Cantidad</span>
        <div className="flex items-center border border-[var(--border)]">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-2 hover:text-kult-neon transition-colors"
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-4 py-2 text-sm font-semibold min-w-[40px] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            className="px-3 py-2 hover:text-kult-neon transition-colors"
            disabled={quantity >= maxQty}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1 gap-2"
          disabled={!canAdd}
          onClick={handleAdd}
        >
          <ShoppingBag className="h-5 w-5" />
          {!selectedVariant
            ? "Selecciona talla y color"
            : selectedVariant.stock === 0
            ? "Sin stock"
            : "Agregar al carrito"}
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className={cn("px-4", isWishlisted && "border-kult-neon text-kult-neon")}
          onClick={() => toggle(product.id)}
          aria-label="Agregar a wishlist"
        >
          <Heart
            className="h-5 w-5"
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </Button>
      </div>

      {!selectedVariant && (
        <p className="text-xs text-kult-fire">Selecciona color y talla para continuar</p>
      )}
    </div>
  )
}
