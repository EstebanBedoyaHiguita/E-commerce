import Link from "next/link"
import { Globe, Share2, PlayCircle } from "lucide-react"

const footerLinks = {
  tienda: [
    { label: "Catálogo", href: "/catalogo" },
    { label: "Nuevos Ingresos", href: "/catalogo?orden=nuevos" },
    { label: "Marcas", href: "/marcas" },
    { label: "Ofertas", href: "/catalogo?oferta=true" },
  ],
  info: [
    { label: "Nosotros", href: "/nosotros" },
    { label: "Guía de tallas", href: "/tallas" },
    { label: "Cómo comprar", href: "/como-comprar" },
    { label: "Contacto", href: "/contacto" },
  ],
  legal: [
    { label: "Política de privacidad", href: "/privacidad" },
    { label: "Términos y condiciones", href: "/terminos" },
    { label: "Política de devoluciones", href: "/devoluciones" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] mt-24">
      {/* Newsletter */}
      <div className="border-b border-[var(--border)] py-12 px-4 md:px-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-4xl tracking-widest">ÚNETE AL MOVIMIENTO</h3>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              Novedades, drops exclusivos y descuentos directo a tu correo.
            </p>
          </div>
          <form className="flex w-full md:w-auto gap-0">
            <input
              type="email"
              placeholder="tu@email.com"
              className="h-12 px-4 bg-transparent border border-[var(--border)] focus:border-kult-neon focus:outline-none text-sm w-full md:w-72 transition-colors"
            />
            <button
              type="submit"
              className="h-12 px-6 bg-kult-neon text-kult-bg text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all flex-shrink-0"
            >
              Suscribir
            </button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="py-12 px-4 md:px-8">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="font-display text-4xl tracking-widest hover:text-kult-neon transition-colors">
              KULT
            </Link>
            <p className="text-xs mt-3 leading-relaxed" style={{ color: "var(--muted)" }}>
              Streetwear multimarca.<br />Colombia.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="p-2 hover:text-kult-neon transition-colors" aria-label="Instagram">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 hover:text-kult-neon transition-colors" aria-label="Twitter/X">
                <Share2 className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 hover:text-kult-neon transition-colors" aria-label="YouTube">
                <PlayCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold mb-4">Tienda</h4>
            <ul className="space-y-2">
              {footerLinks.tienda.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-kult-neon transition-colors" style={{ color: "var(--muted)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold mb-4">Información</h4>
            <ul className="space-y-2">
              {footerLinks.info.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-kult-neon transition-colors" style={{ color: "var(--muted)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-kult-neon transition-colors" style={{ color: "var(--muted)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--border)] py-4 px-4 md:px-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs" style={{ color: "var(--muted)" }}>
          <p>© {new Date().getFullYear()} KULT. Todos los derechos reservados.</p>
          <Link href="/admin/login" className="hover:text-kult-neon transition-colors">Admin</Link>
          <div className="flex items-center gap-4">
            <span>Métodos de pago:</span>
            <div className="flex gap-2 items-center font-semibold text-[var(--foreground)]">
              <span className="border border-[var(--border)] px-2 py-0.5 text-xs">BOLD</span>
              <span className="border border-[var(--border)] px-2 py-0.5 text-xs">CONTRAENTREGA</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
