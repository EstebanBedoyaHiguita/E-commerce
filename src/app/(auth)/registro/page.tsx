"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const schema = z.object({
  full_name: z.string().min(2, "Nombre demasiado corto"),
  phone: z.string().min(7, "Teléfono inválido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
  message: "Las contraseñas no coinciden",
  path: ["confirm"],
})

type FormData = z.infer<typeof schema>

export default function RegistroPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setError(null)
    const supabase = createClient()

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    // Create profile
    if (authData.user) {
      await supabase.from("profiles").upsert({
        id: authData.user.id,
        full_name: data.full_name,
        phone: data.phone,
      })
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-kult-neon font-display text-6xl mb-4">✓</div>
          <h2 className="font-display text-3xl tracking-widest mb-2">¡CUENTA CREADA!</h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Revisa tu email para confirmar tu cuenta y poder iniciar sesión.
          </p>
          <Link href="/login" className="block mt-6 text-kult-neon underline text-sm">
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[var(--background)]">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <Link href="/" className="font-display text-5xl tracking-widest hover:text-kult-neon transition-colors">
            KULT
          </Link>
          <h1 className="font-display text-3xl tracking-widest mt-4">CREAR CUENTA</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Nombre completo" placeholder="Tu nombre" error={errors.full_name?.message} {...register("full_name")} />
          <Input label="Teléfono / WhatsApp" type="tel" placeholder="+57 300 000 0000" error={errors.phone?.message} hint="Lo usaremos para notificarte sobre tus pedidos" {...register("phone")} />
          <Input label="Email" type="email" placeholder="tu@email.com" error={errors.email?.message} {...register("email")} />
          <Input label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" error={errors.password?.message} {...register("password")} />
          <Input label="Confirmar contraseña" type="password" placeholder="Repite tu contraseña" error={errors.confirm?.message} {...register("confirm")} />

          {error && <p className="text-sm text-kult-fire">{error}</p>}

          <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
            Crear cuenta
          </Button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "var(--muted)" }}>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-kult-neon font-semibold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
