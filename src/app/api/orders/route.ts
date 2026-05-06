import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { notifyOrderEvent } from "@/lib/whatsapp/notifier"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { full_name, email, phone, address, city, department, notes, items, total, paymentMethod } = body

    const supabase = await createAdminClient()

    // Create order
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        guest_email: email,
        guest_phone: phone,
        status: "pendiente",
        total,
        shipping_address: { full_name, phone, address, city, department, notes },
        payment_method: paymentMethod,
      })
      .select()
      .single()

    if (error || !order) {
      return NextResponse.json({ error: "Error creating order" }, { status: 500 })
    }

    // Create order items
    await supabase.from("order_items").insert(
      items.map((item: { productId: string; variantId: string; quantity: number; price: number }) => ({
        order_id: order.id,
        product_id: item.productId,
        variant_id: item.variantId,
        quantity: item.quantity,
        unit_price: item.price,
      }))
    )

    // Update stock for each variant
    for (const item of items) {
      const { data: variant } = await supabase
        .from("product_variants")
        .select("stock")
        .eq("id", item.variantId)
        .single()

      if (variant) {
        await supabase
          .from("product_variants")
          .update({ stock: Math.max(0, variant.stock - item.quantity) })
          .eq("id", item.variantId)
      }
    }

    // Notify via WhatsApp if contraentrega (bold notifies via webhook)
    if (paymentMethod === "contraentrega") {
      await notifyOrderEvent({
        type: "confirmed",
        orderId: order.id,
        customerPhone: phone,
        customerName: full_name,
      })
    }

    return NextResponse.json({ orderId: order.id })
  } catch (err) {
    console.error("Order creation error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
