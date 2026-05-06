import { createAdminClient } from "@/lib/supabase/server"
import { BrandsManager } from "./BrandsManager"

async function getBrands() {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from("brands")
    .select("*")
    .order("name")
  return data ?? []
}

export default async function MarcasPage() {
  const brands = await getBrands()
  return (
    <div className="p-6 md:p-10">
      <h1 className="font-display text-4xl tracking-widest mb-8">MARCAS</h1>
      <BrandsManager initialBrands={brands} />
    </div>
  )
}
