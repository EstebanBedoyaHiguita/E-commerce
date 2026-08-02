import { notFound } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/server"
import { ProductForm } from "../ProductForm"

export const dynamic = "force-dynamic"

async function getProduct(id: string) {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from("products")
    .select("*, variants:product_variants(*)")
    .eq("id", id)
    .single()
  return data
}

async function getFormData() {
  const supabase = await createAdminClient()
  const [{ data: brands }, { data: categories }] = await Promise.all([
    supabase.from("brands").select("id, name").order("name"),
    supabase.from("categories").select("id, name").order("name"),
  ])
  return { brands: brands ?? [], categories: categories ?? [] }
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, { brands, categories }] = await Promise.all([
    getProduct(params.id),
    getFormData(),
  ])

  if (!product) notFound()

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-display text-4xl font-light mb-8">EDITAR PRODUCTO</h1>
      <ProductForm
        brands={brands}
        categories={categories}
        initialData={{
          id: product.id,
          reference: product.reference,
          name: product.name,
          description: product.description ?? "",
          brand_id: product.brand_id ?? "",
          category_id: product.category_id ?? "",
          base_price: product.base_price,
          gender: product.gender ?? "mujer",
          is_active: product.is_active,
          is_featured: product.is_featured ?? false,
          images: product.images ?? [],
          variants: product.variants ?? [],
        }}
      />
    </div>
  )
}
