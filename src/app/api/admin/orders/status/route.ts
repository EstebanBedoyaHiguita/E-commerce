import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { notifyOrderEvent } from "@/lib/whatsapp/notifier"
import { sendOrderEmail } from "@/lib/resend/sender"
import type { OrderEventType } from "@/types"

const STATUS_TO_EVENT: Record<string, OrderEventType | null> = {
  confirmado: "confirmed",
  despachado: "shipped",
  entregado: "delivered",
  cancelado: "cancelled",
  pendiente: null,
}

export async function PATCH(req: NextRequest) {
  const { orderId, status, customerPhone, customerName, trackingNumber } = await req.json()

  const supabase = await createAdminClient()

  const updateData: Record<string, string> = { status }
  if (trackingNumber) updateData.tracking_number = trackingNumber

  const { data: order, error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", orderId)
    .select("guest_email, total")
    .single()

  if (error || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  const eventType = STATUS_TO_EVENT[status]
  if (eventType) {
    await Promise.all([
      notifyOrderEvent({
        type: eventType,
        orderId,
        customerPhone,
        customerName,
        trackingNumber,
      }),
      order.guest_email && sendOrderEmail(eventType, {
        orderId,
        customerName,
        customerEmail: order.guest_email,
        total: order.total,
        trackingNumber,
      }),
    ])
  }

  return NextResponse.json({ ok: true })
}
