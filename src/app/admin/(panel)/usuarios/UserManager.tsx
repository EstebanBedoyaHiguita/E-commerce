"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { AdminUser } from "@/types"

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
  role: z.enum(["superadmin", "admin", "agente"]),
})
type FormData = z.infer<typeof schema>

interface Props {
  users: AdminUser[]
}

export function UserManager({ users }: Props) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "agente" },
  })

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) { setError("Error al crear usuario"); return }
    reset()
    setShowForm(false)
    router.refresh()
  }

  const toggleActive = async (userId: string, isActive: boolean) => {
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !isActive }),
    })
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <Button size="md" onClick={() => setShowForm((v) => !v)} className="flex items-center gap-2">
        <Plus className="h-4 w-4" /> {showForm ? "Cancelar" : "Nuevo usuario"}
      </Button>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="border border-dralena-border p-6 space-y-4 max-w-md">
          <h3 className="font-display text-xl font-light">NUEVO USUARIO</h3>
          <Input label="Nombre" error={errors.name?.message} {...register("name")} />
          <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
          <Input label="Contraseña" type="password" error={errors.password?.message} {...register("password")} />
          <div>
            <label className="block text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: "var(--muted)" }}>Rol</label>
            <select className="w-full h-12 px-4 bg-transparent border border-dralena-border text-sm focus:outline-none focus:border-dralena-accent" {...register("role")}>
              <option value="agente">Agente</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>
          {error && <p className="text-xs text-dralena-fire">{error}</p>}
          <Button type="submit" loading={isSubmitting}>Crear usuario</Button>
        </form>
      )}

      <div className="border border-dralena-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dralena-border">
              {["Nombre", "Email", "Rol", "Estado", ""].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[11px] uppercase tracking-widest" style={{ color: "var(--muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-dralena-border hover:bg-white/5">
                <td className="px-5 py-3 font-semibold">{u.name}</td>
                <td className="px-5 py-3 text-xs" style={{ color: "var(--muted)" }}>{u.email}</td>
                <td className="px-5 py-3 text-xs uppercase tracking-widest">{u.role}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-bold ${u.is_active ? "text-green-400" : "text-dralena-fire"}`}>
                    {u.is_active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => toggleActive(u.id, u.is_active)}
                    className="text-xs hover:underline"
                    style={{ color: "var(--muted)" }}
                  >
                    {u.is_active ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
