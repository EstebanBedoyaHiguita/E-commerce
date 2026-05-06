"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Brand { id: string; name: string; description: string | null }

export function BrandsManager({ initialBrands }: { initialBrands: Brand[] }) {
  const [brands, setBrands] = useState(initialBrands)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = async () => {
    if (!name.trim()) return
    setLoading(true); setError(null)
    const res = await fetch("/api/admin/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), description: description.trim() || null }),
    })
    if (res.ok) {
      const data = await res.json()
      setBrands((p) => [...p, data])
      setName(""); setDescription("")
    } else {
      setError("Error al crear la marca")
    }
    setLoading(false)
  }

  const remove = async (id: string) => {
    await fetch(`/api/admin/brands/${id}`, { method: "DELETE" })
    setBrands((p) => p.filter((b) => b.id !== id))
  }

  return (
    <div className="max-w-xl space-y-8">
      <div className="space-y-3 border border-kult-border p-6">
        <h2 className="font-display text-xl tracking-widest">NUEVA MARCA</h2>
        <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Nike" />
        <Input label="Descripción (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción breve" />
        {error && <p className="text-xs text-kult-fire">{error}</p>}
        <Button onClick={create} loading={loading}>Crear marca</Button>
      </div>

      <div className="space-y-2">
        {brands.length === 0 && <p className="text-sm" style={{ color: "var(--muted)" }}>No hay marcas aún.</p>}
        {brands.map((b) => (
          <div key={b.id} className="flex items-center justify-between border border-kult-border px-4 py-3">
            <div>
              <p className="font-semibold text-sm">{b.name}</p>
              {b.description && <p className="text-xs" style={{ color: "var(--muted)" }}>{b.description}</p>}
            </div>
            <button onClick={() => remove(b.id)} className="p-1 hover:text-kult-fire transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
