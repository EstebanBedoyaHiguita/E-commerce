"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { generateSKU, slugify } from "@/lib/utils"

const variantSchema = z.object({
  size: z.string().min(1),
  color: z.string().min(1),
  color_hex: z.string().optional(),
  stock: z.coerce.number().min(0),
  price_override: z.coerce.number().optional(),
})

const schema = z.object({
  reference: z.string().min(2, "Referencia requerida"),
  name: z.string().min(2, "Nombre requerido"),
  description: z.string().optional(),
  brand_id: z.string().min(1, "Selecciona una colección"),
  category_id: z.string().min(1, "Selecciona una categoría"),
  base_price: z.coerce.number().min(1, "El precio debe ser mayor a 0"),
  gender: z.enum(["hombre", "mujer", "unisex"]).default("mujer"),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  variants: z.array(variantSchema).min(1, "Agrega al menos una variante"),
})

// Sugerencias para las variantes: `size` y `color` siguen siendo texto libre,
// pero el datalist evita que se creen tallas/colores que el filtro del catálogo no reconoce
const SIZE_OPTIONS = [
  "6", "8", "10", "12", "14", "16",
  "32A", "32B", "34A", "34B", "34C", "36B", "36C", "36D", "38C", "38D", "40D", "40DD", "42DD",
]
const COLOR_OPTIONS = ["Negro", "Blanco", "Rojo", "Rosado", "Verde", "Beige", "Marfil", "Nude"]

type FormData = z.infer<typeof schema>

interface ProductFormProps {
  brands: { id: string; name: string }[]
  categories: { id: string; name: string }[]
  initialData?: Partial<FormData> & { id?: string; images?: string[]; gender?: "hombre" | "mujer" | "unisex" }
}

export function ProductForm({ brands, categories, initialData }: ProductFormProps) {
  const router = useRouter()
  const [images, setImages] = useState<string[]>(initialData?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, watch, control, formState: { errors, isSubmitting } } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      reference: initialData?.reference ?? "",
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      brand_id: initialData?.brand_id ?? "",
      category_id: initialData?.category_id ?? "",
      base_price: initialData?.base_price ?? 0,
      gender: initialData?.gender ?? "mujer",
      is_active: initialData?.is_active ?? true,
      is_featured: initialData?.is_featured ?? false,
      variants: initialData?.variants ?? [{ size: "10", color: "Marfil", color_hex: "#F2EAE0", stock: 10, price_override: undefined }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: "variants" })
  const reference = watch("reference")

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)

    const uploadedUrls: string[] = []
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
      if (res.ok) {
        const { url } = await res.json()
        uploadedUrls.push(url)
      }
    }

    setImages((prev) => [...prev, ...uploadedUrls])
    setUploading(false)
  }

  const onSubmit = async (data: FormData) => {
    setError(null)
    const slug = slugify(data.name)
    const variantsWithSku = data.variants.map((v) => ({
      ...v,
      sku: generateSKU(data.reference, v.size, v.color),
    }))

    const method = initialData?.id ? "PATCH" : "POST"
    const url = initialData?.id ? `/api/admin/products/${initialData.id}` : "/api/admin/products"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, slug, images, variants: variantsWithSku }),
    })

    if (!res.ok) {
      setError("Error al guardar el producto")
      return
    }

    router.push("/admin/productos")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic info */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-light border-b border-dralena-border pb-3">INFORMACIÓN BÁSICA</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Referencia (única)" placeholder="DRL-ALN-001" error={errors.reference?.message} {...register("reference")} />
          <Input label="Precio base (COP)" type="number" placeholder="89900" error={errors.base_price?.message} {...register("base_price")} />
        </div>
        <Input label="Nombre del producto" error={errors.name?.message} {...register("name")} />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: "var(--muted)" }}>Colección</label>
            <select className="w-full h-12 px-4 bg-transparent border border-dralena-border text-sm focus:outline-none focus:border-dralena-accent [&>option]:text-black" {...register("brand_id")}>
              <option value="">Selecciona colección</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            {errors.brand_id && <p className="text-xs text-dralena-fire mt-1">{errors.brand_id.message}</p>}
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: "var(--muted)" }}>Categoría</label>
            <select className="w-full h-12 px-4 bg-transparent border border-dralena-border text-sm focus:outline-none focus:border-dralena-accent [&>option]:text-black" {...register("category_id")}>
              <option value="">Selecciona categoría</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.category_id && <p className="text-xs text-dralena-fire mt-1">{errors.category_id.message}</p>}
          </div>
          <input type="hidden" {...register("gender")} />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: "var(--muted)" }}>Descripción</label>
          <textarea
            className="w-full px-4 py-3 bg-transparent border border-dralena-border text-sm focus:outline-none focus:border-dralena-accent resize-none"
            rows={4}
            {...register("description")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="accent-dralena-accent" {...register("is_active")} />
            Producto activo (visible en tienda)
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="accent-dralena-accent" {...register("is_featured")} />
            Producto destacado (aparece en sección Destacados del home)
          </label>
        </div>
      </section>

      {/* Images */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-light border-b border-dralena-border pb-3">IMÁGENES</h2>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-dralena-border hover:border-dralena-accent cursor-pointer py-8 transition-colors">
          <Upload className="h-8 w-8 mb-2" style={{ color: "var(--muted)" }} />
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            {uploading ? "Subiendo..." : "Haz clic o arrastra imágenes aquí"}
          </span>
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
        </label>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {images.map((url, i) => (
              <div key={i} className="relative h-20 w-16 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => setImages((p) => p.filter((_, j) => j !== i))}
                  className="absolute top-0.5 right-0.5 p-0.5 bg-dralena-fire text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-light border-b border-dralena-border pb-3">VARIANTES (TALLA + COLOR)</h2>
        <datalist id="opciones-talla">
          {SIZE_OPTIONS.map((s) => <option key={s} value={s} />)}
        </datalist>
        <datalist id="opciones-color">
          {COLOR_OPTIONS.map((c) => <option key={c} value={c} />)}
        </datalist>
        {errors.variants?.root && <p className="text-xs text-dralena-fire">{errors.variants.root.message}</p>}

        <div className="space-y-3">
          {fields.map((field, i) => {
            const size = watch(`variants.${i}.size`)
            const color = watch(`variants.${i}.color`)
            const sku = reference && size && color ? generateSKU(reference, size, color) : "—"

            return (
              <div key={field.id} className="border border-dralena-border p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono" style={{ color: "var(--muted)" }}>SKU: {sku}</span>
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(i)} className="p-1 hover:text-dralena-fire transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <Input label="Talla" placeholder="10 o 34B" list="opciones-talla" {...register(`variants.${i}.size`)} />
                  <Input label="Color" placeholder="Negro" list="opciones-color" {...register(`variants.${i}.color`)} />
                  <Input label="Hex" type="color" {...register(`variants.${i}.color_hex`)} />
                  <Input label="Stock" type="number" min="0" {...register(`variants.${i}.stock`)} />
                  <Input label="Precio override" type="number" placeholder="Opcional" {...register(`variants.${i}.price_override`)} />
                </div>
              </div>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => append({ size: "", color: "", color_hex: "#000000", stock: 0, price_override: undefined })}
          className="flex items-center gap-2 text-sm hover:text-dralena-accent transition-colors"
          style={{ color: "var(--muted)" }}
        >
          <Plus className="h-4 w-4" /> Agregar variante
        </button>
      </section>

      {error && <p className="text-sm text-dralena-fire">{error}</p>}

      <div className="flex gap-4">
        <Button type="button" variant="ghost" size="lg" onClick={() => router.back()}>Cancelar</Button>
        <Button type="submit" size="lg" loading={isSubmitting}>
          {initialData?.id ? "Guardar cambios" : "Crear producto"}
        </Button>
      </div>
    </form>
  )
}
