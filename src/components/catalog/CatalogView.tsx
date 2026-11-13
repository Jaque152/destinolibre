"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { TicketCard } from "@/components/site/TicketCard"; // Renombrado lógicamente a ProductCard en la UI
import { Reveal } from "@/components/site/Reveal";
import { CATEGORIES, PRODUCTS, getLocalizedProduct, type Category } from "@/lib/products";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

type Sort = "destacados" | "precio-asc" | "precio-desc" | "nombre";

const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function CatalogView({ initialCategory, initialQuery }: { initialCategory: string | null; initialQuery: string; }) {
  const { lang, dict } = useLanguage();
  const valid = CATEGORIES.includes(initialCategory as Category) ? (initialCategory as Category) : null;
  const [category, setCategory] = useState<Category | null>(valid);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<Sort>("destacados");

  const results = useMemo(() => {
    const q = normalize(query.trim());
    const list = PRODUCTS.filter((p) => (category ? p.category === category : true));
    let localizedList = list.map((p) => getLocalizedProduct(p, lang));
    if (q) localizedList = localizedList.filter((p) => normalize(`${p.title} ${p.short} ${p.region}`).includes(q));
    
    const sorted = [...localizedList];
    switch (sort) {
      case "precio-asc": sorted.sort((a, b) => a.price - b.price); break;
      case "precio-desc": sorted.sort((a, b) => b.price - a.price); break;
      case "nombre": sorted.sort((a, b) => a.short.localeCompare(b.short, lang === "en" ? "en" : "es")); break;
      default: sorted.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    }
    return sorted;
  }, [category, query, sort, lang]);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header Estricto */}
      <section className="bg-brand-slate-900 text-white pt-32 pb-16 px-6">
        <div className="container mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-sky mb-4">
            {dict.catalogView.eyebrow}
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
            {dict.catalogView.title} <span className="text-brand-orange">{dict.catalogView.titleEm}</span>
          </h1>
          <p className="max-w-2xl text-lg text-brand-slate-400 font-medium">
            {dict.catalogView.description}
          </p>
        </div>
      </section>

      {/* Barra de Filtros Técnica */}
      <div className="sticky top-20 z-30 bg-white border-b border-brand-slate-200">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row lg:items-center justify-between py-3 gap-4">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setCategory(null)}
              className={cn("px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors whitespace-nowrap", category === null ? "bg-brand-slate-900 text-white border-brand-slate-900" : "bg-transparent text-brand-slate-500 border-transparent hover:border-brand-slate-200")}
            >
              {dict.catalogView.all}
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn("px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors whitespace-nowrap", category === c ? "bg-brand-slate-900 text-white border-brand-slate-900" : "bg-transparent text-brand-slate-500 border-transparent hover:border-brand-slate-200")}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-full lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={dict.catalogView.searchPlaceholder}
                className="w-full bg-slate-100 border border-transparent focus:border-brand-sky px-10 py-2 text-sm text-brand-slate-900 outline-none transition-colors"
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-slate-400 hover:text-brand-orange">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value as Sort)}
              className="bg-transparent border-none text-sm font-bold text-brand-slate-900 uppercase tracking-widest outline-none cursor-pointer hover:text-brand-orange"
            >
              <option value="destacados">Relevancia</option>
              <option value="precio-asc">Menor Precio</option>
              <option value="precio-desc">Mayor Precio</option>
              <option value="nombre">A - Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Resultados */}
      <section className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-brand-slate-200">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-slate-400">
            Mostrando {results.length} resultados
          </p>
        </div>

        {results.length === 0 ? (
          <div className="py-32 text-center">
            <h3 className="text-3xl font-black text-brand-slate-900 mb-4">{dict.catalogView.noMatchesTitle}</h3>
            <p className="text-brand-slate-500 mb-8">{dict.catalogView.noMatchesText}</p>
            <button onClick={() => { setQuery(""); setCategory(null); }} className="bg-brand-slate-900 text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-brand-orange">
              {dict.catalogView.clearFilters}
            </button>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 4) * 50}>
                <TicketCard product={p} index={i} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* A la medida - Rediseño brutalista */}
      <section className="container mx-auto px-6 mt-16">
        <Reveal>
          <div className="bg-brand-slate-900 text-white p-12 lg:p-24 flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-l-8 border-brand-orange">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-sky mb-4">
                {dict.catalogView.customSectionEyebrow}
              </p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                {dict.catalogView.customSectionTitle} <span className="text-brand-orange">{dict.catalogView.customSectionTitleEm}</span>
              </h2>
            </div>
            <Link
              href="/contacto?interes=medida"
              className="inline-flex items-center gap-3 bg-white text-brand-slate-900 px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-brand-orange hover:text-white transition-colors"
            >
              {dict.catalogView.customSectionBtn} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}