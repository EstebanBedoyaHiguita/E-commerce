"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Check } from "lucide-react"
import { useCartStore } from "@/stores/cartStore"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatCOP, cn } from "@/lib/utils"
import Image from "next/image"

const schema = z.object({
  full_name: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(7, "Teléfono requerido"),
  address: z.string().min(5, "Dirección requerida"),
  city: z.string().min(2, "Ciudad requerida"),
  department: z.string().min(2, "Departamento requerido"),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const STEPS = ["Datos", "Pago", "Confirmación"]

export function CheckoutClient() {
  const [step, setStep] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<"bold" | "contraentrega">("bold")
  const [orderId, setOrderId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData | null>(null)

  const { items, totalPrice, clearCart } = useCartStore()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  if (items.length === 0 && !orderId) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="font-display text-4xl tracking-widest opacity-30">TU CARRITO ESTÁ VACÍO</p>
        <Link href="/catalogo" className="mt-4 inline-block text-kult-neon underline">
          Ir al catálogo
        </Link>
      </div>
    )
  }

  const onDataSubmit = async (data: FormData) => {
    setFormData(data)
    setStep(1)
  }

  const onPlaceOrder = async () => {
    if (!formData) return
    setSubmitting(true)

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        items,
        total: totalPrice(),
        paymentMethod,
      }),
    })

    const { orderId: newOrderId } = await res.json()
    setOrderId(newOrderId)
    clearCart()

    if (paymentMethod === "bold" && newOrderId) {
      // Bold widget is injected here — for now redirect to confirmation
    }
    setStep(2)
    setSubmitting(false)
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 max-w-5xl">
      {/* Step indicators */}
      <div className="flex items-center gap-0 mb-12">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-0">
            <div className={cn(
              "flex items-center justify-center h-8 w-8 text-xs font-bold border transition-all",
              i < step ? "bg-kult-neon border-kult-neon text-kult-bg" :
              i === step ? "border-kult-neon text-kult-neon" :
              "border-[var(--border)] opacity-40"
            )}>
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={cn(
              "ml-2 text-xs uppercase tracking-widest",
              i === step ? "text-kult-neon font-bold" : "opacity-40"
            )}>{s}</span>
            {i < STEPS.length - 1 && <div className="w-12 h-px mx-4 bg-[var(--border)]" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Main content */}
        <div className="lg:col-span-3">
          {step === 0 && (
            <form onSubmit={handleSubmit(onDataSubmit)} className="space-y-5">
              <h2 className="font-display text-3xl tracking-widest mb-6">DATOS DE ENTREGA</h2>
              <Input label="Nombre completo" error={errors.full_name?.message} {...register("full_name")} />
              <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
              <Input label="Teléfono / WhatsApp" type="tel" error={errors.phone?.message} hint="Requerido para notificaciones" {...register("phone")} />
              <Input label="Dirección" placeholder="Calle, número, apartamento" error={errors.address?.message} {...register("address")} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Ciudad" error={errors.city?.message} {...register("city")} />
                <Input label="Departamento" error={errors.department?.message} {...register("department")} />
              </div>
              <Input label="Notas adicionales (opcional)" placeholder="Instrucciones para el mensajero" {...register("notes")} />
              <Button type="submit" size="lg" className="w-full">Continuar al pago</Button>
            </form>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-display text-3xl tracking-widest mb-6">MÉTODO DE PAGO</h2>

              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod("bold")}
                  className={cn(
                    "w-full flex items-start gap-4 p-5 border transition-all text-left",
                    paymentMethod === "bold" ? "border-kult-neon" : "border-[var(--border)] hover:border-[var(--muted)]"
                  )}
                >
                  <div className={cn("h-5 w-5 mt-0.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center", paymentMethod === "bold" ? "border-kult-neon" : "border-[var(--muted)]")}>
                    {paymentMethod === "bold" && <div className="h-2.5 w-2.5 rounded-full bg-kult-neon" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm uppercase tracking-widest">Pagar con Bold</p>
                    <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>Tarjeta débito/crédito, PSE, Nequi, Daviplata</p>
                  </div>
                  <span className="ml-auto font-display text-lg tracking-widest text-kult-neon">BOLD</span>
                </button>

                <button
                  onClick={() => setPaymentMethod("contraentrega")}
                  className={cn(
                    "w-full flex items-start gap-4 p-5 border transition-all text-left",
                    paymentMethod === "contraentrega" ? "border-kult-neon" : "border-[var(--border)] hover:border-[var(--muted)]"
                  )}
                >
                  <div className={cn("h-5 w-5 mt-0.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center", paymentMethod === "contraentrega" ? "border-kult-neon" : "border-[var(--muted)]")}>
                    {paymentMethod === "contraentrega" && <div className="h-2.5 w-2.5 rounded-full bg-kult-neon" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm uppercase tracking-widest">Contraentrega</p>
                    <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>Paga en efectivo al recibir tu pedido</p>
                  </div>
                </button>
              </div>

              <div className="flex gap-3">
                <Button variant="ghost" size="lg" onClick={() => setStep(0)}>Volver</Button>
                <Button size="lg" className="flex-1" loading={submitting} onClick={onPlaceOrder}>
                  Confirmar pedido
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-12">
              <div className="inline-flex h-20 w-20 items-center justify-center border-2 border-kult-neon text-kult-neon mb-6">
                <Check className="h-10 w-10" />
              </div>
              <h2 className="font-display text-4xl tracking-widest">¡PEDIDO CONFIRMADO!</h2>
              <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
                Te enviamos un email de confirmación. Pronto recibirás actualizaciones por WhatsApp.
              </p>
              {orderId && (
                <p className="mt-2 text-xs font-mono" style={{ color: "var(--muted)" }}>
                  Pedido #{orderId.slice(0, 8).toUpperCase()}
                </p>
              )}
              <div className="flex gap-3 justify-center mt-8">
                <Link href="/catalogo" className={buttonVariants({ variant: "secondary" })}>Seguir comprando</Link>
                <Link href="/perfil" className={buttonVariants({})}>Mis pedidos</Link>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        {step < 2 && (
          <div className="lg:col-span-2">
            <div className="border border-[var(--border)] p-5 sticky top-24">
              <h3 className="font-display text-xl tracking-widest mb-4">RESUMEN</h3>
              <ul className="space-y-3 mb-4">
                {items.map((item) => (
                  <li key={item.variantId} className="flex gap-3 text-sm">
                    <div className="relative h-14 w-12 flex-shrink-0 bg-[var(--border)]">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{item.name}</p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>{item.size} · {item.color} · ×{item.quantity}</p>
                    </div>
                    <span className="font-display text-sm flex-shrink-0">{formatCOP(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-[var(--border)] pt-3 flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-widest" style={{ color: "var(--muted)" }}>Total</span>
                <span className="font-display text-2xl tracking-wider">{formatCOP(totalPrice())}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
