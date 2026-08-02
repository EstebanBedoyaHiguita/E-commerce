"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { useCartStore } from "@/stores/cartStore"
import { buttonVariants } from "@/components/ui/button"
import { formatCOP, cn } from "@/lib/utils"

const FREE_SHIPPING_THRESHOLD = 180000

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

  const total = totalPrice()
  const missingForFreeShipping = FREE_SHIPPING_THRESHOLD - total

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
            className="fixed inset-0 bg-[#2A2320]/45 z-40 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            key="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col bg-[var(--background)] border-l border-[var(--border)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5" />
                <span className="font-display text-2xl font-light">
                  Tu bolsa ({totalItems()})
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:text-dralena-accent transition-colors"
                aria-label="Cerrar bolsa"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
                  <ShoppingBag className="h-16 w-16 opacity-20" />
                  <p className="font-display text-2xl font-light" style={{ color: "var(--muted)" }}>
                    Tu bolsa está vacía
                  </p>
                  <Link href="/catalogo" onClick={closeCart} className={buttonVariants({ variant: "secondary", size: "sm" })}>Ver catálogo</Link>
                </div>
              ) : (
                <ul className="divide-y divide-[#F2E9E6]">
                  {items.map((item) => (
                    <li key={item.variantId} className="flex gap-4 p-5">
                      <div className="relative h-[104px] w-[78px] flex-shrink-0 overflow-hidden bg-[var(--surface)]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: "#A99D97" }}>
                          {item.brand || "DRALENA"}
                        </p>
                        <p className="font-display text-lg truncate">{item.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                          {item.size} · {item.color}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-[#E0D0CC]">
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              className="px-2.5 py-1 hover:text-dralena-accent transition-colors"
                              aria-label="Reducir cantidad"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              className="px-2.5 py-1 hover:text-dralena-accent transition-colors"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-dralena-accent">
                              {formatCOP(item.price * item.quantity)}
                            </span>
                            <button
                              onClick={() => removeItem(item.variantId)}
                              className="p-1 hover:text-dralena-fire transition-colors"
                              aria-label="Eliminar de la bolsa"
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
              <div className="p-6 border-t border-[var(--border)] space-y-3.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-[11.5px] uppercase tracking-[0.16em]" style={{ color: "var(--muted)" }}>
                    Subtotal
                  </span>
                  <span className="font-display text-3xl font-light">{formatCOP(total)}</span>
                </div>
                {total >= FREE_SHIPPING_THRESHOLD ? (
                  <p className="text-xs text-dralena-accent">✦ Tu pedido tiene envío gratis</p>
                ) : (
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    Te faltan {formatCOP(missingForFreeShipping)} para envío gratis
                  </p>
                )}
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
