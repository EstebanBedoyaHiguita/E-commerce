"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
} from "lucide-react"
import { useCartStore } from "@/stores/cartStore"
import { useWishlistStore } from "@/stores/wishlistStore"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/nosotros", label: "Nosotros" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { toggleCart, totalItems } = useCartStore()
  const { productIds } = useWishlistStore()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // En el home el navbar arranca encima del hero oscuro: ahí el texto va en claro
  const onDarkHero = pathname === "/" && !isScrolled

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-30 transition-all duration-300",
          isScrolled
            ? "bg-[var(--background)]/93 backdrop-blur-md border-b border-[var(--border)]"
            : "bg-transparent",
          onDarkHero && "text-[#FBF7F5]"
        )}
      >
        <nav className="container mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none hover:text-dralena-accent transition-colors">
            <span className="font-display text-2xl tracking-[0.34em] pl-[0.34em]">DRALENA</span>
            <span
              className={cn(
                "text-[8px] tracking-[0.42em] pl-[0.42em] mt-0.5",
                onDarkHero ? "text-[#FBF7F5]/70" : "text-dralena-muted"
              )}
            >
              LINGERIE
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-9">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-xs uppercase tracking-[0.14em] font-medium transition-colors duration-200 relative group",
                    pathname === link.href
                      ? onDarkHero
                        ? "text-[#F0BFC6]"
                        : "text-dralena-accent"
                      : onDarkHero
                      ? "hover:text-[#F0BFC6]"
                      : "hover:text-dralena-accent"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-px transition-all duration-300",
                      onDarkHero ? "bg-[#F0BFC6]" : "bg-dralena-accent",
                      pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            <Link href="/buscar" className="p-2 hover:text-dralena-accent transition-colors" aria-label="Buscar">
              <Search className="h-5 w-5" />
            </Link>

            <Link href="/wishlist" className="relative p-2 hover:text-dralena-accent transition-colors" aria-label="Lista de deseos">
              <Heart className="h-5 w-5" />
              {productIds.length > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-dralena-accent text-white text-[10px] font-semibold flex items-center justify-center">
                  {productIds.length}
                </span>
              )}
            </Link>

            <button
              onClick={toggleCart}
              className="relative p-2 hover:text-dralena-accent transition-colors"
              aria-label="Carrito de compras"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems() > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-dralena-ink text-[var(--background)] text-[10px] font-semibold flex items-center justify-center">
                  {totalItems()}
                </span>
              )}
            </button>

            <Link href="/perfil" className="p-2 hover:text-dralena-accent transition-colors hidden md:block" aria-label="Mi perfil">
              <User className="h-5 w-5" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="p-2 hover:text-dralena-accent transition-colors md:hidden"
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#2A2320]/45 backdrop-blur-sm z-20 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              key="mobile-menu"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-4/5 max-w-sm z-30 flex flex-col pt-20 md:hidden"
              style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}
            >
              <ul className="flex flex-col divide-y divide-[var(--border)]">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex px-6 py-4 font-display text-3xl font-light transition-colors",
                        pathname === link.href ? "text-dralena-accent" : "hover:text-dralena-accent"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/perfil" className="flex px-6 py-4 font-display text-3xl font-light hover:text-dralena-accent transition-colors">
                    Mi perfil
                  </Link>
                </li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
