import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function PATCH(req: NextRequest) {
  const { variantId, stock } = await req.json()
  const supabase = await createAdminClient()
  const { error } = await supabase
    .from("product_variants")
    .update({ stock })
    .eq("id", variantId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
