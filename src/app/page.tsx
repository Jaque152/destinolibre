"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { Reveal } from "@/components/site/Reveal";
import { TicketCard } from "@/components/site/TicketCard";
import { IMG } from "@/lib/images";
import { PRODUCTS } from "@/lib/products";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { dict } = useLanguage();
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4);

  const PRINCIPLES = [
    { n: "01.", title: dict.method.p1Title, text: dict.method.p1Text },
    { n: "02.", title: dict.method.p2Title, text: dict.method.p2Text },
    { n: "03.", title: dict.method.p3Title, text: dict.method.p3Text },
  ];

  return (
    <div className="bg-white">
      {/* El nuevo enganche masivo que incluye Hero + Manifiesto */}
      <Hero />

      {/* El Método (3 Columnas Limpias) */}
      <section id="metodo" className="container mx-auto px-6 py-24 md:py-32">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-4">
              {dict.method.eyebrow}
            </p>
            <h2 className="text-5xl md:text-6xl font-black text-brand-slate-900 tracking-tighter leading-none mb-6">
              {dict.method.title}
              <br className="hidden md:block" />
              <span className="text-brand-sky">{dict.method.titleEm}</span>
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-3 gap-8 md:gap-12">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.n} delay={i * 100} className="border-t-2 border-brand-slate-900 pt-6">
                <span className="font-mono text-lg font-bold text-brand-slate-900 block mb-4">{p.n}</span>
                <h3 className="text-xl font-bold text-brand-slate-900 mb-4">{p.title}</h3>
                <p className="text-sm text-brand-slate-600 leading-relaxed font-medium">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Travesías Seleccionadas */}
      <section className="bg-slate-50 py-24 md:py-32">
        <div className="container mx-auto px-6">
          <Reveal className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-4">
                {dict.board.eyebrow || "Exploración"}
              </p>
              <h2 className="text-4xl md:text-6xl font-black text-brand-slate-900 tracking-tighter">
                {dict.board.title || "Travesías"} <span className="text-brand-orange">{dict.board.titleEm || "seleccionadas"}</span>
              </h2>
            </div>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 border-b-2 border-brand-slate-900 pb-1 text-sm font-bold uppercase tracking-widest text-brand-slate-900 hover:text-brand-orange hover:border-brand-orange transition-colors"
            >
              Explorar Catálogo <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={i * 50}>
                <TicketCard product={p} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Relato de Viaje (Estilo Editorial 50/50) */}
      <section className="grid lg:grid-cols-2 h-auto min-h-[80vh]">
        <Reveal className="relative h-[50vh] lg:h-full bg-brand-slate-100 overflow-hidden">
          <img 
            src={IMG.hacienda} 
            alt="Ensayo fotográfico" 
            className="h-full w-full object-cover grayscale" 
          />
        </Reveal>

        <Reveal delay={120} className="flex flex-col justify-center p-12 md:p-20 lg:p-32 bg-[#0A111F] text-white">
          <p className="text-[0.65rem] font-bold uppercase tracking-widest text-brand-sky mb-6">
            Relatos de viaje
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-8">
            Yucatán bajo la <span className="text-brand-orange">penumbra</span>
          </h2>
          <div className="space-y-6 text-slate-300 text-sm md:text-base font-medium leading-relaxed max-w-xl">
            <p>
              Ocurre una pausa dorada, justo antes de que el sol domine la mañana, donde las estructuras coloniales del oriente parecen suspendidas en el tiempo. Las murallas conservan la frescura nocturna mientras la luz oblicua acentúa las formas con nitidez fotográfica.
            </p>
            <p>
              Concebimos esta travesía para vivirse a ritmo pausado: cenotes sagrados al amanecer, cuando el agua permanece mística y serena; tardes apacibles bajo arquerías históricas; y banquetes donde la cocina maya deja de ser folclor para volverse un poema al territorio.
            </p>
          </div>
          <Link
            href="/experiencia/ruta-maya-8-dias"
            className="mt-12 inline-flex items-center justify-center gap-4 bg-white text-[#0A111F] w-max px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand-orange hover:text-white transition-colors"
          >
            Leer ensayo completo <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>

      {/* CTA Final */}
      <section className="bg-[#0A111F] py-32 text-center border-t border-slate-800">
        <div className="container mx-auto px-6">
          <Reveal>
            <h2 className="mx-auto max-w-4xl text-[clamp(2.5rem,6vw,5.5rem)] font-black leading-tight tracking-tighter text-white">
              Creemos juntos un <br className="hidden md:block" />
              <span className="text-brand-orange">recorrido inolvidable.</span>
            </h2>
          </Reveal>
          <Reveal delay={150} className="mt-14 flex justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center gap-4 bg-brand-orange text-white px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-orange-600 transition-colors"
            >
              Diseñar viaje <ArrowRight className="h-5 w-5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}