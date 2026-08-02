import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DRALENA — Lencería femenina",
    template: "%s | DRALENA",
  },
  description:
    "Lencería de encaje diseñada y confeccionada en Colombia. Envío discreto a todo el país.",
  keywords: ["lencería", "encaje", "conjuntos", "brasier", "Colombia"],
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "DRALENA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${cormorant.variable} ${jost.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  );
}
