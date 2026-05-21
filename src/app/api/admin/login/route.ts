import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import * as bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const { data: admin, error: dbError } = await supabase
    .from("admin_users")
    .select("*")
    .eq("email", email.toLowerCase())
    .eq("is_active", true)
    .single()

  if (!admin || dbError) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const valid = await bcrypt.compare(password, admin.password_hash)
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const session = Buffer.from(JSON.stringify({
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  })).toString("base64")

  const response = NextResponse.json({ ok: true })
  response.cookies.set("ultrastore-admin-session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })

  return response
}
