"use client";

import Link from "next/link";
import { ArrowUpRight, Mail, MapPinned, BriefcaseBusiness, Phone, Sparkles } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal } from "@/components/site/Reveal";
import { IMG } from "@/lib/images";
import { CONTACT } from "@/lib/products";
import { useLanguage } from "@/context/LanguageContext";

export function ContactView({ initialInteres }: { initialInteres?: string }) {
  const { dict } = useLanguage();

  const preset =
    initialInteres === "medida"
      ? dict.contactView.interests[0]
      : initialInteres === "catalogo"
        ? dict.contactView.interests[1]
        : undefined;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Hero Luminoso con Acentos Naranja y Cielo */}
      <section className="relative pb-24 pt-36 md:pb-36 md:pt-48 bg-white border-b border-slate-200">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-orange/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-brand-sky/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container relative z-10 grid items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-mono text-xs uppercase tracking-widest animate-rise">
              <Sparkles className="w-3.5 h-3.5" /> {dict.contactPage.heroEyebrow}
            </div>
            <h1 className="mt-6 animate-rise text-[clamp(3.5rem,9vw,8rem)] font-extrabold leading-[0.82] tracking-[-0.05em] text-brand-slate-900">
              {dict.contactPage.heroTitle} <em className="font-serif italic font-normal text-brand-orange">{dict.contactPage.heroTitleEm}</em>.
            </h1>
            <p className="mt-8 max-w-xl animate-rise text-xl leading-relaxed text-slate-600 [animation-delay:200ms]">
              {dict.contactPage.heroSubtitle}
            </p>
          </div>

          <div className="relative hidden lg:col-span-5 lg:grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              <div className="arch relative h-60 w-full overflow-hidden border-2 border-slate-200 shadow-xl transition-transform duration-700 hover:scale-105">
                <img src={IMG.pinkWall} alt="" className="h-full w-full object-cover" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="arch relative h-40 w-full overflow-hidden border-2 border-slate-200 shadow-xl transition-transform duration-700 hover:scale-105">
                <img src={IMG.papelPicado} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="arch relative h-52 w-full overflow-hidden border-2 border-slate-200 shadow-xl transition-transform duration-700 hover:scale-105">
                <img src={IMG.oaxaca} alt="" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Principal con Fondo Claro y Contraste Ejecutivo */}
      <section className="container relative z-20 py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          
          {/* Formulario */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="mb-8 p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm">
                <span className="font-mono text-xs uppercase tracking-widest text-brand-orange">{dict.contactPage.startConvEyebrow}</span>
                <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                  {dict.contactPage.startConvTitle} <em className="font-serif italic text-brand-orange">{dict.contactPage.startConvTitleEm}</em>.
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {dict.contactPage.startConvDesc}
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="p-2 rounded-[3rem] bg-white border border-slate-200 shadow-xl">
                <ContactForm preset={preset} />
              </div>
            </Reveal>
          </div>

          {/* Tarjetas de Información Directa */}
          <aside className="space-y-6 lg:col-span-5">
            <Reveal>
              <div className="p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm">
                <span className="font-mono text-xs uppercase tracking-widest text-brand-sky">{dict.contactPage.directContactEyebrow}</span>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
                  {dict.contactPage.conciergeTitle} <em className="font-serif italic text-brand-sky">{dict.contactPage.conciergeTitleEm}</em>.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {dict.contactPage.conciergeDesc}
                </p>
              </div>
            </Reveal>

            <div className="space-y-4">
              <Reveal delay={80}>
                <InfoCard
                  href={CONTACT.phoneHref}
                  icon={<Phone className="h-5 w-5" />}
                  label={dict.contactPage.phoneLabel}
                  value={CONTACT.phone}
                  meta={dict.contactPage.phoneMeta}
                />
              </Reveal>
              <Reveal delay={140}>
                <InfoCard
                  href={`mailto:${CONTACT.email}`}
                  icon={<Mail className="h-5 w-5" />}
                  label={dict.contactPage.emailLabel}
                  value={CONTACT.email}
                  meta={dict.contactPage.emailMeta}
                />
              </Reveal>
              <Reveal delay={200}>
                <InfoCard
                  icon={<MapPinned className="h-5 w-5" />}
                  label={dict.contactPage.locationLabel}
                  value={dict.contactPage.locationValue}
                  meta={dict.contactPage.locationMeta}
                />
              </Reveal>
              <Reveal delay={220}>
                <InfoCard
                  icon={<BriefcaseBusiness className="h-5 w-5" />}
                  label={dict.contactPage.officeLabel}
                  value={dict.contactPage.officeValue}
                  meta={dict.contactPage.officeMeta}
                />
              </Reveal>
            </div>

            <Reveal delay={260}>
              <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-slate-900 p-8 text-white shadow-xl">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-orange/20 rounded-full blur-2xl pointer-events-none" />
                <p className="text-xl font-semibold leading-snug tracking-tight relative z-10">
                  &ldquo;{dict.contactPage.quoteText}{" "}
                  <em className="font-serif italic text-brand-orange">{dict.contactPage.quoteEm}</em>.&rdquo;
                </p>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <Link
                href="/pago-folio"
                className="group flex h-16 w-full items-center justify-between rounded-[2rem] bg-brand-orange px-8 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-brand-orange-600 shadow-md"
              >
                <span>{dict.contactPage.folioBtn || "Pagar un folio a la medida"}</span>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white/20 transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="h-5 w-5 text-white" />
                </span>
              </Link>
            </Reveal>
          </aside>

        </div>
      </section>

      {/* CTA Final */}
      <section className="container pb-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-[3rem] bg-brand-slate-900 p-10 md:p-16 text-white shadow-2xl">
            <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-brand-orange/20 blur-3xl pointer-events-none" />
            <div className="relative z-10 grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest font-bold text-brand-sky">{dict.contactPage.ctaEyebrow}</span>
                <h2 className="mt-2 text-[clamp(2.4rem,5vw,4.2rem)] font-extrabold leading-[0.95] tracking-[-0.05em] text-white">
                  {dict.contactPage.ctaTitle} <em className="font-serif italic font-normal text-brand-orange">{dict.contactPage.ctaTitleEm}</em>.
                </h2>
              </div>
              <div className="space-y-6">
                <p className="text-lg leading-relaxed font-medium text-slate-300">
                  {dict.contactPage.ctaDesc}
                </p>
                <Link
                  href="/catalogo"
                  className="group inline-flex h-14 items-center gap-3 rounded-full bg-brand-orange pl-8 pr-3 font-semibold text-white transition-all duration-300 hover:bg-brand-orange-600 hover:scale-105 shadow-xl"
                >
                  {dict.contactPage.ctaBtn}
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-brand-orange transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function InfoCard({
  href,
  icon,
  label,
  value,
  meta,
}: {
  href?: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  meta: string;
}) {
  const inner = (
    <>
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-100 text-brand-orange transition-colors group-hover:bg-brand-orange group-hover:text-white shadow-sm">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[0.65rem] uppercase tracking-[0.18em] text-slate-500">{label}</span>
        <strong className="mt-1 block break-words text-lg tracking-tight text-slate-900">{value}</strong>
        <span className="mt-0.5 block text-xs text-slate-500">{meta}</span>
      </span>
      {href && (
        <ArrowUpRight className="h-5 w-5 shrink-0 text-slate-400 transition-all duration-300 group-hover:rotate-45 group-hover:text-brand-orange" />
      )}
    </>
  );
  const cls =
    "group flex items-center gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-brand-orange hover:shadow-md hover:scale-[1.01]";
  return href ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}