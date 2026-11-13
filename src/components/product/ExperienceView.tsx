"use client";

import Link from "next/link";
import { ArrowRight, Check, ChevronRight, X } from "lucide-react";
import { BookingWidget } from "@/components/product/BookingWidget";
import { TicketCard } from "@/components/site/TicketCard";
import { Reveal } from "@/components/site/Reveal";
import { formatMXN, getLocalizedProduct, type Product } from "@/lib/products";
import { useLanguage } from "@/context/LanguageContext";

export function ExperienceView({ product: rawProduct, related }: { product: Product; related: Product[] }) {
  const { lang, dict } = useLanguage();
  const product = getLocalizedProduct(rawProduct, lang);

  return (
    <div className="bg-white">
      {/* 1. Encabezado Editorial (Protegido del menú fijo con pt-32) */}
      <section className="container mx-auto px-6 pt-32 lg:pt-40 pb-12">
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-slate-400 mb-8">
          <Link href="/catalogo" className="hover:text-brand-orange transition-colors">Catálogo</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-brand-slate-900">{product.category}</span>
        </nav>
        
        <div className="max-w-5xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-brand-slate-900 leading-[0.95]">
            {product.title}
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-bold tracking-widest uppercase text-brand-slate-500">
            <span className="bg-brand-orange text-white px-3 py-1.5">{product.code}</span>
            <span className="text-brand-slate-900">{product.region}</span>
            <span className="text-brand-slate-300">•</span>
            <span>{product.duration}</span>
          </div>
        </div>
      </section>

      {/* 2. Imagen Principal (Limpia, sin texto superpuesto) */}
      <section className="container mx-auto px-6 mb-16 lg:mb-24">
        <Reveal>
          <div className="relative aspect-[4/3] md:aspect-video lg:aspect-[21/9] w-full bg-brand-slate-100 overflow-hidden border border-brand-slate-100 shadow-lg">
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-full object-cover" 
            />
          </div>
        </Reveal>
      </section>

      {/* 3. Contenido Principal y Sidebar */}
      <section className="container mx-auto px-6 pb-24 grid lg:grid-cols-[1fr_400px] gap-16 lg:gap-24">
        <div className="space-y-16">
          
          {/* Descripción */}
          <Reveal>
            <div className="relative border-l-4 border-brand-orange bg-slate-50/70 p-8 md:p-10 rounded-r-2xl shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-4">
                Sobre la travesía
              </p>
              
              <div className="space-y-6 text-base md:text-lg font-medium text-brand-slate-700 leading-relaxed text-justify">
                {product.summary.split("\n").filter(Boolean).map((paragraph, index) => {
                  // Si es el primer párrafo, le aplicamos el efecto de Letra Capital
                  if (index === 0) {
                    const firstLetter = paragraph.charAt(0);
                    const restOfText = paragraph.slice(1);
                    return (
                      <p key={index} className="first-letter:float-left first-letter:text-5xl first-letter:font-black first-letter:text-brand-orange first-letter:mr-3 first-letter:leading-none">
                        {firstLetter}{restOfText}
                      </p>
                    );
                  }
                  return <p key={index}>{paragraph}</p>;
                })}
              </div>
            </div>
          </Reveal>

          {/* Porque elegirlo */}
          {(product.why || product.special) && (
            <div className="grid sm:grid-cols-2 gap-12 border-t border-brand-slate-200 pt-16">
              {product.why && (
                <Reveal>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-brand-orange mb-4">
                    {dict.experiencePage.whyTitle} {dict.experiencePage.whyTitleEm}?
                  </h3>
                  <p className="text-brand-slate-600 leading-relaxed text-justify">{product.why}</p>
                </Reveal>
              )}
              {product.special && (
                <Reveal delay={100}>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-brand-sky mb-4">
                    {dict.experiencePage.specialTitle} {dict.experiencePage.specialTitleEm}?
                  </h3>
                  <p className="text-brand-slate-600 leading-relaxed text-justify">{product.special}</p>
                </Reveal>
              )}
            </div>
          )}

          {/* Qué Incluye / No Incluye */}
          {(product.includes?.length || product.excludes?.length) && (
            <Reveal className="border border-brand-slate-200 bg-slate-50 p-8 md:p-12 shadow-sm">
              <div className="grid md:grid-cols-2 gap-12">
                {product.includes && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-brand-slate-900 mb-6 border-b border-brand-slate-200 pb-2">Incluye</h3>
                    <ul className="space-y-4">
                      {product.includes.map((item) => (
                        <li key={item} className="flex gap-4 text-brand-slate-700 text-sm">
                          <Check className="h-5 w-5 text-brand-sky shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {product.excludes && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-brand-slate-900 mb-6 border-b border-brand-slate-200 pb-2">No Incluye</h3>
                    <ul className="space-y-4">
                      {product.excludes.map((item) => (
                        <li key={item} className="flex gap-4 text-brand-slate-500 text-sm">
                          <X className="h-5 w-5 text-slate-300 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Reveal>
          )}
        </div>

        {/* Sidebar Sticky (Widget de Reserva) */}
        <aside className="relative">
          {/* top-32 asegura que no choque con el header de navegación al hacer scroll */}
          <div className="sticky top-32">
            <BookingWidget product={product} />
          </div>
        </aside>
      </section>

      {/* 4. Módulo de Experiencias Relacionadas */}
      {related.length > 0 && (
        <section className="bg-brand-slate-900 py-24">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-brand-slate-800 pb-6">
              <h2 className="text-3xl font-black text-white tracking-tighter">
                Otras Experiencias <span className="text-brand-sky">Relacionadas</span>
              </h2>
              <Link href="/catalogo" className="text-xs font-bold uppercase tracking-widest text-brand-orange hover:text-white transition-colors">
                Ver Catálogo Completo
              </Link>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 100}>
                  <TicketCard product={p} index={i} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}