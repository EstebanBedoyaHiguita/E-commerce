import { Suspense } from "react"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { FilterPanel } from "@/components/catalog/FilterPanel"
import { ProductGrid } from "@/components/catalog/ProductGrid"
import type { Product, ProductFilters } from "@/types"

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Explora toda la colección de lencería DRALENA: conjuntos, encaje, bodies y novia.",
}

interface PageProps {
  searchParams: {
    categoria?: string
    coleccion?: string
    tallas_brasier?: string
    tallas_numero?: string
    orden?: string
    page?: string
    q?: string
  }
}

const PAGE_SIZE = 24

async function getProducts(filters: ProductFilters): Promise<Product[]> {
  try {
    const supabase = await createClient()
    let query = supabase
      .from("products")
      .select(`*, brand:brands(id, name), category:categories(id, name, slug), variants:product_variants(*)`)
      .eq("is_active", true)

    if (filters.category) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", filters.category)
        .single()
      if (cat) query = query.eq("category_id", cat.id)
    }

    if (filters.brand) query = query.eq("brand_id", filters.brand)
    if (filters.search) query = query.ilike("name", `%${filters.search}%`)

    if (filters.sortBy === "price_asc") query = query.order("base_price", { ascending: true })
    else if (filters.sortBy === "price_desc") query = query.order("base_price", { ascending: false })
    else query = query.order("created_at", { ascending: false })

    const page = filters.page ?? 1
    query = query.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

    const { data } = await query
    let products = (data as Product[]) ?? []

    // El filtro de talla vive en las variantes, no en `products`
    if (filters.sizes?.length) {
      products = products.filter((p) =>
        p.variants?.some((v) => filters.sizes!.includes(v.size))
      )
    }

    return products
  } catch {
    return []
  }
}

async function getFiltersData() {
  try {
    const supabase = await createClient()
    const [{ data: categories }, { data: brands }] = await Promise.all([
      supabase.from("categories").select("id, name, slug").order("name"),
      supabase.from("brands").select("id, name").order("name"),
    ])
    return { categories: categories ?? [], brands: brands ?? [] }
  } catch {
    return { categories: [], brands: [] }
  }
}

export default async function CatalogoPage({ searchParams }: PageProps) {
  const sizes = [
    ...(searchParams.tallas_brasier?.split(",").filter(Boolean) ?? []),
    ...(searchParams.tallas_numero?.split(",").filter(Boolean) ?? []),
  ]

  const filters: ProductFilters = {
    category: searchParams.categoria,
    brand: searchParams.coleccion,
    sizes: sizes.length > 0 ? sizes : undefined,
    sortBy: (searchParams.orden as ProductFilters["sortBy"]) ?? "newest",
    page: Number(searchParams.page ?? 1),
    search: searchParams.q,
  }

  const [products, { categories, brands }] = await Promise.all([
    getProducts(filters),
    getFiltersData(),
  ])

  return (
    <div className="container mx-auto px-4 md:px-8 py-10">
      <div className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#B98A8F] mb-3">
          Inicio / Catálogo
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-light leading-none">Catálogo</h1>
        <p className="text-sm mt-3" style={{ color: "var(--muted)" }}>
          {products.length} {products.length === 1 ? "pieza encontrada" : "piezas encontradas"}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Filters sidebar */}
        <div className="w-full md:w-[230px] flex-shrink-0">
          <Suspense>
            <FilterPanel categories={categories} brands={brands} />
          </Suspense>
        </div>

        {/* Products */}
        <div className="flex-1 min-w-0">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  )
}
