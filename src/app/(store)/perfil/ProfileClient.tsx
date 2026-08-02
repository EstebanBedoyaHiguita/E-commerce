"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { formatCOP } from "@/lib/utils"
import type { Profile, Order } from "@/types"

const STATUS_LABELS: Record<string, { label: string; variant: "neon" | "fire" | "muted" | "outline" }> = {
  pendiente: { label: "Pendiente", variant: "muted" },
  confirmado: { label: "Confirmado", variant: "outline" },
  despachado: { label: "Despachado", variant: "neon" },
  entregado: { label: "Entregado", variant: "neon" },
  cancelado: { label: "Cancelado", variant: "fire" },
}

interface ProfileClientProps {
  user: User
  profile: Profile | null
  orders: Order[]
}

export function ProfileClient({ user, profile, orders }: ProfileClientProps) {
  const router = useRouter()
  const [tab, setTab] = useState<"orders" | "account">("orders")
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name ?? "")
  const [phone, setPhone] = useState(profile?.phone ?? "")

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    await supabase.from("profiles").upsert({ id: user.id, full_name: fullName, phone })
    setSaving(false)
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 max-w-4xl">
      <div className="flex items-baseline justify-between mb-10">
        <h1 className="font-display text-5xl md:text-6xl font-light">Mi perfil</h1>
        <Button variant="ghost" size="sm" onClick={handleLogout}>Cerrar sesión</Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--border)] mb-8">
        {(["orders", "account"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 text-xs uppercase tracking-widest font-bold border-b-2 -mb-px transition-colors ${
              tab === t ? "border-dralena-accent text-dralena-accent" : "border-transparent hover:text-dralena-accent"
            }`}
            style={tab !== t ? { color: "var(--muted)" } : {}}
          >
            {t === "orders" ? "Mis pedidos" : "Mi cuenta"}
          </button>
        ))}
      </div>

      {/* Orders tab */}
      {tab === "orders" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-center py-16 font-display text-3xl font-light opacity-40">
              Aún no hay pedidos
            </p>
          ) : (
            orders.map((order) => {
              const status = STATUS_LABELS[order.status] ?? { label: order.status, variant: "muted" as const }
              return (
                <div key={order.id} className="border border-[var(--border)] p-5 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest" style={{ color: "var(--muted)" }}>
                        Pedido #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                        {new Date(order.created_at).toLocaleDateString("es-CO")}
                      </p>
                    </div>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                  <div className="font-display text-2xl tracking-wider">{formatCOP(order.total)}</div>
                  {order.tracking_number && (
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      Guía: {order.tracking_number}
                    </p>
                  )}
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Account tab */}
      {tab === "account" && (
        <div className="max-w-sm space-y-4">
          <Input
            label="Nombre completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            label="Teléfono / WhatsApp"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input label="Email" value={user.email ?? ""} disabled />
          <Button size="md" onClick={handleSave} loading={saving}>
            Guardar cambios
          </Button>
        </div>
      )}
    </div>
  )
}
