import crypto from "crypto"

export function generateBoldIntegritySignature(
  orderId: string,
  amount: number,
  currency: string = "COP"
): string {
  const integrityKey = process.env.BOLD_INTEGRITY_KEY!
  const payload = `${orderId}${amount}${currency}${integrityKey}`
  return crypto.createHash("sha256").update(payload).digest("hex")
}

export interface BoldWebhookPayload {
  transaction: {
    id: string
    status: "APPROVED" | "DECLINED" | "PENDING" | "VOIDED"
    amount: { total: number; currency: string }
    metadata: { orderId: string }
  }
}

export function verifyBoldWebhookSignature(
  payload: string,
  signature: string
): boolean {
  const integrityKey = process.env.BOLD_INTEGRITY_KEY!
  const expected = crypto
    .createHmac("sha256", integrityKey)
    .update(payload)
    .digest("hex")
  return expected === signature
}
