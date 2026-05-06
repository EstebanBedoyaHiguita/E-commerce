import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { verifyBoldWebhookSignature } from "@/lib/bold"
import { notifyOrderEvent } from "@/lib/whatsapp/notifier"
import { sendOrderEmail } from "@/lib/resend/sender"

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get("x-bold-signature") ?? ""

  if (!verifyBoldWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const payload = JSON.parse(rawBody)
  const { transaction } = payload

  if (transaction.status !== "APPROVED") {
    return NextResponse.json({ ok: true })
  }

  const orderId = transaction.metadata?.orderId
  if (!orderId) return NextResponse.json({ error: "No orderId" }, { status: 400 })

  const supabase = await createAdminClient()

  // Update order
  const { data: order } = await supabase
    .from("orders")
    .update({
      status: "confirmado",
      bold_transaction_id: transaction.id,
    })
    .eq("id", orderId)
    .select("*, shipping_address")
    .single()

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })

  const address = order.shipping_address as { full_name: string; phone: string }

  // Send email
  await sendOrderEmail("confirmed", {
    orderId,
    customerName: address.full_name,
    customerEmail: order.guest_email ?? "",
    total: order.total,
  })

  // WhatsApp
  await notifyOrderEvent({
    type: "confirmed",
    orderId,
    customerPhone: address.phone,
    customerName: address.full_name,
  })

  return NextResponse.json({ ok: true })
}
