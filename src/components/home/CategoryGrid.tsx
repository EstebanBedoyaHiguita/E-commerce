import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { ScrollReveal, StaggerReveal } from "@/components/shared/ScrollReveal"
import { createClient } from "@/lib/supabase/server"

async function getCategoriesWithImages() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, image_url")
    .order("name")

  if (!categories?.length) return []

  const result = await Promise.all(
    categories.map(async (cat) => {
      let image = cat.image_url

      if (!image) {
        const { data: products } = await supabase
          .from("products")
          .select("images")
          .eq("category_id", cat.id)
          .eq("is_active", true)
          .not("images", "eq", "{}")
          .limit(1)

        image = products?.[0]?.images?.[0] ?? null
      }

      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("category_id", cat.id)
        .eq("is_active", true)

      return { ...cat, image, count: count ?? 0 }
    })
  )

  return result.filter((c) => c.image)
}

export async function CategoryGrid() {
  const categories = await getCategoriesWithImages()

  if (!categories.length) return null

  return (
    <section className="container mx-auto px-4 md:px-8 py-20">
      <ScrollReveal>
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-display text-5xl md:text-7xl tracking-widest">CATEGORÍAS</h2>
          <Link
            href="/catalogo"
            className="text-xs uppercase tracking-widest hover:text-kult-neon transition-colors flex items-center gap-1"
            style={{ color: "var(--muted)" }}
          >
            Ver todo <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </ScrollReveal>

      <StaggerReveal
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        staggerDelay={0.08}
      >
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/catalogo?categoria=${cat.slug}`}
            className="group relative aspect-[3/4] overflow-hidden block"
          >
            <Image
              src={cat.image!}
              alt={cat.name}
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">
                {cat.count} {cat.count === 1 ? "pieza" : "piezas"}
              </p>
              <h3 className="font-display text-2xl md:text-3xl text-white tracking-widest mt-0.5">
                {cat.name}
              </h3>
              <div className="flex items-center gap-1 mt-2 text-kult-neon text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Ver todo <ArrowUpRight className="h-3 w-3" />
              </div>
            </div>
          </Link>
        ))}
      </StaggerReveal>
    </section>
  )
}
