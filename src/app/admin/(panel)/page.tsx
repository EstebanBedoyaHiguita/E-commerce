import { createAdminClient } from "@/lib/supabase/server"
import { formatCOP } from "@/lib/utils"

async function getDashboardData() {
  try {
    const supabase = await createAdminClient()
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const [
      { data: ordersToday },
      { data: ordersWeek },
      { data: ordersMonth },
      { data: recentOrders },
      { data: lowStock },
    ] = await Promise.all([
      supabase.from("orders").select("total").gte("created_at", startOfDay),
      supabase.from("orders").select("total").gte("created_at", startOfWeek),
      supabase.from("orders").select("total").gte("created_at", startOfMonth),
      supabase.from("orders").select("*, shipping_address").order("created_at", { ascending: false }).limit(8),
      supabase.from("product_variants").select("sku, stock, product_id").lt("stock", 5).order("stock"),
    ])

    const sum = (orders: { total: number }[] | null) =>
      (orders ?? []).reduce((s, o) => s + o.total, 0)

    return {
      today: { total: sum(ordersToday), count: ordersToday?.length ?? 0 },
      week: { total: sum(ordersWeek), count: ordersWeek?.length ?? 0 },
      month: { total: sum(ordersMonth), count: ordersMonth?.length ?? 0 },
      recentOrders: recentOrders ?? [],
      lowStock: lowStock ?? [],
    }
  } catch {
    return {
      today: { total: 0, count: 0 },
      week: { total: 0, count: 0 },
      month: { total: 0, count: 0 },
      recentOrders: [],
      lowStock: [],
    }
  }
}

const STATUS_COLORS: Record<string, string> = {
  pendiente: "#888",
  confirmado: "#60a5fa",
  despachado: "#e8ff00",
  entregado: "#4ade80",
  cancelado: "#ff3c00",
}

export default async function AdminDashboard() {
  const data = await getDashboardData()

  const stats = [
    { label: "Ventas hoy", value: formatCOP(data.today.total), sub: `${data.today.count} pedidos` },
    { label: "Esta semana", value: formatCOP(data.week.total), sub: `${data.week.count} pedidos` },
    { label: "Este mes", value: formatCOP(data.month.total), sub: `${data.month.count} pedidos` },
    { label: "Bajo stock", value: data.lowStock.length.toString(), sub: "variantes < 5 unidades", alert: data.lowStock.length > 0 },
  ]

  return (
    <div className="p-8 space-y-8">
      <h1 className="font-display text-4xl font-light">DASHBOARD</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`border p-5 space-y-1 ${s.alert ? "border-dralena-fire" : "border-dralena-border"}`}
          >
            <p className="text-[11px] uppercase tracking-widest" style={{ color: "var(--muted)" }}>{s.label}</p>
            <p className={`font-display text-3xl tracking-wider ${s.alert ? "text-dralena-fire" : "text-dralena-accent"}`}>
              {s.value}
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent orders */}
        <div className="lg:col-span-2 border border-dralena-border">
          <div className="px-5 py-4 border-b border-dralena-border">
            <h2 className="font-display text-xl font-light">PEDIDOS RECIENTES</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dralena-border">
                {["#", "Cliente", "Total", "Pago", "Estado"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] uppercase tracking-widest" style={{ color: "var(--muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((order: { id: string; shipping_address: { full_name?: string }; total: number; payment_method: string; status: string }) => (
                <tr key={order.id} className="border-b border-dralena-border hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs">{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-5 py-3">{order.shipping_address?.full_name ?? order.id.slice(0, 8)}</td>
                  <td className="px-5 py-3 font-display tracking-wider">{formatCOP(order.total)}</td>
                  <td className="px-5 py-3 text-xs uppercase">{order.payment_method}</td>
                  <td className="px-5 py-3">
                    <span
                      className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5"
                      style={{ color: STATUS_COLORS[order.status] ?? "#888", border: `1px solid ${STATUS_COLORS[order.status] ?? "#888"}` }}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Low stock */}
        <div className="border border-dralena-border">
          <div className="px-5 py-4 border-b border-dralena-border">
            <h2 className="font-display text-xl font-light text-dralena-fire">BAJO STOCK</h2>
          </div>
          <ul className="divide-y divide-dralena-border">
            {data.lowStock.length === 0 ? (
              <li className="px-5 py-4 text-sm" style={{ color: "var(--muted)" }}>Todo en orden ✓</li>
            ) : (
              data.lowStock.map((v: { sku: string; stock: number }) => (
                <li key={v.sku} className="flex justify-between px-5 py-3 text-sm">
                  <span className="font-mono text-xs">{v.sku}</span>
                  <span className={`font-bold ${v.stock === 0 ? "text-dralena-fire" : "text-yellow-400"}`}>
                    {v.stock} u.
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
