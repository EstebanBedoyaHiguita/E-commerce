import { Star } from "lucide-react"
import { ScrollReveal, StaggerReveal } from "@/components/shared/ScrollReveal"

// Contenido estático: no existe tabla `reviews` en Supabase todavía.
const reviews = [
  {
    quote: "El encaje es hermoso y se siente suave, no pica. Ya pedí el segundo conjunto.",
    author: "Laura M. · Medellín",
  },
  {
    quote: "Me asesoraron por WhatsApp con la talla y quedó perfecto. Llegó en dos días.",
    author: "Carolina R. · Bogotá",
  },
  {
    quote: "La caja llega súper discreta, eso me dio mucha confianza para comprar.",
    author: "Daniela P. · Cali",
  },
]

export function Testimonials() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <h2 className="font-display text-4xl md:text-5xl font-light mb-9">Lo que dicen ellas</h2>
        </ScrollReveal>

        <StaggerReveal
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          staggerDelay={0.1}
        >
          {reviews.map((r) => (
            <div
              key={r.author}
              className="border border-[var(--border)] bg-[#FDFAF9] p-8 flex flex-col gap-4"
            >
              <div className="flex gap-0.5 text-dralena-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5" fill="currentColor" />
                ))}
              </div>
              <p className="font-display text-xl leading-snug text-[#3a312c]">{r.quote}</p>
              <p className="text-[11.5px] uppercase tracking-[0.12em] text-dralena-muted mt-auto">
                {r.author}
              </p>
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  )
}
