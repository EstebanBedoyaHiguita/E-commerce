import { ScrollReveal } from "@/components/shared/ScrollReveal"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

async function getBrands() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("brands")
    .select("id, name, slug")
    .order("name")
  return data ?? []
}

export async function BrandsCarousel() {
  const brands = await getBrands()
  if (!brands.length) return null

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
            <ScrollReveal key={brand.id} delay={i * 0.04}>
              <Link
                href={`/catalogo?marca=${brand.slug}`}
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
