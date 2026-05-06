import { Truck, ShieldCheck, RefreshCw, Layers } from "lucide-react"
import { StaggerReveal } from "@/components/shared/ScrollReveal"
import { ScrollReveal } from "@/components/shared/ScrollReveal"

const reasons = [
  {
    icon: Truck,
    title: "Envío rápido",
    description: "Despachos en 24-48h a todo Colombia. Seguimiento en tiempo real.",
  },
  {
    icon: ShieldCheck,
    title: "Pago seguro",
    description: "Transacciones protegidas con Bold. Tus datos siempre seguros.",
  },
  {
    icon: RefreshCw,
    title: "Devoluciones",
    description: "30 días para cambios y devoluciones sin preguntas.",
  },
  {
    icon: Layers,
    title: "Variedad real",
    description: "Las mejores marcas streetwear en un solo lugar.",
  },
]

export function WhyUs() {
  return (
    <section className="py-20 bg-[var(--surface)]">
      <div className="container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <h2 className="font-display text-5xl md:text-7xl tracking-widest mb-16 text-center">
            ¿POR QUÉ KULT?
          </h2>
        </ScrollReveal>

        <StaggerReveal
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
          staggerDelay={0.12}
        >
          {reasons.map((r) => {
            const Icon = r.icon
            return (
              <div key={r.title} className="flex flex-col items-start gap-4">
                <div className="p-3 border border-kult-neon/30 text-kult-neon">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl tracking-widest">{r.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {r.description}
                </p>
              </div>
            )
          })}
        </StaggerReveal>
      </div>
    </section>
  )
}
