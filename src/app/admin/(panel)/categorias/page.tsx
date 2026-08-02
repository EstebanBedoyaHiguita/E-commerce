import { createAdminClient } from "@/lib/supabase/server"
import { CategoriasManager } from "./CategoriasManager"

async function getCategorias() {
  const supabase = await createAdminClient()
  const { data } = await supabase.from("categories").select("*").order("name")
  return data ?? []
}

export default async function CategoriasPage() {
  const categorias = await getCategorias()
  return (
    <div className="p-6 md:p-10">
      <h1 className="font-display text-4xl font-light mb-8">CATEGORÍAS</h1>
      <CategoriasManager initialCategorias={categorias} />
    </div>
  )
}
