"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { slugify } from "@/lib/utils"

interface Categoria { id: string; name: string; slug: string }

export function CategoriasManager({ initialCategorias }: { initialCategorias: Categoria[] }) {
  const [categorias, setCategorias] = useState(initialCategorias)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = async () => {
    if (!name.trim()) return
    setLoading(true); setError(null)
    const res = await fetch("/api/admin/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), slug: slugify(name.trim()) }),
    })
    if (res.ok) {
      const data = await res.json()
      setCategorias((p) => [...p, data])
      setName("")
    } else {
      setError("Error al crear la categoría (el nombre puede estar duplicado)")
    }
    setLoading(false)
  }

  const remove = async (id: string) => {
    await fetch(`/api/admin/categorias/${id}`, { method: "DELETE" })
    setCategorias((p) => p.filter((c) => c.id !== id))
  }

  return (
    <div className="max-w-xl space-y-8">
      <div className="space-y-3 border border-dralena-border p-6">
        <h2 className="font-display text-xl font-light">NUEVA CATEGORÍA</h2>
        <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Conjuntos" />
        {name && <p className="text-xs" style={{ color: "var(--muted)" }}>Slug: {slugify(name)}</p>}
        {error && <p className="text-xs text-dralena-fire">{error}</p>}
        <Button onClick={create} loading={loading}>Crear categoría</Button>
      </div>

      <div className="space-y-2">
        {categorias.length === 0 && <p className="text-sm" style={{ color: "var(--muted)" }}>No hay categorías aún.</p>}
        {categorias.map((c) => (
          <div key={c.id} className="flex items-center justify-between border border-dralena-border px-4 py-3">
            <div>
              <p className="font-semibold text-sm">{c.name}</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>/{c.slug}</p>
            </div>
            <button onClick={() => remove(c.id)} className="p-1 hover:text-dralena-fire transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
