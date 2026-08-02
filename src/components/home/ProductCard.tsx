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
      brand: "DRALENA",
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

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={(e) => { e.preventDefault(); toggle(product.id) }}
            className={cn(
              "h-8 w-8 rounded-full grid place-items-center backdrop-blur-sm transition-colors",
              isWishlisted
                ? "bg-dralena-accent text-white"
                : "bg-[var(--background)]/90 text-dralena-accent hover:bg-dralena-accent hover:text-white"
            )}
            aria-label="Agregar a wishlist"
          >
            <Heart className="h-4 w-4" fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          <button
            onClick={handleQuickAdd}
            className="h-8 w-8 rounded-full grid place-items-center bg-[var(--background)]/90 text-dralena-accent hover:bg-dralena-accent hover:text-white backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Agregar a la bolsa"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>

        {/* Quick add overlay */}
        <button
          onClick={handleQuickAdd}
          className="absolute inset-x-0 bottom-0 bg-[#2A2320]/90 text-[var(--background)] py-3.5 text-[11px] uppercase tracking-[0.18em] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          Agregar a la bolsa
        </button>
      </div>

      {/* Info */}
      <div className="mt-3.5 flex flex-col gap-1">
        <h3 className="font-display text-xl leading-tight truncate group-hover:text-dralena-accent transition-colors">
          {product.name}
        </h3>
        {product.category?.name && (
          <p className="text-[11px] uppercase tracking-[0.1em]" style={{ color: "var(--muted)" }}>
            {product.category.name}
          </p>
        )}
        <p className="text-sm text-dralena-accent">{formatCOP(price)}</p>
      </div>
    </Link>
  )
}
