import { HeroSection } from "@/components/home/HeroSection"
import { Marquee } from "@/components/home/Marquee"
import { CategoryGrid } from "@/components/home/CategoryGrid"
import { NewArrivalsGrid } from "@/components/home/NewArrivalsGrid"
import { FeaturedGrid } from "@/components/home/FeaturedGrid"
import { CampaignBanner } from "@/components/home/CampaignBanner"
import { BrandsCarousel } from "@/components/home/BrandsCarousel"
import { WhyUs } from "@/components/home/WhyUs"
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
      .limit(4)
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

export default async function HomePage() {
  const [newArrivals, featuredProducts] = await Promise.all([
    getNewArrivals(),
    getFeaturedProducts(),
  ])

  return (
    <>
      <HeroSection />
      <Marquee accent />
      <NewArrivalsGrid products={newArrivals} />
      <CategoryGrid />
      <CampaignBanner />
      <Marquee reverse />
      <FeaturedGrid products={featuredProducts} />
      <BrandsCarousel />
      <WhyUs />
    </>
  )
}
