import { Suspense } from "react"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { FilterPanel } from "@/components/catalog/FilterPanel"
import { ProductGrid } from "@/components/catalog/ProductGrid"
import type { Product, ProductFilters } from "@/types"

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Explora nuestra colección completa de streetwear multimarca.",
}

interface PageProps {
  searchParams: {
    categoria?: string
    marca?: string
    tallas?: string
    orden?: string
    page?: string
    q?: string
    genero?: string
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
    if ((filters as { gender?: string }).gender) query = query.eq("gender", (filters as { gender?: string }).gender)

    if (filters.sortBy === "price_asc") query = query.order("base_price", { ascending: true })
    else if (filters.sortBy === "price_desc") query = query.order("base_price", { ascending: false })
    else query = query.order("created_at", { ascending: false })

    const page = filters.page ?? 1
    query = query.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

    const { data } = await query
    return (data as Product[]) ?? []
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
  const filters = {
    category: searchParams.categoria,
    brand: searchParams.marca,
    sizes: searchParams.tallas?.split(",").filter(Boolean),
    sortBy: (searchParams.orden as ProductFilters["sortBy"]) ?? "newest",
    page: Number(searchParams.page ?? 1),
    search: searchParams.q,
    gender: searchParams.genero,
  }

  const [products, { categories, brands }] = await Promise.all([
    getProducts(filters),
    getFiltersData(),
  ])

  return (
    <div className="container mx-auto px-4 md:px-8 py-10">
      <div className="mb-10">
        <h1 className="font-display text-6xl md:text-8xl tracking-widest">CATÁLOGO</h1>
        <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
          {products.length} piezas encontradas
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters sidebar */}
        <div className="w-full md:w-56 flex-shrink-0">
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
