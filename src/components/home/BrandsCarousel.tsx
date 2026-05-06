import { ScrollReveal } from "@/components/shared/ScrollReveal"
import Link from "next/link"

const brands = [
  { name: "Supreme", slug: "supreme" },
  { name: "Carhartt WIP", slug: "carhartt-wip" },
  { name: "Stüssy", slug: "stussy" },
  { name: "Palace", slug: "palace" },
  { name: "WTAPS", slug: "wtaps" },
  { name: "A-COLD-WALL*", slug: "a-cold-wall" },
  { name: "Aimé Leon Dore", slug: "aime-leon-dore" },
  { name: "Noah", slug: "noah" },
]

export function BrandsCarousel() {
  return (
    <section className="py-20 border-y border-[var(--border)]">
      <div className="container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.3em] mb-8" style={{ color: "var(--muted)" }}>
            Marcas que manejamos
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
          {brands.map((brand, i) => (
            <ScrollReveal key={brand.slug} delay={i * 0.04}>
              <Link
                href={`/marcas/${brand.slug}`}
                className="flex items-center justify-center py-4 border border-[var(--border)] hover:border-kult-neon transition-colors group"
              >
                <span className="font-display text-sm md:text-base tracking-widest text-center group-hover:text-kult-neon transition-colors whitespace-nowrap px-2">
                  {brand.name}
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
