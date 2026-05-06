import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { variants, ...productData } = await req.json()
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from("products")
    .update(productData)
    .eq("id", params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (variants?.length) {
    // Delete old variants and re-insert
    await supabase.from("product_variants").delete().eq("product_id", params.id)
    await supabase.from("product_variants").insert(
      variants.map((v: Record<string, unknown>) => ({ ...v, product_id: params.id }))
    )
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createAdminClient()
  await supabase.from("products").delete().eq("id", params.id)
  return NextResponse.json({ ok: true })
}
