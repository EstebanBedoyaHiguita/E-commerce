import { createAdminClient } from "@/lib/supabase/server"
import { formatCOP } from "@/lib/utils"
import { OrderStatusUpdater } from "./OrderStatusUpdater"

async function getOrders(status?: string) {
  const supabase = await createAdminClient()
  let query = supabase
    .from("orders")
    .select("*, shipping_address, items:order_items(quantity, unit_price, product:products(name))")
    .order("created_at", { ascending: false })

  if (status) query = query.eq("status", status)

  const { data } = await query
  return data ?? []
}

const STATUSES = ["", "pendiente", "confirmado", "despachado", "entregado", "cancelado"]

interface PageProps {
  searchParams: { status?: string }
}

export default async function PedidosPage({ searchParams }: PageProps) {
  const orders = await getOrders(searchParams.status)

  return (
    <div className="p-8 space-y-6">
      <h1 className="font-display text-4xl font-light">PEDIDOS</h1>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <a
            key={s}
            href={s ? `/admin/pedidos?status=${s}` : "/admin/pedidos"}
            className={`px-3 py-1.5 text-xs uppercase tracking-widest border transition-colors ${
              searchParams.status === s || (!searchParams.status && !s)
                ? "border-dralena-accent text-dralena-accent"
                : "border-dralena-border hover:border-dralena-muted"
            }`}
            style={{ color: searchParams.status === s || (!searchParams.status && !s) ? undefined : "var(--muted)" }}
          >
            {s || "Todos"}
          </a>
        ))}
      </div>

      <div className="border border-dralena-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dralena-border">
              {["#", "Fecha", "Cliente", "Total", "Pago", "Estado", "Acciones"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[11px] uppercase tracking-widest whitespace-nowrap" style={{ color: "var(--muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order: {
              id: string
              created_at: string
              shipping_address: { full_name?: string; phone?: string }
              total: number
              payment_method: string
              status: string
            }) => (
              <tr key={order.id} className="border-b border-dralena-border hover:bg-white/5 transition-colors">
                <td className="px-5 py-3 font-mono text-xs">{order.id.slice(0, 8).toUpperCase()}</td>
                <td className="px-5 py-3 text-xs whitespace-nowrap">{new Date(order.created_at).toLocaleDateString("es-CO")}</td>
                <td className="px-5 py-3">{order.shipping_address?.full_name ?? "—"}</td>
                <td className="px-5 py-3 font-display tracking-wider">{formatCOP(order.total)}</td>
                <td className="px-5 py-3 text-xs uppercase">{order.payment_method}</td>
                <td className="px-5 py-3">
                  <OrderStatusUpdater orderId={order.id} currentStatus={order.status} customerPhone={order.shipping_address?.phone ?? ""} customerName={order.shipping_address?.full_name ?? ""} />
                </td>
                <td className="px-5 py-3">
                  <a href={`/admin/pedidos/${order.id}`} className="text-xs text-dralena-accent hover:underline">Ver</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="text-center py-12 text-sm" style={{ color: "var(--muted)" }}>No hay pedidos</p>
        )}
      </div>
    </div>
  )
}
