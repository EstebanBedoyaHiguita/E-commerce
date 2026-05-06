import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  const { email, name, password, role } = await req.json()

  const supabase = await createAdminClient()
  const password_hash = await bcrypt.hash(password, 12)

  const { error } = await supabase.from("admin_users").insert({
    email: email.toLowerCase(),
    name,
    role,
    password_hash,
    is_active: true,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
