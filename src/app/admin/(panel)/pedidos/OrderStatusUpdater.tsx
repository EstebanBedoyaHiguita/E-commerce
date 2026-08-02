"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const STATUSES = ["pendiente", "confirmado", "despachado", "entregado", "cancelado"] as const
type Status = typeof STATUSES[number]

const STATUS_COLORS: Record<Status, string> = {
  pendiente: "#888",
  confirmado: "#60a5fa",
  despachado: "#e8ff00",
  entregado: "#4ade80",
  cancelado: "#ff3c00",
}

interface Props {
  orderId: string
  currentStatus: string
  customerPhone: string
  customerName: string
}

export function OrderStatusUpdater({ orderId, currentStatus, customerPhone, customerName }: Props) {
  const [status, setStatus] = useState<Status>(currentStatus as Status)
  const [updating, setUpdating] = useState(false)
  const router = useRouter()

  const handleChange = async (newStatus: Status) => {
    if (newStatus === status) return
    setUpdating(true)

    await fetch("/api/admin/orders/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: newStatus, customerPhone, customerName }),
    })

    setStatus(newStatus)
    setUpdating(false)
    router.refresh()
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value as Status)}
      disabled={updating}
      className="bg-transparent text-xs uppercase tracking-widest border px-2 py-1 cursor-pointer disabled:opacity-50 focus:outline-none focus:border-dralena-accent"
      style={{
        color: STATUS_COLORS[status],
        borderColor: STATUS_COLORS[status],
      }}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} style={{ color: "#fff", background: "#141414" }}>
          {s}
        </option>
      ))}
    </select>
  )
}
