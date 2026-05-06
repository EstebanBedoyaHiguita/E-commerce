"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingBag } from "lucide-react"
import { useWishlistStore } from "@/stores/wishlistStore"
import { useCartStore } from "@/stores/cartStore"
import { formatCOP, cn } from "@/lib/utils"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [imageIdx, setImageIdx] = useState(0)
  const { toggle, has } = useWishlistStore()
  const { addItem } = useCartStore()
  const isWishlisted = has(product.id)

  const firstVariant = product.variants?.[0]
  const price = Number(firstVariant?.price_override || product.base_price)
  const secondImage = product.images[1]

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!firstVariant) return
    addItem({
      productId: product.id,
      variantId: firstVariant.id,
      name: product.name,
      brand: product.brand?.name ?? "",
      size: firstVariant.size,
      color: firstVariant.color,
      price,
      quantity: 1,
      image: product.images[0] ?? "/placeholder.jpg",
      slug: product.slug,
    })
  }

  return (
    <Link href={`/producto/${product.slug}`} className="group block">
      {/* Image container */}
      <div
        className="relative aspect-[3/4] overflow-hidden bg-[var(--surface)]"
        onMouseEnter={() => secondImage && setImageIdx(1)}
        onMouseLeave={() => setImageIdx(0)}
      >
        <Image
          src={product.images[imageIdx] ?? "/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-kult-bg/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-10 group-hover:translate-x-0 transition-transform duration-300">
          <button
            onClick={(e) => { e.preventDefault(); toggle(product.id) }}
            className={cn(
              "p-2 backdrop-blur-sm transition-colors",
              isWishlisted
                ? "bg-kult-neon text-kult-bg"
                : "bg-black/60 text-white hover:bg-kult-neon hover:text-kult-bg"
            )}
            aria-label="Agregar a wishlist"
          >
            <Heart className="h-4 w-4" fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          <button
            onClick={handleQuickAdd}
            className="p-2 bg-black/60 text-white hover:bg-kult-neon hover:text-kult-bg backdrop-blur-sm transition-colors"
            aria-label="Agregar al carrito"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>

        {/* New badge */}
        {/* Add logic for new products if needed */}
      </div>

      {/* Info */}
      <div className="mt-3 space-y-0.5">
        <p className="text-[11px] uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          {product.brand?.name}
        </p>
        <h3 className="text-sm font-semibold truncate group-hover:text-kult-neon transition-colors">
          {product.name}
        </h3>
        <p className="font-display text-lg tracking-wider">{formatCOP(price)}</p>
      </div>
    </Link>
  )
}
