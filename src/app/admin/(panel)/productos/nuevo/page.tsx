import { createAdminClient } from "@/lib/supabase/server"
import { ProductForm } from "../ProductForm"

export const dynamic = "force-dynamic"

export default async function NuevoProductoPage() {
  const supabase = await createAdminClient()
  const { data: brands, error: e1 } = await supabase.from("brands").select("id, name").order("name")
  const { data: categories, error: e2 } = await supabase.from("categories").select("id, name").order("name")

  if (e1) console.error("[brands]", e1.message)
  if (e2) console.error("[categories]", e2.message)

  console.log("[nuevo] brands:", brands?.length, "categories:", categories?.length)

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-display text-4xl tracking-widest mb-8">NUEVO PRODUCTO</h1>
      <ProductForm brands={brands ?? []} categories={categories ?? []} />
    </div>
  )
}
