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
        <p className="font-display text-4xl font-light" style={{ color: "var(--muted)" }}>
          Tu bolsa está vacía
        </p>
        <Link href="/catalogo" className="mt-4 inline-block text-dralena-accent underline">
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
        paymentMethod: "bold",
      }),
    })

    const { orderId: newOrderId } = await res.json()
    setOrderId(newOrderId)
    clearCart()

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
              "flex items-center justify-center h-8 w-8 text-xs font-semibold border transition-all",
              i < step ? "bg-dralena-accent border-dralena-accent text-white" :
              i === step ? "border-dralena-accent text-dralena-accent" :
              "border-[#C9B4B0] opacity-40"
            )}>
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={cn(
              "ml-2 text-[11px] uppercase tracking-[0.16em]",
              i === step ? "text-dralena-accent font-semibold" : "opacity-40"
            )}>{s}</span>
            {i < STEPS.length - 1 && <div className="w-12 h-px mx-4 bg-[#E0D0CC]" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Main content */}
        <div className="lg:col-span-3">
          {step === 0 && (
            <form onSubmit={handleSubmit(onDataSubmit)} className="space-y-5">
              <h2 className="font-display text-4xl font-light mb-6">Datos de entrega</h2>
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
              <h2 className="font-display text-4xl font-light mb-6">Método de pago</h2>

              <div className="border border-dralena-accent bg-[#FBF2F3] p-5 flex items-start gap-4">
                <div className="h-5 w-5 mt-0.5 rounded-full border-2 border-dralena-accent flex-shrink-0 flex items-center justify-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-dralena-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em]">Pagar con Bold</p>
                  <p className="text-[12.5px] mt-1.5" style={{ color: "#8a7d78" }}>
                    Tarjeta débito/crédito, PSE, Nequi, Daviplata
                  </p>
                </div>
                <span className="font-display text-xl tracking-[0.2em] text-dralena-accent">BOLD</span>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" size="lg" onClick={() => setStep(0)}>Volver</Button>
                <Button size="lg" className="flex-1" loading={submitting} onClick={onPlaceOrder}>
                  Confirmar pedido
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-12">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full border border-dralena-accent text-dralena-accent mb-6">
                <Check className="h-9 w-9" />
              </div>
              <h2 className="font-display text-4xl font-light">¡Pedido confirmado!</h2>
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
            <div className="border border-[var(--border)] bg-[var(--surface)] p-6 sticky top-24 space-y-4">
              <h3 className="font-display text-2xl font-light">Resumen</h3>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.variantId} className="flex gap-3 items-center text-sm">
                    <div className="relative h-14 w-12 flex-shrink-0 bg-[#E3D2CF]">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-[11.5px]" style={{ color: "#8a7d78" }}>
                        {item.size} · {item.color} · ×{item.quantity}
                      </p>
                    </div>
                    <span className="text-[13.5px] text-dralena-accent flex-shrink-0">
                      {formatCOP(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-[#E1CFCB] pt-4 flex justify-between items-baseline">
                <span className="text-[11px] uppercase tracking-[0.16em]" style={{ color: "#8a7d78" }}>Total</span>
                <span className="font-display text-3xl font-light">{formatCOP(totalPrice())}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#8a7d78" }}>
                Tu pedido llega en empaque neutro, sin marca visible.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
