import { createAdminClient } from "@/lib/supabase/server"
import { InventoryUpdater } from "./InventoryUpdater"

async function getInventory() {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from("product_variants")
    .select("*, product:products(reference, name)")
    .order("stock", { ascending: true })
  return data ?? []
}

export default async function InventarioPage() {
  const variants = await getInventory()

  return (
    <div className="p-8 space-y-6">
      <h1 className="font-display text-4xl tracking-widest">INVENTARIO</h1>
      <div className="border border-kult-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-kult-border">
              {["SKU", "Producto", "Talla", "Color", "Stock", "Actualizar"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[11px] uppercase tracking-widest" style={{ color: "var(--muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {variants.map((v: {
              id: string
              sku: string
              product?: { reference: string; name: string }
              size: string
              color: string
              stock: number
            }) => (
              <tr key={v.id} className="border-b border-kult-border hover:bg-white/5">
                <td className="px-5 py-3 font-mono text-xs">{v.sku}</td>
                <td className="px-5 py-3">
                  <span className="font-semibold">{v.product?.name}</span>
                  <span className="text-xs ml-2" style={{ color: "var(--muted)" }}>{v.product?.reference}</span>
                </td>
                <td className="px-5 py-3 text-xs">{v.size}</td>
                <td className="px-5 py-3 text-xs">{v.color}</td>
                <td className="px-5 py-3">
                  <span className={v.stock < 5 ? "text-kult-fire font-bold" : ""}>{v.stock}</span>
                  {v.stock < 5 && <span className="ml-2 text-[10px] text-kult-fire uppercase tracking-widest">Bajo stock</span>}
                </td>
                <td className="px-5 py-3">
                  <InventoryUpdater variantId={v.id} currentStock={v.stock} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
