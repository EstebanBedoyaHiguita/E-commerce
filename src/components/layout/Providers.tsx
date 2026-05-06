"use client"

import { CartDrawer } from "./CartDrawer"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CartDrawer />
    </>
  )
}
