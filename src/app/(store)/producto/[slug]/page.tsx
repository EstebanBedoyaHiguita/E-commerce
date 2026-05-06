import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { ProductDetailClient } from "@/components/product/ProductDetailClient"
import { ProductGrid } from "@/components/catalog/ProductGrid"
import { ScrollReveal } from "@/components/shared/ScrollReveal"
import type { Product } from "@/types"

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select("name, description, images, brand:brands(name)")
    .eq("slug", params.slug)
    .single()

  if (!data) return {}

  const brandName = Array.isArray(data.brand) ? data.brand[0]?.name : (data.brand as { name?: string })?.name

  return {
    title: `${data.name}${brandName ? ` — ${brandName}` : ""}`,
    description: data.description ?? undefined,
    openGraph: {
      images: data.images?.[0] ? [data.images[0]] : [],
    },
  }
}

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select(`
      *,
      brand:brands(id, name, logo_url),
      category:categories(id, name, slug),
      variants:product_variants(*)
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  return data as Product | null
}

async function getRelatedProducts(categoryId: string, excludeId: string): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select(`*, brand:brands(id, name), variants:product_variants(*)`)
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .neq("id", excludeId)
    .limit(4)

  return (data as Product[]) ?? []
}

export const revalidate = 3600

export default async function ProductPage({ params }: PageProps) {
  const product = await getProduct(params.slug)
  if (!product) notFound()

  const relatedProducts = product.category_id
    ? await getRelatedProducts(product.category_id, product.id)
    : []

  return (
    <div className="container mx-auto px-4 md:px-8 py-10">
      <ProductDetailClient product={product} />

      {relatedProducts.length > 0 && (
        <section className="mt-24">
          <ScrollReveal>
            <h2 className="font-display text-4xl md:text-5xl tracking-widest mb-8">
              TAMBIÉN TE PUEDE GUSTAR
            </h2>
          </ScrollReveal>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  )
}
