import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Boxes,
  Users,
  LogOut,
  Tag,
  Layers,
} from "lucide-react"
import type { AdminRole } from "@/types"

interface AdminSession {
  role: AdminRole
  name: string
  email: string
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["superadmin", "admin", "agente"] as AdminRole[] },
  { href: "/admin/productos", label: "Productos", icon: Package, roles: ["superadmin", "admin"] as AdminRole[] },
  { href: "/admin/marcas", label: "Marcas", icon: Tag, roles: ["superadmin", "admin"] as AdminRole[] },
  { href: "/admin/categorias", label: "Categorías", icon: Layers, roles: ["superadmin", "admin"] as AdminRole[] },
  { href: "/admin/inventario", label: "Inventario", icon: Boxes, roles: ["superadmin", "admin"] as AdminRole[] },
  { href: "/admin/pedidos", label: "Pedidos", icon: ClipboardList, roles: ["superadmin", "admin", "agente"] as AdminRole[] },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users, roles: ["superadmin"] as AdminRole[] },
]

async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies()
    const raw = cookieStore.get("kult-admin-session")?.value
    if (!raw) return null
    return JSON.parse(Buffer.from(raw, "base64").toString())
  } catch {
    return null
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession()
  if (!session) redirect("/admin/login")

  const visibleNav = navItems.filter((item) => item.roles.includes(session.role))

  return (
    <div className="flex min-h-screen bg-kult-bg text-white">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 border-r border-kult-border flex flex-col bg-kult-surface">
        <div className="p-6 border-b border-kult-border">
          <Link href="/admin" className="font-display text-3xl tracking-widest text-kult-neon">
            KULT
          </Link>
          <p className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: "var(--muted)" }}>
            Admin
          </p>
        </div>

        <nav className="flex-1 py-4">
          <ul className="space-y-0.5 px-2">
            {visibleNav.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-none hover:bg-white/5 hover:text-kult-neon transition-colors group"
                    style={{ color: "var(--muted)" }}
                  >
                    <Icon className="h-4 w-4 group-hover:text-kult-neon transition-colors" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-kult-border">
          <p className="text-xs font-semibold truncate">{session.name}</p>
          <p className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: "var(--muted)" }}>
            {session.role}
          </p>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 text-xs mt-3 hover:text-kult-fire transition-colors"
              style={{ color: "var(--muted)" }}
            >
              <LogOut className="h-3 w-3" />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
