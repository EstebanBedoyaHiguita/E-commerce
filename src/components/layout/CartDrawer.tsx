"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { useCartStore } from "@/stores/cartStore"
import { buttonVariants } from "@/components/ui/button"
import { formatCOP, cn } from "@/lib/utils"

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice } =
    useCartStore()

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            key="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col"
            style={{ background: "var(--surface)", borderLeft: "1px solid var(--border)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5" />
                <span className="font-display text-xl tracking-widest">
                  CARRITO ({totalItems()})
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:text-kult-neon transition-colors"
                aria-label="Cerrar carrito"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
                  <ShoppingBag className="h-16 w-16 opacity-20" />
                  <p className="font-display text-2xl tracking-widest opacity-40">
                    TU CARRITO ESTÁ VACÍO
                  </p>
                  <Link href="/catalogo" onClick={closeCart} className={buttonVariants({ variant: "secondary", size: "sm" })}>Ver catálogo</Link>
                </div>
              ) : (
                <ul className="divide-y divide-[var(--border)]">
                  {items.map((item) => (
                    <li key={item.variantId} className="flex gap-4 p-4">
                      <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden bg-[var(--border)]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs uppercase tracking-widest" style={{ color: "var(--muted)" }}>
                          {item.brand}
                        </p>
                        <p className="font-semibold text-sm truncate">{item.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                          {item.size} · {item.color}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-[var(--border)]">
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              className="px-2 py-1 hover:text-kult-neon transition-colors"
                              aria-label="Reducir cantidad"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              className="px-2 py-1 hover:text-kult-neon transition-colors"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-display text-lg tracking-wider">
                              {formatCOP(item.price * item.quantity)}
                            </span>
                            <button
                              onClick={() => removeItem(item.variantId)}
                              className="p-1 hover:text-kult-fire transition-colors"
                              aria-label="Eliminar del carrito"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[var(--border)] space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm uppercase tracking-widest" style={{ color: "var(--muted)" }}>
                    Subtotal
                  </span>
                  <span className="font-display text-2xl tracking-wider">
                    {formatCOP(totalPrice())}
                  </span>
                </div>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Envío calculado en el checkout
                </p>
                <Link href="/checkout" onClick={closeCart} className={cn(buttonVariants({ size: "lg" }), "w-full text-center")}>Ir a pagar</Link>
                <Link href="/catalogo" onClick={closeCart} className={cn(buttonVariants({ variant: "ghost", size: "md" }), "w-full text-center")}>Seguir comprando</Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
