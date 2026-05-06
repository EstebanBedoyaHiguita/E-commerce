import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Providers } from "@/components/layout/Providers"

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <Navbar />
      <main className="min-h-screen pt-16 md:pt-20">{children}</main>
      <Footer />
    </Providers>
  )
}
