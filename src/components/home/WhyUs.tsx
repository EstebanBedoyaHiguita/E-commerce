import { PackageOpen, RefreshCw, MessageCircle, ShieldCheck } from "lucide-react"
import { StaggerReveal } from "@/components/shared/ScrollReveal"
import { ScrollReveal } from "@/components/shared/ScrollReveal"

const reasons = [
  {
    icon: PackageOpen,
    title: "Empaque discreto",
    description: "Caja neutra, sin marca visible. Nadie sabe qué hay dentro.",
  },
  {
    icon: RefreshCw,
    title: "Cambios en 30 días",
    description: "Si la talla no fue la ideal, la cambiamos sin costo.",
  },
  {
    icon: MessageCircle,
    title: "Asesoría por WhatsApp",
    description: "Te ayudamos a elegir talla y estilo antes de comprar.",
  },
  {
    icon: ShieldCheck,
    title: "Pago seguro",
    description: "Tarjeta, PSE, Nequi y Daviplata a través de Bold.",
  },
]

export function WhyUs() {
  return (
    <section className="py-20 bg-[var(--surface)]">
      <div className="container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <h2 className="font-display text-4xl md:text-5xl font-light mb-14 text-center">
            Comprar en DRALENA
          </h2>
        </ScrollReveal>

        <StaggerReveal
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
          staggerDelay={0.12}
        >
          {reasons.map((r) => {
            const Icon = r.icon
            return (
              <div key={r.title} className="flex flex-col items-start gap-3">
                <div className="h-11 w-11 rounded-full border border-[#C9A9AC] grid place-items-center text-dralena-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-2xl">{r.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#7d746e" }}>
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
