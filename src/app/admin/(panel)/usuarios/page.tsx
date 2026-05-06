import { createAdminClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { UserManager } from "./UserManager"

async function getSession() {
  const cookieStore = await cookies()
  try {
    const raw = cookieStore.get("kult-admin-session")?.value
    if (!raw) return null
    return JSON.parse(Buffer.from(raw, "base64").toString())
  } catch { return null }
}

async function getAdminUsers() {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from("admin_users")
    .select("id, email, name, role, is_active, created_at")
    .order("created_at")
  return data ?? []
}

export default async function UsuariosPage() {
  const session = await getSession()
  if (session?.role !== "superadmin") redirect("/admin")

  const users = await getAdminUsers()
  return (
    <div className="p-8 space-y-6">
      <h1 className="font-display text-4xl tracking-widest">USUARIOS ADMIN</h1>
      <UserManager users={users} />
    </div>
  )
}
