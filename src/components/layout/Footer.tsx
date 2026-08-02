import Link from "next/link"
import { Globe, Share2, PlayCircle } from "lucide-react"

const footerLinks = {
  tienda: [
    { label: "Catálogo", href: "/catalogo" },
    { label: "Novedades", href: "/catalogo?orden=newest" },
    { label: "Colecciones", href: "/catalogo" },
    { label: "Ofertas", href: "/catalogo?oferta=true" },
  ],
  info: [
    { label: "Nosotras", href: "/nosotros" },
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
      <div className="border-b border-[#E3D2CE] py-14 px-4 md:px-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-[470px]">
            <h3 className="font-display text-3xl md:text-4xl font-light leading-tight">
              10% en tu primera compra
            </h3>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: "#7d6f6b" }}>
              Novedades, colecciones nuevas y descuentos directo a tu correo.
            </p>
          </div>
          <form className="flex w-full md:w-auto md:max-w-[490px] md:flex-1">
            <input
              type="email"
              placeholder="tu@correo.com"
              className="h-14 px-5 bg-[var(--background)] border border-[#DCC5C1] border-r-0 focus:border-dralena-accent focus:outline-none text-sm w-full md:w-72 transition-colors placeholder:text-[#B0A49E]"
            />
            <button
              type="submit"
              className="h-14 px-8 bg-dralena-ink text-[var(--background)] text-[11.5px] uppercase tracking-[0.16em] hover:bg-dralena-accent transition-colors flex-shrink-0"
            >
              Suscribir
            </button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="py-14 px-4 md:px-8">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <Link
              href="/"
              className="font-display text-2xl tracking-[0.34em] pl-[0.34em] hover:text-dralena-accent transition-colors"
            >
              DRALENA
            </Link>
            <p className="text-[13.5px] mt-4 leading-relaxed max-w-[280px]" style={{ color: "#8a7d78" }}>
              Lencería de encaje diseñada y confeccionada en Colombia.
            </p>
            <div className="flex gap-2.5 mt-5">
              <a
                href="#"
                className="h-9 w-9 rounded-full border border-[#D8C4C0] grid place-items-center hover:border-dralena-accent hover:text-dralena-accent transition-colors"
                aria-label="Instagram"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="h-9 w-9 rounded-full border border-[#D8C4C0] grid place-items-center hover:border-dralena-accent hover:text-dralena-accent transition-colors"
                aria-label="Twitter/X"
              >
                <Share2 className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="h-9 w-9 rounded-full border border-[#D8C4C0] grid place-items-center hover:border-dralena-accent hover:text-dralena-accent transition-colors"
                aria-label="YouTube"
              >
                <PlayCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[10.5px] uppercase tracking-[0.2em] font-semibold mb-5">Tienda</h4>
            <ul className="space-y-3">
              {footerLinks.tienda.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[13.5px] hover:text-dralena-accent transition-colors"
                    style={{ color: "#5c524d" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10.5px] uppercase tracking-[0.2em] font-semibold mb-5">Información</h4>
            <ul className="space-y-3">
              {footerLinks.info.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[13.5px] hover:text-dralena-accent transition-colors"
                    style={{ color: "#5c524d" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10.5px] uppercase tracking-[0.2em] font-semibold mb-5">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[13.5px] hover:text-dralena-accent transition-colors"
                    style={{ color: "#5c524d" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#E3D2CE] py-5 px-4 md:px-8">
        <div
          className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
          style={{ color: "var(--muted)" }}
        >
          <p>© {new Date().getFullYear()} DRALENA. Todos los derechos reservados.</p>
          <Link href="/admin/login" className="hover:text-dralena-accent transition-colors">
            Admin
          </Link>
          <div className="flex items-center gap-3">
            <span>Pagos seguros con</span>
            <span className="border border-[#D8C4C0] px-2.5 py-0.5 text-[11px] font-semibold text-dralena-ink">
              BOLD
            </span>
            <span className="text-[11px] text-[#A99D97]">Tarjeta · PSE · Nequi · Daviplata</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
