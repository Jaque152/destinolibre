"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "./Logo";
import { CONTACT } from "@/lib/products";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { dict } = useLanguage();

  const SECTIONS = [
    { href: "/#metodo", label: dict.footer.sections === "Secciones" ? "El criterio" : "The Criterion" },
    { href: "/catalogo", label: dict.header.catalog },
    { href: "/#esencia", label: dict.header.aboutUs },
    { href: "/contacto", label: dict.common.startTrip },
  ];

  const LEGAL = [
    { href: "/legal/privacidad", label: dict.footer.privacy },
    { href: "/legal/terminos", label: dict.footer.terms },
    { href: "/legal/reembolsos", label: dict.footer.refunds },
  ];

  return (
    <footer className="bg-brand-slate-900 text-slate-50 pt-20">
      <div className="container px-6">
        <div className="grid lg:grid-cols-2 gap-16 pb-20 border-b border-slate-800">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
              {dict.footer.title} <span className="text-brand-orange">{dict.footer.titleEm}</span>.
            </h2>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-3 bg-brand-orange text-white px-8 py-4 rounded-sm text-sm font-bold tracking-wide hover:bg-orange-600 transition-colors"
            >
              {dict.common.startTrip} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <FooterCol title={dict.footer.sections} links={SECTIONS} />
            <FooterCol title={dict.footer.legal} links={LEGAL} />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">
                {dict.footer.contact}
              </p>
              <ul className="space-y-4 text-sm text-slate-300">
                <li><a href={CONTACT.phoneHref} className="hover:text-brand-sky">{CONTACT.phone}</a></li>
                <li><a href={`mailto:${CONTACT.email}`} className="break-all hover:text-brand-sky">{CONTACT.email}</a></li>
                <li className="text-slate-500">{CONTACT.city}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo tone="light" showDomain />
          
          <div className="flex flex-col md:flex-row items-center gap-6 text-xs font-medium text-slate-500">
            <span>© 2026 Destino Libre. Todos los derechos reservados.</span>
            
            {/* Logos conservados según requerimiento */}
            <div className="flex items-center gap-3">
              {/* Visa Logo SVG */}
              <div className="flex h-7 w-12 items-center justify-center rounded bg-white/10 px-1.5 py-1">
                <svg viewBox="0 0 38 12" className="h-full w-full fill-current text-blush/80" aria-label="Visa">
                  <path d="M14.12 0.35L9.12 11.65H5.85L3.38 2.82C3.21 2.14 2.89 1.93 2.31 1.64C1.3 1.13 0.28 0.77 0 0.71L0.12 0.35H5.06C5.7 0.35 6.27 0.79 6.42 1.54L7.6 7.64L10.63 0.35H14.12ZM26.4 8.01C26.41 5.01 22.11 4.85 22.15 3.33C22.17 2.86 22.61 2.37 23.58 2.25C24.08 2.18 25.46 2.13 26.91 2.81L27.52 0.53C26.74 0.24 25.72 0 24.47 0C21.2 0 18.91 1.76 18.89 4.23C18.87 6.01 20.44 6.99 21.63 7.57C22.86 8.17 23.27 8.56 23.26 9.11C23.24 9.96 22.28 10.32 21.39 10.34C19.9 10.37 18.99 9.94 18.3 9.64L17.65 11.97C18.41 12.31 19.81 12.65 21.31 12.64C24.73 12.64 26.39 10.95 26.4 8.01ZM34.2 11.65H37.33L34.61 0.35H31.78C31.22 0.35 30.74 0.69 30.53 1.21L26.06 11.65H29.53L30.22 9.71H34.45L34.2 11.65ZM31.18 7.42L32.84 3.03L33.78 7.42H31.18ZM18.42 0.35L15.42 11.65H12.38L15.38 0.35H18.42Z" />
                </svg>
              </div>
              {/* Mastercard Logo SVG */}
              <div className="flex h-7 w-12 items-center justify-center rounded bg-white/10 px-1.5 py-1">
                <svg viewBox="0 0 24 15" className="h-full w-full" aria-label="Mastercard">
                  <circle cx="9" cy="7.5" r="7" fill="#EB001B" />
                  <circle cx="15" cy="7.5" r="7" fill="#F79E1B" fillOpacity="0.8" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">{title}</p>
      <ul className="space-y-4 text-sm font-medium text-slate-300">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}