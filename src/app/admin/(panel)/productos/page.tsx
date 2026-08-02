import Link from "next/link"
import { createAdminClient } from "@/lib/supabase/server"
import { formatCOP } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button-variants"
import { Plus } from "lucide-react"
import { DeleteProductButton } from "./DeleteProductButton"

async function getProducts() {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from("products")
    .select("*, brand:brands(name), category:categories(name), variants:product_variants(stock)")
    .order("created_at", { ascending: false })
  return data ?? []
}

export default async function ProductosPage() {
  const products = await getProducts()

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl font-light">PRODUCTOS</h1>
        <Link href="/admin/productos/nuevo" className={buttonVariants({ size: "md" }) + " flex items-center gap-2"}>
          <Plus className="h-4 w-4" /> Nuevo producto
        </Link>
      </div>

      <div className="border border-dralena-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dralena-border">
              {["Ref", "Nombre", "Colección", "Cat.", "Precio", "Stock", "Activo", ""].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[11px] uppercase tracking-widest whitespace-nowrap" style={{ color: "var(--muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p: {
              id: string
              reference: string
              name: string
              slug: string
              brand?: { name: string }
              category?: { name: string }
              base_price: number
              variants?: { stock: number }[]
              is_active: boolean
            }) => {
              const totalStock = (p.variants ?? []).reduce((s: number, v: { stock: number }) => s + v.stock, 0)
              return (
                <tr key={p.id} className="border-b border-dralena-border hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs">{p.reference}</td>
                  <td className="px-5 py-3 font-semibold">{p.name}</td>
                  <td className="px-5 py-3 text-xs" style={{ color: "var(--muted)" }}>{p.brand?.name ?? "—"}</td>
                  <td className="px-5 py-3 text-xs" style={{ color: "var(--muted)" }}>{p.category?.name ?? "—"}</td>
                  <td className="px-5 py-3 font-display tracking-wider">{formatCOP(p.base_price)}</td>
                  <td className="px-5 py-3">
                    <span className={totalStock < 5 ? "text-dralena-fire font-bold" : ""}>{totalStock}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-bold ${p.is_active ? "text-green-400" : "text-dralena-muted"}`}>
                      {p.is_active ? "✓" : "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/productos/${p.id}`} className="text-xs text-dralena-accent hover:underline">Editar</Link>
                      <DeleteProductButton productId={p.id} productName={p.name} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-16">
            <p className="font-display text-3xl font-light opacity-30">SIN PRODUCTOS</p>
            <Link href="/admin/productos/nuevo" className="mt-4 inline-block text-dralena-accent underline text-sm">
              Crear el primero
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
