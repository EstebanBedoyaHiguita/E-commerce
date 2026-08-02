import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { ScrollReveal } from "@/components/shared/ScrollReveal"

export const metadata: Metadata = {
  title: "Nosotras",
  description:
    "DRALENA: lencería de encaje diseñada y confeccionada en Medellín, Colombia. Comodidad real, discreción y todos los cuerpos.",
}

const valores = [
  {
    title: "Comodidad real",
    desc: "Encajes suaves que no pican y varillas que no marcan. Probamos cada pieza antes de lanzarla.",
  },
  {
    title: "Hecho en Colombia",
    desc: "Diseñado y confeccionado en Medellín, con talleres que pagan justo.",
  },
  {
    title: "Discreción",
    desc: "Empaque neutro, sin marca visible. Tu compra es solo tuya.",
  },
  {
    title: "Todos los cuerpos",
    desc: "De la 32A a la 42DD. Ningún cuerpo es una talla especial.",
  },
]

export default function NosotrosPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1533758488827-1ed0f9b03899?w=1600&q=80"
          alt="Confección de lencería DRALENA en Medellín"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/35 to-transparent" />
        <div className="relative z-10 container mx-auto px-4 md:px-8 pb-16">
          <ScrollReveal>
            <p className="text-dralena-accent text-[11px] uppercase tracking-[0.26em] mb-4">
              Nuestra historia
            </p>
            <h1 className="font-display text-7xl md:text-8xl font-light leading-none">DRALENA</h1>
          </ScrollReveal>
        </div>
      </section>

      {/* Misión */}
      <section className="container mx-auto px-4 md:px-8 py-20 max-w-3xl">
        <ScrollReveal>
          <h2 className="font-display text-4xl md:text-5xl font-light mb-7">Quiénes somos</h2>
          <p className="text-lg leading-relaxed mb-5" style={{ color: "#6b625c" }}>
            DRALENA nació de una idea simple: la lencería bonita no debería ser un lujo ni una
            incomodidad. Diseñamos y confeccionamos en Medellín, con encajes y tules elegidos uno
            por uno.
          </p>
          <p className="text-lg leading-relaxed" style={{ color: "#6b625c" }}>
            No vendemos para que gustes a alguien más. Vendemos para el momento en que te miras al
            espejo antes de salir — y te gusta lo que ves.
          </p>
        </ScrollReveal>
      </section>

      {/* Valores */}
      <section className="border-t border-[var(--border)] py-20">
        <div className="container mx-auto px-4 md:px-8">
          <ScrollReveal>
            <h2 className="font-display text-4xl md:text-5xl font-light mb-11">Lo que nos mueve</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border)] border border-[var(--border)]">
            {valores.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.1} className="bg-[var(--background)]">
                <div className="p-8 flex flex-col gap-3">
                  <p className="text-[11px] tracking-[0.26em] text-dralena-accent">0{i + 1}</p>
                  <h3 className="font-display text-2xl">{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#7d746e" }}>
                    {v.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <ScrollReveal>
          <h2 className="font-display text-5xl md:text-6xl font-light mb-6">Para ti, primero</h2>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-[12.5px] uppercase tracking-[0.16em] text-dralena-accent border-b border-[#DCC1C4] pb-1.5 hover:border-dralena-accent transition-colors"
          >
            Explorar el catálogo <ArrowUpRight className="h-4 w-4" />
          </Link>
        </ScrollReveal>
      </section>
    </div>
  )
}
