"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { ProductVariant } from "@/types"

interface VariantSelectorProps {
  variants: ProductVariant[]
  onVariantChange: (variant: ProductVariant | null) => void
}

export function VariantSelector({ variants, onVariantChange }: VariantSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  const sizes = Array.from(new Set(variants.map((v) => v.size)))
  const colors = Array.from(new Set(variants.map((v) => v.color)))

  const getVariant = (size: string | null, color: string | null) =>
    variants.find((v) => v.size === size && v.color === color) ?? null

  const isSizeAvailable = (size: string) => {
    if (!selectedColor) return variants.some((v) => v.size === size && v.stock > 0)
    return variants.some((v) => v.size === size && v.color === selectedColor && v.stock > 0)
  }

  const isColorAvailable = (color: string) => {
    if (!selectedSize) return variants.some((v) => v.color === color && v.stock > 0)
    return variants.some((v) => v.color === color && v.size === selectedSize && v.stock > 0)
  }

  const handleSizeSelect = (size: string) => {
    const next = selectedSize === size ? null : size
    setSelectedSize(next)
    onVariantChange(getVariant(next, selectedColor))
  }

  const handleColorSelect = (color: string) => {
    const next = selectedColor === color ? null : color
    setSelectedColor(next)
    onVariantChange(getVariant(selectedSize, next))
  }

  const selectedVariant = getVariant(selectedSize, selectedColor)

  return (
    <div className="space-y-6">
      {/* Color selector */}
      {colors.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs uppercase tracking-widest font-bold">Color</span>
            {selectedColor && (
              <span className="text-xs" style={{ color: "var(--muted)" }}>{selectedColor}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const variant = variants.find((v) => v.color === color)
              const available = isColorAvailable(color)
              return (
                <button
                  key={color}
                  onClick={() => available && handleColorSelect(color)}
                  title={color}
                  className={cn(
                    "relative h-8 w-8 rounded-full border-2 transition-all",
                    selectedColor === color ? "border-kult-neon scale-110" : "border-transparent",
                    !available && "opacity-30 cursor-not-allowed"
                  )}
                  style={{
                    backgroundColor: variant?.color_hex ?? "#888",
                  }}
                  aria-label={color}
                  disabled={!available}
                >
                  {!available && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="block h-px w-full bg-white/60 rotate-45" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Size selector */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs uppercase tracking-widest font-bold">Talla</span>
          <button className="text-xs underline" style={{ color: "var(--muted)" }}>
            Guía de tallas
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const available = isSizeAvailable(size)
            return (
              <button
                key={size}
                onClick={() => available && handleSizeSelect(size)}
                disabled={!available}
                className={cn(
                  "h-11 min-w-[44px] px-3 text-sm font-semibold border transition-all",
                  selectedSize === size
                    ? "border-kult-neon text-kult-neon bg-kult-neon/5"
                    : available
                    ? "border-[var(--border)] hover:border-[var(--foreground)]"
                    : "border-[var(--border)] opacity-30 cursor-not-allowed line-through"
                )}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      {/* Stock indicator */}
      {selectedVariant && (
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          {selectedVariant.stock <= 3
            ? `⚡ Solo quedan ${selectedVariant.stock} unidades`
            : `✓ En stock`}
        </p>
      )}
    </div>
  )
}
