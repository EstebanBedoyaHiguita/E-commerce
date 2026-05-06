import { NextRequest, NextResponse } from "next/server"
import type { OrderEvent } from "@/types"

// Internal endpoint — receives events from the e-commerce and logs/forwards them.
// When the WhatsApp platform is built, this will forward to the Meta API.
export async function POST(req: NextRequest) {
  const event: OrderEvent = await req.json()
  console.log("[WhatsApp Notification]", event)
  // TODO: Forward to Meta WhatsApp Business API when platform is ready
  return NextResponse.json({ ok: true })
}
