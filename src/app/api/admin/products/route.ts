import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { variants, ...productData } = body

  const supabase = await createAdminClient()

  const { data: product, error } = await supabase
    .from("products")
    .insert(productData)
    .select()
    .single()

  if (error || !product) {
    return NextResponse.json({ error: error?.message }, { status: 500 })
  }

  if (variants?.length) {
    await supabase.from("product_variants").insert(
      variants.map((v: Record<string, unknown>) => ({ ...v, product_id: product.id }))
    )
  }

  return NextResponse.json({ id: product.id })
}
