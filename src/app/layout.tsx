import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Serif, Martian_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const martian = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://destinolibre.mx"),
  title: {
    default: "DestinoLibre · Travesías de autor y curaduría de viajes en México",
    template: "%s · DestinoLibre",
  },
  description:
    "Un taller editorial dedicado al arte de viajar por México. Filtramos, diseñamos y operamos rutas de autor: Pueblos Mágicos, naturaleza, costa, gastronomía y expediciones a la medida.",
  openGraph: {
    title: "DestinoLibre · Travesías diseñadas con intención y criterio",
    description:
      "Curaduría y producción de viajes por México. Elegimos, pulimos y articulamos cada itinerario para mentes inquisitivas.",
    url: "https://destinolibre.mx",
    siteName: "DestinoLibre",
    locale: "es_MX",
    type: "website",
  },
  // icons: {
  //   icon: "/icon.svg",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-MX"
      className={`${bricolage.variable} ${instrument.variable} ${martian.variable}`}
    >
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
