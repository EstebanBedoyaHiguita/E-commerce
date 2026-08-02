import { HeroSection } from "@/components/home/HeroSection"
import { Marquee } from "@/components/home/Marquee"
import { CategoryGrid } from "@/components/home/CategoryGrid"
import { ProductCarousel } from "@/components/home/ProductCarousel"
import { CampaignBanner } from "@/components/home/CampaignBanner"
import { OfferCountdown } from "@/components/home/OfferCountdown"
import { WhyUs } from "@/components/home/WhyUs"
import { Testimonials } from "@/components/home/Testimonials"
import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/types"

const PRODUCT_QUERY = `
  *,
  brand:brands(id, name, logo_url),
  category:categories(id, name, slug),
  variants:product_variants(*)
`

async function getNewArrivals(): Promise<Product[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("products")
      .select(PRODUCT_QUERY)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(10)
    return (data as Product[]) ?? []
  } catch {
    return []
  }
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("products")
      .select(PRODUCT_QUERY)
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
    return (data as Product[]) ?? []
  } catch {
    return []
  }
}

/** Fin de la promoción: próximo domingo a medianoche. */
function getOfferEnd(): Date {
  const end = new Date()
  end.setHours(23, 59, 59, 0)
  end.setDate(end.getDate() + ((7 - end.getDay()) % 7 || 7))
  return end
}

export default async function HomePage() {
  const [newArrivals, featuredProducts] = await Promise.all([
    getNewArrivals(),
    getFeaturedProducts(),
  ])

  return (
    <>
      <HeroSection />
      <Marquee accent />
      <CategoryGrid />
      <ProductCarousel products={newArrivals} title="Novedades" />
      <CampaignBanner />
      <Marquee serif reverse />
      <OfferCountdown endsAt={getOfferEnd()} />
      <ProductCarousel
        products={featuredProducts}
        title="Los más vendidos"
        eyebrow="Favoritos de nuestras clientas"
      />
      <WhyUs />
      <Testimonials />
    </>
  )
}
