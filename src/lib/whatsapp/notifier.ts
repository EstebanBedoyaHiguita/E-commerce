import type { OrderEvent } from "@/types"

export async function notifyOrderEvent(event: OrderEvent): Promise<void> {
  if (!process.env.META_WHATSAPP_API_URL) {
    console.log("[WhatsApp] META_WHATSAPP_API_URL not set — skipping notification", event)
    return
  }

  try {
    const res = await fetch(process.env.META_WHATSAPP_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    })

    if (!res.ok) {
      console.error("[WhatsApp] Notification failed:", res.status, await res.text())
    }
  } catch (err) {
    console.error("[WhatsApp] Error sending notification:", err)
  }
}
