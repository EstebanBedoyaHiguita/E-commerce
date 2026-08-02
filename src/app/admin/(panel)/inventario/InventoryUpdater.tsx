"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Props {
  variantId: string
  currentStock: number
}

export function InventoryUpdater({ variantId, currentStock }: Props) {
  const router = useRouter()
  const [stock, setStock] = useState(currentStock)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    await fetch("/api/admin/inventory", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId, stock }),
    })
    setSaving(false)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="0"
        value={stock}
        onChange={(e) => setStock(Number(e.target.value))}
        className="w-20 h-8 px-2 bg-transparent border border-dralena-border text-sm focus:outline-none focus:border-dralena-accent"
      />
      <button
        onClick={save}
        disabled={saving || stock === currentStock}
        className="text-xs text-dralena-accent hover:underline disabled:opacity-40"
      >
        {saving ? "..." : "Guardar"}
      </button>
    </div>
  )
}
