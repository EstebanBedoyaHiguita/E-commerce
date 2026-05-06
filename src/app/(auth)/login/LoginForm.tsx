"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
})

type FormData = z.infer<typeof schema>

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") ?? "/perfil"
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setError(null)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (authError) {
      setError("Email o contraseña incorrectos")
      return
    }
    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--background)]">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <Link href="/" className="font-display text-5xl tracking-widest hover:text-kult-neon transition-colors">
            KULT
          </Link>
          <h1 className="font-display text-3xl tracking-widest mt-4">INICIAR SESIÓN</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />

          {error && <p className="text-sm text-kult-fire">{error}</p>}

          <div className="text-right">
            <Link
              href="/recuperar-contrasena"
              className="text-xs hover:text-kult-neon transition-colors"
              style={{ color: "var(--muted)" }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
            Ingresar
          </Button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "var(--muted)" }}>
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="text-kult-neon font-semibold hover:underline">
            Regístrate
          </Link>
        </p>

        <div className="mt-8 pt-8 border-t border-[var(--border)] text-center">
          <Link
            href="/checkout"
            className="text-xs hover:text-kult-neon transition-colors"
            style={{ color: "var(--muted)" }}
          >
            Continuar como invitado →
          </Link>
        </div>
      </div>
    </div>
  )
}
