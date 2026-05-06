"use client"

import { useState } from "react"
import { ProductGallery } from "./ProductGallery"
import { VariantSelector } from "./VariantSelector"
import { AddToCart } from "./AddToCart"
import { formatCOP } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { Product, ProductVariant } from "@/types"

interface ProductDetailClientProps {
  product: Product
}

const tabs = ["Descripción", "Tabla de tallas", "Cuidados"] as const

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Descripción")

  const price = selectedVariant?.price_override ?? product.base_price

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
      {/* Gallery */}
      <ProductGallery images={product.images} name={product.name} />

      {/* Info */}
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: "var(--muted)" }}>
            {product.brand?.name} · {product.category?.name}
          </p>
          <h1 className="font-display text-4xl md:text-5xl tracking-widest mt-2 leading-tight">
            {product.name}
          </h1>
          <div className="flex items-baseline gap-3 mt-4">
            <span className="font-display text-4xl text-kult-neon tracking-wider">
              {formatCOP(price)}
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            Ref: {product.reference}
          </p>
        </div>

        {/* Variants */}
        {product.variants && product.variants.length > 0 && (
          <VariantSelector
            variants={product.variants}
            onVariantChange={setSelectedVariant}
          />
        )}

        {/* Add to cart */}
        <AddToCart product={product} selectedVariant={selectedVariant} />

        {/* Badges */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline">Envío a todo Colombia</Badge>
          <Badge variant="outline">30 días devolución</Badge>
          <Badge variant="muted">SKU: {selectedVariant?.sku ?? product.reference}</Badge>
        </div>

        {/* Tabs */}
        <div>
          <div className="flex border-b border-[var(--border)]">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-xs uppercase tracking-widest font-semibold transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-kult-neon text-kult-neon"
                    : "border-transparent hover:text-kult-neon"
                }`}
                style={activeTab !== tab ? { color: "var(--muted)" } : {}}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="py-4 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            {activeTab === "Descripción" && (
              <p>{product.description ?? "Sin descripción disponible."}</p>
            )}
            {activeTab === "Tabla de tallas" && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      {["Talla", "Pecho", "Cintura", "Cadera"].map((h) => (
                        <th key={h} className="text-left py-2 pr-4 font-semibold text-[var(--foreground)]">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["S", "88-92", "72-76", "94-98"],
                      ["M", "92-96", "76-80", "98-102"],
                      ["L", "96-100", "80-84", "102-106"],
                      ["XL", "100-104", "84-88", "106-110"],
                    ].map(([size, ...vals]) => (
                      <tr key={size} className="border-b border-[var(--border)]">
                        <td className="py-2 pr-4 font-bold text-[var(--foreground)]">{size}</td>
                        {vals.map((v, i) => <td key={i} className="py-2 pr-4">{v} cm</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === "Cuidados" && (
              <ul className="space-y-1 list-disc list-inside">
                <li>Lavar a máquina a 30°C</li>
                <li>No usar blanqueador</li>
                <li>Planchar a temperatura media</li>
                <li>No lavar en seco</li>
                <li>No secar en secadora</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
