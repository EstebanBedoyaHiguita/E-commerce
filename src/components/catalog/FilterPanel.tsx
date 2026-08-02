"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Sistema de tallas de lencería: brasier por banda+copa, resto por talla numérica
const BRA_SIZES = [
  "32A", "32B", "34A", "34B", "34C",
  "36B", "36C", "36D", "38C", "38D",
  "40D", "40DD", "42DD",
]
const NUMBER_SIZES = ["6", "8", "10", "12", "14", "16"]

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

  const toggleSize = (key: string, size: string) => {
    const current = searchParams.get(key)?.split(",").filter(Boolean) ?? []
    const next = current.includes(size)
      ? current.filter((s) => s !== size)
      : [...current, size]
    setFilter(key, next.length > 0 ? next.join(",") : null)
  }

  const activeCategory = searchParams.get("categoria")
  const activeCollection = searchParams.get("coleccion")
  const activeBraSizes = searchParams.get("tallas_brasier")?.split(",").filter(Boolean) ?? []
  const activeNumberSizes = searchParams.get("tallas_numero")?.split(",").filter(Boolean) ?? []
  const activeSort = searchParams.get("orden") ?? "newest"
  const hasFilters =
    activeCategory || activeCollection || activeBraSizes.length > 0 || activeNumberSizes.length > 0

  const sizeChip = (size: string, active: boolean, onClick: () => void, wide?: boolean) => (
    <button
      key={size}
      onClick={onClick}
      className={cn(
        "h-9 px-3 text-xs border transition-colors",
        wide ? "w-12" : "min-w-[44px]",
        active
          ? "border-dralena-accent bg-[#F7EAEC] text-dralena-accent font-medium"
          : "border-[#E0D0CC] text-[#5c524d] hover:border-[var(--muted)]"
      )}
    >
      {size}
    </button>
  )

  return (
    <aside className="space-y-8 sticky top-24">
      {/* Sort */}
      <div>
        <h3 className="text-[10.5px] uppercase tracking-[0.2em] font-semibold mb-4">Ordenar por</h3>
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter("orden", opt.value)}
              className={cn(
                "block w-full text-left text-sm py-1.5 transition-colors",
                activeSort === opt.value
                  ? "text-dralena-accent font-medium"
                  : "text-[#928681] hover:text-dralena-accent"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-[10.5px] uppercase tracking-[0.2em] font-semibold mb-4">Categoría</h3>
        <div className="space-y-1">
          <button
            onClick={() => setFilter("categoria", null)}
            className={cn(
              "block w-full text-left text-sm py-1.5 transition-colors",
              !activeCategory
                ? "text-dralena-accent font-medium"
                : "text-[#928681] hover:text-dralena-accent"
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
                  ? "text-dralena-accent font-medium"
                  : "text-[#928681] hover:text-dralena-accent"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Collections (tabla `brands` reusada como colecciones) */}
      {brands.length > 0 && (
        <div>
          <h3 className="text-[10.5px] uppercase tracking-[0.2em] font-semibold mb-4">Colección</h3>
          <div className="space-y-1">
            <button
              onClick={() => setFilter("coleccion", null)}
              className={cn(
                "block w-full text-left text-sm py-1.5 transition-colors",
                !activeCollection
                  ? "text-dralena-accent font-medium"
                  : "text-[#928681] hover:text-dralena-accent"
              )}
            >
              Todas
            </button>
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => setFilter("coleccion", brand.id)}
                className={cn(
                  "block w-full text-left text-sm py-1.5 transition-colors",
                  activeCollection === brand.id
                    ? "text-dralena-accent font-medium"
                    : "text-[#928681] hover:text-dralena-accent"
                )}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bra sizes */}
      <div>
        <h3 className="text-[10.5px] uppercase tracking-[0.2em] font-semibold mb-4">
          Talla de brasier
        </h3>
        <div className="flex flex-wrap gap-2">
          {BRA_SIZES.map((size) =>
            sizeChip(size, activeBraSizes.includes(size), () => toggleSize("tallas_brasier", size))
          )}
        </div>
      </div>

      {/* Number sizes */}
      <div>
        <h3 className="text-[10.5px] uppercase tracking-[0.2em] font-semibold mb-4">
          Talla numérica
        </h3>
        <div className="flex flex-wrap gap-2">
          {NUMBER_SIZES.map((size) =>
            sizeChip(
              size,
              activeNumberSizes.includes(size),
              () => toggleSize("tallas_numero", size),
              true
            )
          )}
        </div>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full gap-1 border-t border-[var(--border)] rounded-none pt-5 h-auto justify-start !text-dralena-accent"
          onClick={() => router.push(pathname, { scroll: false })}
        >
          <X className="h-3 w-3" />
          Limpiar filtros
        </Button>
      )}
    </aside>
  )
}
