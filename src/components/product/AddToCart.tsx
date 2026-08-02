"use client"

import { useState } from "react"
import { Heart, Minus, Plus } from "lucide-react"
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
      brand: "DRALENA",
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
        <span className="text-[10.5px] uppercase tracking-[0.2em] font-semibold">Cantidad</span>
        <div className="flex items-center border border-[#E0D0CC]">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-4 py-2.5 hover:text-dralena-accent transition-colors disabled:opacity-40"
            disabled={quantity <= 1}
            aria-label="Reducir cantidad"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-4 py-2.5 text-sm font-medium min-w-[40px] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            className="px-4 py-2.5 hover:text-dralena-accent transition-colors disabled:opacity-40"
            disabled={quantity >= maxQty}
            aria-label="Aumentar cantidad"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1"
          disabled={!canAdd}
          onClick={handleAdd}
        >
          {!selectedVariant
            ? "Selecciona talla y color"
            : selectedVariant.stock === 0
            ? "Sin stock"
            : "Agregar a la bolsa"}
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className={cn("px-4 !text-dralena-accent", isWishlisted && "border-dralena-accent")}
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
        <p className="text-xs text-dralena-fire">Selecciona color y talla para continuar</p>
      )}
    </div>
  )
}
