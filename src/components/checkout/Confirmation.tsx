"use client";

import Link from "next/link";
import { Check, ArrowRight, Compass, ShieldCheck, Mail, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateLong } from "@/lib/cart";
import { formatMXN } from "@/lib/products";
import { useLanguage } from "@/context/LanguageContext";

export interface Order {
  id: string;
  createdAt: string;
  customer: { name: string; email: string; phone: string };
  lines: { 
    slug: string; 
    code: string; 
    title: string; 
    date: string; 
    adults: number; 
    unitPrice: number; 
    lineTotal: number;
  }[];
  subtotal: number;
  discount: number;
  coupon: string | null;
  total: number;
  payment: {
    method: "card";
    status: "pagado" | "pendiente";
    brand?: string;
    last4?: string;
  };
}

export function Confirmation({ order }: { order: Order }) {
  const { lang, dict } = useLanguage();
  const isPaid = order.payment.status === "pagado";
  const firstName = order.customer.name.split(" ")[0];

  const paymentDetails = order.payment.brand && order.payment.last4 
    ? `${order.payment.brand} ···· ${order.payment.last4}` 
    : dict.confirmationView.defaultCard;

  return (
    <section className="container pb-28 pt-36 md:pt-48 bg-slate-50 min-h-screen text-slate-900">
      
      {/* Cabecera de éxito con animaciones */}
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 transition-transform duration-500 hover:scale-110">
          <Check className="h-10 w-10" strokeWidth={3} />
        </div>
        
        <div className="mt-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-mono text-xs uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" /> {isPaid ? dict.confirmationView.paidTitle : dict.confirmationView.pendingTitle}
        </div>
        
        <h1 className="mt-6 text-[clamp(2.8rem,7vw,5.5rem)] font-extrabold leading-[0.92] tracking-[-0.04em] text-slate-900">
          {dict.confirmationView.headlineTitle} <em className="font-serif italic font-normal text-brand-orange">{dict.confirmationView.headlineTitleEm}</em>!
        </h1>
        
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
          {dict.confirmationView.messagePrefix} <strong className="text-slate-900 font-semibold">{firstName}</strong>{dict.confirmationView.messageSuffixPaid}{" "}
          <span className="font-medium text-slate-900 underline decoration-brand-orange underline-offset-4">{order.customer.email}</span>{dict.confirmationView.messageConcierge}
        </p>
      </div>

      {/* Tarjeta de Recibo e Itinerario (Nuevo Layout Moderno) */}
      <div className="mx-auto mt-14 max-w-3xl">
        <div className="overflow-hidden rounded-[2.5rem] bg-white border border-slate-200 shadow-xl transition-all duration-300 hover:shadow-2xl">
          
          {/* Header del Comprobante */}
          <div className="bg-brand-slate-900 px-8 py-8 text-white flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-brand-sky font-bold">
                {dict.confirmationView.orderLabel || "Referencia de Orden"}
              </p>
              <p className="mt-1 font-mono text-xl font-bold tracking-wider text-white">{order.id}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-white/10 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-white border border-white/10 shadow-sm">
                {isPaid ? dict.confirmationView.statusPaid : dict.confirmationView.statusPending}
              </span>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-10">
            
            {/* Detalles del Pasajero y Pago */}
            <div className="grid gap-6 sm:grid-cols-3 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <Meta label={dict.confirmationView.passengerLabel} value={order.customer.name} />
              <Meta label={dict.confirmationView.paymentLabel} value={paymentDetails} />
              <Meta label="Teléfono de contacto" value={order.customer.phone || "No proporcionado"} />
            </div>

            {/* Lista de Experiencias */}
            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-4">Experiencias y Circuitos Reservados</h3>
              <ul className="divide-y divide-slate-100">
                {order.lines.map((l) => (
                  <li key={`${l.slug}-${l.date}`} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 transition-colors hover:bg-slate-50/50 px-2 rounded-xl">
                    <div className="flex items-start gap-4">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-orange/10 text-brand-orange mt-0.5">
                        <CalendarDays className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-bold text-base text-slate-900">{l.title}</p>
                        <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-slate-500">
                          {l.code} · {formatDateLong(l.date, lang)} · <strong className="text-slate-900">{l.adults}</strong> {l.adults === 1 ? dict.checkoutView.adultSingular : dict.checkoutView.adultPlural}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-lg text-slate-900 font-mono sm:text-right">{formatMXN(l.lineTotal)}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Totales y Desglose Financiero */}
            <div className="border-t border-slate-200 pt-6">
              <dl className="space-y-3 text-sm max-w-sm ml-auto">
                {order.discount > 0 && (
                  <div className="flex justify-between text-brand-orange font-medium">
                    <dt>{dict.cart.discount} {order.coupon && <span className="font-mono text-xs">({order.coupon})</span>}</dt>
                    <dd className="font-mono">−{formatMXN(order.discount)}</dd>
                  </div>
                )}
                <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
                  <dt className="font-bold text-slate-900 text-lg">{dict.cart.total}</dt>
                  <dd className="text-3xl font-extrabold tracking-tight text-slate-900 font-mono">{formatMXN(order.total)}</dd>
                </div>
              </dl>
            </div>

            {/* Banner Informativo / Próximo Paso */}
            <div className="relative overflow-hidden rounded-2xl bg-brand-sky/10 p-6 border border-brand-sky/20 flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-sky text-white shadow-sm mt-0.5">
                <Compass className="h-5 w-5" />
              </span>
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-brand-sky-600">
                  {dict.confirmationView.nextStepTitle || "Siguiente paso"}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">
                  {dict.confirmationView.nextStepText}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Botones de acción final */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="rounded-full px-8 h-14 bg-brand-orange text-white hover:bg-brand-orange-600 shadow-md transition-all duration-300 hover:scale-105">
            <Link href="/catalogo">
              {dict.confirmationView.continueExploring} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-14 bg-white border-slate-300 text-slate-900 hover:bg-slate-100 transition-all duration-300">
            <Link href="/">{dict.confirmationView.backHome}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Meta({ label, value, mono }: { label: string; value?: string; mono?: boolean }) {
  if (!value) return null;
  return (
    <div>
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className={mono ? "mt-1 font-mono font-semibold tracking-wider text-slate-900" : "mt-1 font-semibold text-slate-900 text-sm"}>
        {value}
      </p>
    </div>
  );
}
