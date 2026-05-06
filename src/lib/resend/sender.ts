import { Resend } from "resend"

const FROM = "KULT <noreply@kult.co>"

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "placeholder")
}

type OrderEmailType = "confirmed" | "shipped" | "delivered" | "cancelled"

interface OrderEmailData {
  orderId: string
  customerName: string
  customerEmail: string
  total: number
  trackingNumber?: string
}

const subjects: Record<OrderEmailType, string> = {
  confirmed: "✅ Tu pedido ha sido confirmado",
  shipped: "📦 Tu pedido está en camino",
  delivered: "✔️ Tu pedido fue entregado",
  cancelled: "❌ Tu pedido fue cancelado",
}

function buildEmailHtml(type: OrderEmailType, data: OrderEmailData): string {
  const messages: Record<OrderEmailType, string> = {
    confirmed: `Hola ${data.customerName},<br><br>Tu pedido <strong>#${data.orderId.slice(0, 8).toUpperCase()}</strong> ha sido confirmado y está siendo procesado.<br><br>Total: <strong>$${data.total.toLocaleString("es-CO")}</strong>`,
    shipped: `Hola ${data.customerName},<br><br>Tu pedido está en camino.${data.trackingNumber ? `<br><br>Número de guía: <strong>${data.trackingNumber}</strong>` : ""}`,
    delivered: `Hola ${data.customerName},<br><br>Tu pedido ha sido entregado. ¡Esperamos que lo disfrutes!`,
    cancelled: `Hola ${data.customerName},<br><br>Tu pedido <strong>#${data.orderId.slice(0, 8).toUpperCase()}</strong> ha sido cancelado. Si tienes dudas, contáctanos.`,
  }

  return `
<!DOCTYPE html>
<html>
<body style="background:#0a0a0a;color:#ffffff;font-family:sans-serif;padding:40px 20px;max-width:600px;margin:0 auto;">
  <h1 style="font-size:3rem;letter-spacing:0.1em;color:#e8ff00;margin-bottom:8px;">KULT</h1>
  <p style="color:#888;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;margin-top:0;">Streetwear Multimarca</p>
  <hr style="border-color:#222;margin:24px 0;" />
  <p style="font-size:15px;line-height:1.6;">${messages[type]}</p>
  <hr style="border-color:#222;margin:24px 0;" />
  <p style="font-size:11px;color:#555;">© ${new Date().getFullYear()} KULT. Colombia.</p>
</body>
</html>`
}

export async function sendOrderEmail(type: OrderEmailType, data: OrderEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[Resend] RESEND_API_KEY not set — skipping email", type, data.orderId)
    return
  }

  try {
    const resend = getResend()
    await resend.emails.send({
      from: FROM,
      to: [data.customerEmail],
      subject: subjects[type],
      html: buildEmailHtml(type, data),
    })
  } catch (err) {
    console.error("[Resend] Error sending email:", err)
  }
}
