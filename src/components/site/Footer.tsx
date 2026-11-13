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
            <div className="flex items-center gap-2">
              {["Visa", "Mastercard"].map((p) => (
                <span key={p} className="px-3 py-1.5 border border-slate-700 rounded-sm text-[0.65rem] tracking-wider uppercase bg-slate-800 text-slate-300">
                  {p}
                </span>
              ))}
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