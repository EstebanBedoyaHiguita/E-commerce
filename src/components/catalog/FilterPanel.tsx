"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"]
const SORT_OPTIONS = [
  { value: "newest", label: "Más nuevos" },
  { value: "price_asc", label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
  { value: "relevance", label: "Relevancia" },
]

interface FilterPanelProps {
  categories: { slug: string; name: string }[]
  brands: { slug?: string; name: string; id: string }[]
}

export function FilterPanel({ categories, brands }: FilterPanelProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })
      params.delete("page")
      return params.toString()
    },
    [searchParams]
  )

  const setFilter = (key: string, value: string | null) => {
    router.push(`${pathname}?${createQueryString({ [key]: value })}`, { scroll: false })
  }

  const toggleSize = (size: string) => {
    const current = searchParams.get("tallas")?.split(",").filter(Boolean) ?? []
    const next = current.includes(size)
      ? current.filter((s) => s !== size)
      : [...current, size]
    setFilter("tallas", next.length > 0 ? next.join(",") : null)
  }

  const activeCategory = searchParams.get("categoria")
  const activeBrand = searchParams.get("marca")
  const activeGender = searchParams.get("genero")
  const activeSizes = searchParams.get("tallas")?.split(",").filter(Boolean) ?? []
  const activeSort = searchParams.get("orden") ?? "newest"
  const hasFilters = activeCategory || activeBrand || activeGender || activeSizes.length > 0

  return (
    <aside className="space-y-8 sticky top-24">
      {/* Sort */}
      <div>
        <h3 className="text-xs uppercase tracking-widest font-bold mb-4">Ordenar por</h3>
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter("orden", opt.value)}
              className={cn(
                "block w-full text-left text-sm py-1.5 transition-colors",
                activeSort === opt.value ? "text-kult-neon font-semibold" : "hover:text-kult-neon",
                activeSort !== opt.value && "opacity-70"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-xs uppercase tracking-widest font-bold mb-4">Categoría</h3>
        <div className="space-y-1">
          <button
            onClick={() => setFilter("categoria", null)}
            className={cn(
              "block w-full text-left text-sm py-1.5 transition-colors",
              !activeCategory ? "text-kult-neon font-semibold" : "hover:text-kult-neon opacity-70"
            )}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setFilter("categoria", cat.slug)}
              className={cn(
                "block w-full text-left text-sm py-1.5 transition-colors",
                activeCategory === cat.slug
                  ? "text-kult-neon font-semibold"
                  : "hover:text-kult-neon opacity-70"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="text-xs uppercase tracking-widest font-bold mb-4">Marca</h3>
        <div className="space-y-1">
          <button
            onClick={() => setFilter("marca", null)}
            className={cn(
              "block w-full text-left text-sm py-1.5 transition-colors",
              !activeBrand ? "text-kult-neon font-semibold" : "hover:text-kult-neon opacity-70"
            )}
          >
            Todas
          </button>
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => setFilter("marca", brand.id)}
              className={cn(
                "block w-full text-left text-sm py-1.5 transition-colors",
                activeBrand === brand.id
                  ? "text-kult-neon font-semibold"
                  : "hover:text-kult-neon opacity-70"
              )}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <h3 className="text-xs uppercase tracking-widest font-bold mb-4">Género</h3>
        <div className="space-y-1">
          {[{ value: null, label: "Todos" }, { value: "hombre", label: "Hombre" }, { value: "mujer", label: "Mujer" }, { value: "unisex", label: "Unisex" }].map((opt) => (
            <button
              key={opt.label}
              onClick={() => setFilter("genero", opt.value)}
              className={cn(
                "block w-full text-left text-sm py-1.5 transition-colors",
                activeGender === opt.value ? "text-kult-neon font-semibold" : "hover:text-kult-neon opacity-70"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="text-xs uppercase tracking-widest font-bold mb-4">Talla</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={cn(
                "h-9 w-12 text-xs font-semibold border transition-colors",
                activeSizes.includes(size)
                  ? "border-kult-neon text-kult-neon bg-kult-neon/10"
                  : "border-[var(--border)] hover:border-[var(--muted)]"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full gap-1"
          onClick={() => router.push(pathname, { scroll: false })}
        >
          <X className="h-3 w-3" />
          Limpiar filtros
        </Button>
      )}
    </aside>
  )
}
