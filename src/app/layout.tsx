import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "UltraStore — Streetwear Multimarca",
    template: "%s | UltraStore",
  },
  description:
    "Tienda online de ropa urbana y streetwear. Jeans, camisetas y más de las mejores marcas.",
  keywords: ["streetwear", "ropa urbana", "jeans", "camisetas", "Colombia"],
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "UltraStore",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${bebasNeue.variable} ${dmSans.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  );
}
