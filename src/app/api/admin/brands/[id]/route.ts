import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createAdminClient()
  await supabase.from("brands").delete().eq("id", params.id)
  return NextResponse.json({ ok: true })
}
