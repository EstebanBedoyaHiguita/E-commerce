import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    console.log("[upload] file:", file?.name, file?.type, file?.size)
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

    const ext = file.name.split(".").pop()
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())
    console.log("[upload] buffer size:", buffer.length, "path:", path)

    const supabase = await createAdminClient()
    console.log("[upload] supabase client created")

    const { error } = await supabase.storage
      .from("product-image")
      .upload(path, buffer, { contentType: file.type })

    if (error) {
      console.error("[upload] storage error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage.from("product-image").getPublicUrl(path)
    return NextResponse.json({ url: publicUrl })
  } catch (err) {
    console.error("[upload] caught error:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
