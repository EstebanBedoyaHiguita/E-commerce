import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { ProfileClient } from "./ProfileClient"

export const metadata: Metadata = { title: "Mi Perfil" }

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login?redirect=/perfil")

  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("orders")
      .select(`*, items:order_items(*, product:products(name, images), variant:product_variants(size, color))`)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ])

  return <ProfileClient user={user} profile={profile} orders={orders ?? []} />
}
