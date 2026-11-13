"use client";

import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { IMG } from "@/lib/images";
import { useLanguage } from "@/context/LanguageContext";
import { Reveal } from "@/components/site/Reveal";

export function Hero() {
  const { lang, dict } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-white pb-20 pt-32 border-b border-brand-slate-100 lg:pt-40">
      
      {/* Geometría sutil de fondo para romper la monotonía del blanco */}
      <div className="pointer-events-none absolute right-0 top-0 -z-10 h-full w-1/3 -translate-y-10 translate-x-1/3 -skew-x-12 transform bg-slate-50/60" />

      <div className="container mx-auto px-6">
        
        {/* Fila 1: Etiqueta Superior con línea animada */}
        <Reveal>
          <div className="mb-12 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-brand-orange">
            <span className="h-px w-12 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] bg-brand-orange" />
            {dict.hero.eyebrow || "Experiencias de Autor · México"}
          </div>
        </Reveal>

        {/* Fila 2: Tipografía Gigante Escalonada + Descripción */}
        <div className="mb-20 grid items-end gap-12 lg:mb-28 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <h1 className="pb-4 text-[clamp(3.5rem,7.5vw,8.5rem)] font-black leading-[0.95] tracking-tighter text-brand-slate-900">
              <Reveal delay={100}><span className="block">{dict.hero.title1}</span></Reveal>
              <Reveal delay={200}><span className="block">{dict.hero.title2}</span></Reveal>
              <Reveal delay={300}>
                <span className="block text-brand-orange">
                  {/* Se elimina el punto final manual porque la variable ya lo incluye */}
                  {dict.hero.title3} {dict.hero.criterio}
                </span>
              </Reveal>
            </h1>
          </div>

          <div className="pb-4 lg:col-span-4">
            <Reveal delay={400} className="flex flex-col items-start gap-8">
              <p className="relative text-lg font-medium leading-relaxed text-brand-slate-600 md:text-xl">
                <span className="absolute -left-4 -top-4 font-serif text-4xl text-brand-slate-100">"</span>
                <span className="relative z-10">
                  {dict.hero.description || "Operamos como un taller de creación de viajes: elegimos, pulimos y producimos cada itinerario desde una visión crítica. Diseñado para mentes inquisitivas."}
                </span>
              </p>
              
              {/* Botón con efecto sombra sólida (Brutalismo moderno) */}
              <Link
                href="/catalogo"
                className="group inline-flex items-center gap-4 bg-brand-slate-900 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_#F97316] transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:bg-brand-orange hover:shadow-none"
              >
                Explorar Catálogo <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>

        {/* Fila 3: Manifiesto e Imagen con Sello Rotatorio */}
        <div className="relative">
          
          {/* Sello rotatorio superpuesto (Absolute) */}
          <Reveal delay={700} className="absolute -top-16 right-8 z-20 hidden md:block lg:-top-20 lg:right-16">
            <div className="relative h-32 w-32 animate-spin-slow rounded-full bg-white p-2 shadow-2xl lg:h-40 lg:w-40 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible fill-current text-brand-slate-900">
                <path
                  id="circlePath"
                  d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                  fill="none"
                />
                <text fontSize="9.5" fontWeight="900" letterSpacing="1.5" className="font-mono uppercase">
                  <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
                    {lang === "es" ? "DESTINO LIBRE • CURADURÍA • " : "DESTINO LIBRE • CURATION • "}
                  </textPath>
                </text>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Compass className="h-8 w-8 text-brand-orange" strokeWidth={1.5} />
              </div>
            </div>
          </Reveal>
          {/* Caja contenedora Grid */}
          <div className="grid items-stretch border border-brand-slate-100 shadow-2xl lg:grid-cols-12">
            
            {/* Caja de Texto (Manifiesto) */}
            <Reveal delay={500} className="relative flex flex-col justify-center overflow-hidden border-b border-brand-slate-100 bg-slate-50 p-10 lg:col-span-5 lg:border-b-0 lg:border-r lg:p-16">
              <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full border border-brand-slate-200 opacity-50" />
              <h2 className="relative z-10 text-[clamp(1.25rem,2vw,1.75rem)] font-medium leading-[1.4] tracking-tight text-brand-slate-900">
                {dict.look.text1 || "México no solo se visita, se"}{" "}
                <span className="font-bold text-brand-sky">{dict.look.text1Em || "interpreta"}</span>.
                <br /><br />
                {dict.look.text2 || "Cada paraje posee su propio lenguaje:"} el destello de luz sobre Oaxaca, la serenidad de una vieja finca en Yucatán o la propuesta de un chef que rinde tributo a sus raíces.{" "}
                <span className="mt-2 inline-block border-b-2 border-brand-orange pb-0.5 font-black text-brand-slate-900">Destino Libre</span>{" "}
                {dict.look.text3 || "nace para interpretar este vasto territorio y transformarlo en travesías memorables, con el compromiso absoluto de guardar"}{" "}
                <span className="font-bold text-brand-slate-900">{dict.look.criterioEm || "excelencia"}</span>.
              </h2>
            </Reveal>

            {/* Imagen Fotográfica (con animación de zoom lento al hover) */}
            <Reveal delay={600} className="group min-h-[400px] overflow-hidden bg-brand-slate-100 lg:col-span-7 lg:h-auto">
              <img 
                src={IMG.teotihuacanBalloons} 
                alt="Experiencia Destino Libre" 
                className="h-full w-full object-cover transition-transform duration-[2500ms] ease-out group-hover:scale-105"
              />
            </Reveal>

          </div>
        </div>
        
      </div>
    </section>
  );
}