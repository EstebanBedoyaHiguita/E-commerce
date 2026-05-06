"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

interface Props {
  productId: string
  productName: string
}

export function DeleteProductButton({ productId, productName }: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar "${productName}"? Esta acción no se puede deshacer.`)) return
    setDeleting(true)
    await fetch(`/api/admin/products/${productId}`, { method: "DELETE" })
    router.refresh()
    setDeleting(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-xs text-kult-fire hover:underline disabled:opacity-50"
    >
      {deleting ? "..." : "Eliminar"}
    </button>
  )
}
