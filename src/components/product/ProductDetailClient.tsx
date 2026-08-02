"use client"

import { useState } from "react"
import Link from "next/link"
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
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(product.variants?.[0] ?? null)
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Descripción")

  const price = Number(selectedVariant?.price_override || product.base_price)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
      {/* Gallery */}
      <ProductGallery images={product.images} name={product.name} />

      {/* Info */}
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: "#A99D97" }}>
            DRALENA{product.category?.name ? ` · ${product.category.name}` : ""}
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-light mt-2 leading-tight">
            {product.name}
          </h1>
          <div className="flex items-baseline gap-3 mt-4">
            <span className="font-display text-4xl text-dralena-accent">{formatCOP(price)}</span>
          </div>
          <p className="text-xs mt-2" style={{ color: "#A99D97" }}>
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
          <Badge variant="outline">Empaque discreto</Badge>
          <Badge variant="outline">Envío a todo Colombia</Badge>
          <Badge variant="outline">30 días de cambio</Badge>
          <Badge variant="muted">SKU: {selectedVariant?.sku ?? product.reference}</Badge>
        </div>

        {/* Tabs */}
        <div>
          <div className="flex border-b border-[var(--border)]">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-[11px] uppercase tracking-[0.16em] font-semibold transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-dralena-accent text-dralena-accent"
                    : "border-transparent hover:text-dralena-accent"
                }`}
                style={activeTab !== tab ? { color: "#A99D97" } : {}}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="py-5 text-sm leading-relaxed" style={{ color: "#7d746e" }}>
            {activeTab === "Descripción" && (
              <p>{product.description ?? "Sin descripción disponible."}</p>
            )}
            {activeTab === "Tabla de tallas" && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  {/* Talla numérica; la banda y copa del brasier están en /tallas */}
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        {["Talla", "Busto (cm)", "Cintura (cm)", "Cadera (cm)"].map((h) => (
                          <th key={h} className="text-left py-2 pr-4 font-semibold text-[var(--foreground)]">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["6", "82-86", "62-66", "88-93"],
                        ["8", "87-90", "67-70", "94-97"],
                        ["10", "91-94", "71-75", "98-102"],
                        ["12", "95-100", "76-81", "103-108"],
                        ["14", "101-106", "82-88", "109-115"],
                        ["16", "107-112", "89-95", "116-122"],
                      ].map(([size, ...vals]) => (
                        <tr key={size} className="border-b border-[var(--border)]">
                          <td className="py-2 pr-4 font-semibold text-[var(--foreground)]">{size}</td>
                          {vals.map((v, i) => <td key={i} className="py-2 pr-4">{v}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Link href="/tallas" className="inline-block text-xs underline text-dralena-accent">
                  Ver guía completa: banda y copa de brasier
                </Link>
              </div>
            )}
            {activeTab === "Cuidados" && (
              <ul className="space-y-1 list-disc list-inside">
                <li>Lavar a mano en agua fría</li>
                <li>No retorcer</li>
                <li>Secar a la sombra</li>
                <li>No usar secadora</li>
                <li>No usar blanqueador</li>
                <li>Guardar sin doblar la copa</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
