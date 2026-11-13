"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Loader2, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDateLong, useCart } from "@/lib/cart";
import { formatMXN } from "@/lib/products";
import { cn } from "@/lib/utils";
import { Confirmation, type Order } from "./Confirmation";
import { useLanguage } from "@/context/LanguageContext";

type Method = "card";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  needsInvoice: boolean;
  rfc: string;
  razonSocial: string;
  cp: string;
  usoCfdi: string;
  method: Method;
  cardNumber: string;
  cardName: string;
  cardExp: string;
  cardCvc: string;
  acceptTerms: boolean;
  ciudad: string;
  direccion: string;
  pais: string;
}

const INITIAL: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  notes: "",
  needsInvoice: false,
  rfc: "",
  razonSocial: "",
  cp: "",
  usoCfdi: "G03",
  method: "card",
  cardNumber: "",
  cardName: "",
  cardExp: "",
  cardCvc: "",
  acceptTerms: false,
  ciudad: "",
  direccion: "",
  pais: "",
};

type Errors = Partial<Record<keyof FormState, string>>;

const cardBrand = (num: string) => {
  const n = num.replace(/\D/g, "");
  if (/^4/.test(n)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "Mastercard";
  return null;
};

const luhn = (num: string) => {
  const n = num.replace(/\D/g, "");
  let sum = 0;
  let alt = false;
  for (let i = n.length - 1; i >= 0; i--) {
    let d = Number.parseInt(n[i], 10);
    if (alt) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    alt = !alt;
  }
  return n.length >= 13 && sum % 10 === 0;
};

const formatCard = (v: string) => {
  const n = v.replace(/\D/g, "");
  if (/^3[47]/.test(n)) {
    const s = n.slice(0, 15);
    return [s.slice(0, 4), s.slice(4, 10), s.slice(10)].filter(Boolean).join(" ");
  }
  return n
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
};

const formatExp = (v: string) => {
  const n = v.replace(/\D/g, "").slice(0, 4);
  if (n.length <= 2) return n;
  return `${n.slice(0, 2)}/${n.slice(2)}`;
};

export function CheckoutView() {
  const { lang, dict } = useLanguage();
  const { lines, hydrated, subtotal, discount, total, coupon, clear } = useCart();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (order) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [order]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const brand = useMemo(() => cardBrand(form.cardNumber), [form.cardNumber]);

  const validate = (f: FormState): Errors => {
    const e: Errors = {};
    if (!f.firstName.trim()) e.firstName = dict.checkoutView.errors.firstName;
    if (!f.lastName.trim()) e.lastName = dict.checkoutView.errors.lastName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = dict.checkoutView.errors.email;
    if (f.phone.replace(/\D/g, "").length < 10) e.phone = dict.checkoutView.errors.phone;
    if (f.needsInvoice) {
      if (!/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i.test(f.rfc.trim())) e.rfc = dict.checkoutView.errors.rfc;
      if (!f.razonSocial.trim()) e.razonSocial = dict.checkoutView.errors.razonSocial;
      if (!/^\d{5}$/.test(f.cp.trim())) e.cp = dict.checkoutView.errors.cp;
    }
    if (f.method === "card") {
      if (!luhn(f.cardNumber)) e.cardNumber = dict.checkoutView.errors.cardNumber;
      if (!f.cardName.trim()) e.cardName = dict.checkoutView.errors.cardName;
      const [mm, yy] = f.cardExp.split("/");
      const month = Number(mm);
      const year = 2000 + Number(yy);
      const now = new Date();
      const expired = year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1);
      if (!mm || !yy || yy.length !== 2 || month < 1 || month > 12 || expired) e.cardExp = dict.checkoutView.errors.cardExp;
      if (!/^\d{3,4}$/.test(f.cardCvc)) e.cardCvc = dict.checkoutView.errors.cardCvc;
    }
    if (!f.acceptTerms) e.acceptTerms = dict.checkoutView.errors.acceptTerms;
    return e;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate(form);
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      document.getElementById(`f-${first}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      toast.error("Revisa los campos marcados");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang,
          items: lines.map((l) => ({ 
            slug: l.slug, 
            date: l.date, 
            adults: l.adults,
            unitPrice: l.product.price
          })),
          coupon,
          customer: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            notes: form.notes,
          },
          invoice: form.needsInvoice
            ? { rfc: form.rfc.toUpperCase(), razonSocial: form.razonSocial, cp: form.cp, usoCfdi: form.usoCfdi }
            : null,
          payment: {
            method: form.method,
            brand: brand ?? undefined,
            last4: form.method === "card" ? form.cardNumber.replace(/\D/g, "").slice(-4) : undefined,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "No pudimos procesar tu pago.");
      setOrder(data.order as Order);
      clear();
    } catch (err) {
      toast.error("No se pudo completar el pago", {
        description: err instanceof Error ? err.message : "Intenta de nuevo en unos minutos.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (order) return <Confirmation order={order} />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-32 pt-36 md:pt-48">
      <div className="container relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-mono text-xs uppercase tracking-widest mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Transacción 100% Cifrada
            </div>
            <h1 className="text-[clamp(3rem,7vw,6rem)] font-extrabold leading-[0.88] tracking-[-0.05em] text-slate-900">
              {dict.checkoutView.title} <em className="font-serif italic font-normal text-brand-orange">{dict.checkoutView.titleEm}</em>
            </h1>
          </div>
          <Link
            href="/carrito"
            className="inline-flex items-center gap-2 font-semibold text-slate-600 underline decoration-brand-orange decoration-2 underline-offset-[6px] hover:text-brand-orange transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> {dict.checkoutView.backToCart}
          </Link>
        </div>

        <div className="mb-12">
          <Steps current={hydrated && lines.length > 0 ? 2 : 1} />
        </div>

        {!hydrated ? (
          <div className="mt-12 h-96 animate-pulse rounded-[2.5rem] bg-white border border-slate-200" />
        ) : lines.length === 0 ? (
          <div className="mt-12 rounded-[2.5rem] bg-white p-12 text-center border border-slate-200 shadow-sm md:p-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              {dict.checkoutView.emptyTitle} <em className="font-serif italic text-brand-orange">{dict.checkoutView.emptyTitleEm}</em>
            </h2>
            <p className="mx-auto mt-3 max-w-md text-slate-600">{dict.checkoutView.emptyText}</p>
            <Button asChild size="lg" className="mt-6 rounded-full px-8 bg-brand-orange text-white hover:bg-brand-orange-600 shadow-md">
              <Link href="/catalogo">{dict.common.exploreCatalog}</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="grid gap-10 lg:grid-cols-12 lg:items-start">
            
            {/* Formulario Izquierda */}
            <div className="space-y-8 lg:col-span-7 xl:col-span-8">
              
              <Block n="01" title={dict.checkoutView.paymentBlockTitle} subtitle={dict.checkoutView.paymentBlockSub}>
                {form.method === "card" && (
                  <div className="mt-6 grid gap-6 md:grid-cols-[1fr_260px]">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field id="cardNumber" label={dict.checkoutView.cardNumber} error={errors.cardNumber} className="sm:col-span-2">
                        <div className="relative">
                          <Input
                            id="f-cardNumber"
                            inputMode="numeric"
                            autoComplete="cc-number"
                            value={form.cardNumber}
                            onChange={(e) => set("cardNumber", formatCard(e.target.value))}
                            aria-invalid={!!errors.cardNumber}
                            placeholder="4242 4242 4242 4242"
                            className="h-14 rounded-2xl bg-slate-50 border-slate-200 pr-28 font-mono tracking-wider text-slate-900 placeholder:text-slate-400 focus:border-brand-orange"
                          />
                          {brand && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-brand-sky/20 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-brand-sky-600 font-bold shadow-sm">
                              {brand}
                            </span>
                          )}
                        </div>
                      </Field>
                      <Field id="cardName" label={dict.checkoutView.cardName} error={errors.cardName} className="sm:col-span-2">
                        <Input
                          id="f-cardName"
                          autoComplete="cc-name"
                          value={form.cardName}
                          onChange={(e) => set("cardName", e.target.value)}
                          aria-invalid={!!errors.cardName}
                          placeholder="FRIDA KAHLO"
                          className="h-14 rounded-2xl bg-slate-50 border-slate-200 text-slate-900 uppercase placeholder:text-slate-400 focus:border-brand-orange"
                        />
                      </Field>
                      <Field id="cardExp" label={dict.checkoutView.cardExp} error={errors.cardExp}>
                        <Input
                          id="f-cardExp"
                          inputMode="numeric"
                          autoComplete="cc-exp"
                          value={form.cardExp}
                          onChange={(e) => set("cardExp", formatExp(e.target.value))}
                          aria-invalid={!!errors.cardExp}
                          placeholder="MM/AA"
                          className="h-14 rounded-2xl bg-slate-50 border-slate-200 font-mono text-slate-900 placeholder:text-slate-400 focus:border-brand-orange"
                        />
                      </Field>
                      <Field id="cardCvc" label={dict.checkoutView.cardCvc} error={errors.cardCvc}>
                        <Input
                          id="f-cardCvc"
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          value={form.cardCvc}
                          onChange={(e) => set("cardCvc", e.target.value.replace(/\D/g, "").slice(0, 4))}
                          aria-invalid={!!errors.cardCvc}
                          placeholder="123"
                          className="h-14 rounded-2xl bg-slate-50 border-slate-200 font-mono text-slate-900 placeholder:text-slate-400 focus:border-brand-orange"
                        />
                      </Field>
                    </div>
                    <CardPreview number={form.cardNumber} name={form.cardName} exp={form.cardExp} brand={brand} />
                  </div>
                )}
              </Block>

              <Block n="02" title={dict.checkoutView.contactBlockTitle} subtitle={dict.checkoutView.contactBlockSub}>
                <div className="grid gap-5 sm:grid-cols-2 mt-6">
                  <Field id="email" label={dict.checkoutView.email} error={errors.email} className="sm:col-span-2">
                    <Input
                      id="f-email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      aria-invalid={!!errors.email}
                      placeholder="tu@correo.com"
                      className="h-14 rounded-2xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-brand-orange"
                    />
                  </Field>
                  <Field id="firstName" label={dict.checkoutView.firstName} error={errors.firstName}>
                    <Input
                      id="f-firstName"
                      autoComplete="given-name"
                      value={form.firstName}
                      onChange={(e) => set("firstName", e.target.value)}
                      aria-invalid={!!errors.firstName}
                      placeholder="Frida"
                      className="h-14 rounded-2xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-brand-orange"
                    />
                  </Field>
                  <Field id="lastName" label={dict.checkoutView.lastName} error={errors.lastName}>
                    <Input
                      id="f-lastName"
                      autoComplete="family-name"
                      value={form.lastName}
                      onChange={(e) => set("lastName", e.target.value)}
                      aria-invalid={!!errors.lastName}
                      placeholder="Kahlo Calderón"
                      className="h-14 rounded-2xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-brand-orange"
                    />
                  </Field>
                  <Field id="phone" label={dict.checkoutView.phone} error={errors.phone} className="sm:col-span-2">
                    <Input
                      id="f-phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value.replace(/[^\d\s+()-]/g, ""))}
                      aria-invalid={!!errors.phone}
                      placeholder="55 1234 5678"
                      className="h-14 rounded-2xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-brand-orange"
                    />
                  </Field>
                  <Field id="notes" label={dict.checkoutView.notes} className="sm:col-span-2">
                    <Textarea
                      id="f-notes"
                      value={form.notes}
                      onChange={(e) => set("notes", e.target.value)}
                      placeholder={dict.checkoutView.notesPlaceholder}
                      className="min-h-[96px] rounded-2xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-brand-orange p-4"
                    />
                  </Field>
                </div>
              </Block>

              <Block n="03" title={dict.checkoutView.invoiceBlockTitle} subtitle={dict.checkoutView.invoiceBlockSub}>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Field id="rfc" label={dict.checkoutView.rfc} error={errors.rfc}>
                    <Input
                      id="f-rfc"
                      value={form.rfc}
                      onChange={(e) => set("rfc", e.target.value.toUpperCase().slice(0, 13))}
                      aria-invalid={!!errors.rfc}
                      placeholder="XAXX010101000"
                      className="h-14 rounded-2xl bg-slate-50 font-mono uppercase tracking-wider border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-brand-orange"
                    />
                  </Field>
                  <Field id="cp" label={dict.checkoutView.cp} error={errors.cp}>
                    <Input
                      id="f-cp"
                      inputMode="numeric"
                      value={form.cp}
                      onChange={(e) => set("cp", e.target.value.replace(/\D/g, "").slice(0, 5))}
                      aria-invalid={!!errors.cp}
                      placeholder="06700"
                      className="h-14 rounded-2xl bg-slate-50 border-slate-200 font-mono text-slate-900 placeholder:text-slate-400 focus:border-brand-orange"
                    />
                  </Field>
                  <Field id="pais" label={dict.checkoutView.country} error={errors.pais} className="sm:col-span-2">
                    <Input
                      id="f-pais"
                      value={form.pais}
                      onChange={(e) => set("pais", e.target.value)}
                      aria-invalid={!!errors.pais}
                      placeholder="País de residencia"
                      className="h-14 rounded-2xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-brand-orange"
                    />
                  </Field>
                  <Field id="direccion" label={dict.checkoutView.address} className="sm:col-span-2">
                    <Input
                      id="f-direccion"
                      value={form.direccion}
                      onChange={(e) => set("direccion", e.target.value)}
                      aria-invalid={!!errors.direccion}
                      placeholder="Calle, número, colonia"
                      className="h-14 rounded-2xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-brand-orange"
                    />
                  </Field>
                  <Field id="ciudad" label={dict.checkoutView.city} error={errors.ciudad} className="sm:col-span-2">
                    <Input
                      id="f-ciudad"
                      value={form.ciudad}
                      onChange={(e) => set("ciudad", e.target.value)}
                      aria-invalid={!!errors.ciudad}
                      placeholder="Ciudad de residencia"
                      className="h-14 rounded-2xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-brand-orange"
                    />
                  </Field>
                </div>
              </Block>

              <div id="f-acceptTerms" className="rounded-[2rem] bg-white p-6 border border-slate-200 shadow-sm">
                <label className="flex cursor-pointer items-start gap-3">
                  <Checkbox
                    checked={form.acceptTerms}
                    onCheckedChange={(v) => set("acceptTerms", v === true)}
                    aria-invalid={!!errors.acceptTerms}
                    className="mt-1 rounded-md border-slate-300 data-[state=checked]:bg-brand-orange data-[state=checked]:border-brand-orange"
                  />
                  <span className="text-sm leading-relaxed text-slate-700">
                    {dict.checkoutView.termsAgreementPrefix}{" "}
                    <Link href="/legal/terminos" className="font-semibold text-slate-900 underline decoration-brand-orange underline-offset-4 hover:text-brand-orange">
                      {dict.checkoutView.terms}
                    </Link>
                    {dict.checkoutView.termsAnd}{" "}
                    <Link href="/legal/reembolsos" className="font-semibold text-slate-900 underline decoration-brand-orange underline-offset-4 hover:text-brand-orange">
                      {dict.checkoutView.refunds}
                    </Link>{" "}
                    {dict.checkoutView.termsAnd2}{" "}
                    <Link href="/legal/privacidad" className="font-semibold text-slate-900 underline decoration-brand-orange underline-offset-4 hover:text-brand-orange">
                      {dict.checkoutView.privacy}
                    </Link>
                    .
                  </span>
                </label>
                {errors.acceptTerms && <p className="mt-2 pl-7 text-xs text-destructive">{errors.acceptTerms}</p>}
              </div>
            </div>

            {/* Resumen Derecha */}
            <aside className="lg:col-span-5 xl:col-span-4">
              <div className="lg:sticky lg:top-28">
                <div className="overflow-hidden rounded-[2.5rem] bg-white border border-slate-200 shadow-xl">
                  <div className="bg-brand-slate-900 px-8 py-6 text-white">
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] font-bold text-brand-sky">{dict.checkoutView.summaryTitle}</p>
                    <p className="mt-1 text-sm text-slate-300">
                      {lines.length} {lines.length === 1 ? dict.cart.experience : dict.cart.experiences}
                    </p>
                  </div>
                  <ul className="max-h-72 divide-y divide-slate-100 overflow-y-auto px-8">
                    {lines.map((l) => (
                      <li key={l.id} className="flex gap-4 py-4">
                        <div className="h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={l.product.image} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-900">{l.product.short}</p>
                          <p className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-slate-500">
                            {formatDateLong(l.date, lang)} · {l.adults} {l.adults === 1 ? dict.checkoutView.adultSingular : dict.checkoutView.adultPlural}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-slate-900 font-mono">{formatMXN(l.lineTotal)}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-dashed border-slate-200 bg-slate-50 px-8 py-6">
                    <dl className="space-y-3 text-sm">
                      <div className="flex justify-between text-slate-600">
                        <dt>{dict.cart.subtotal}</dt>
                        <dd className="font-mono">{formatMXN(subtotal)}</dd>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-brand-orange">
                          <dt>{dict.cart.discount} {coupon && <span className="font-mono text-xs">({coupon})</span>}</dt>
                          <dd className="font-mono">−{formatMXN(discount)}</dd>
                        </div>
                      )}
                      <div className="flex items-baseline justify-between pt-3 border-t border-slate-200">
                        <dt className="font-semibold text-slate-900 text-base">{dict.cart.total}</dt>
                        <dd className="text-3xl font-extrabold tracking-tight text-slate-900 font-mono">{formatMXN(total)}</dd>
                      </div>
                      <p className="text-right font-mono text-[0.6rem] uppercase tracking-[0.18em] text-slate-400">{dict.cart.taxIncluded}</p>
                    </dl>
                    <Button type="submit" size="lg" className="mt-6 w-full h-14 rounded-full bg-brand-orange text-white hover:bg-brand-orange-600 shadow-lg text-base transition-all duration-300 hover:scale-105" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="animate-spin mr-2" /> {dict.checkoutView.processing}
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4" /> {dict.checkoutView.payTotal} {formatMXN(total)}
                        </>
                      )}
                    </Button>
                    <p className="mt-4 text-center text-xs text-slate-500">
                      {dict.checkoutView.testCardNote}
                    </p>
                  </div>
                </div>
              </div>
            </aside>

          </form>
        )}
      </div>
    </div>
  );
}

function Steps({ current }: { current: number }) {
  const { dict } = useLanguage();
  const steps = [dict.checkoutView.step1, dict.checkoutView.step2, dict.checkoutView.step3];
  return (
    <ol className="flex flex-wrap items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.16em]">
      {steps.map((s, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li key={s} className="flex items-center gap-3">
            <span
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 font-semibold shadow-sm transition-all",
                active ? "bg-brand-slate-900 text-white shadow-md" : done ? "bg-brand-orange text-white font-bold" : "bg-slate-200 text-slate-500 border border-slate-300",
              )}
            >
              {done ? <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} /> : <span>0{n}</span>}
              {s}
            </span>
            {i < steps.length - 1 && <span className="h-px w-8 bg-slate-300" />}
          </li>
        );
      })}
    </ol>
  );
}

function Block({ n, title, subtitle, children }: { n: string; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-[2.5rem] bg-white p-8 border border-slate-200 shadow-sm md:p-10">
      <legend className="sr-only">{title}</legend>
      <div className="mb-6 flex items-start gap-4 border-b border-slate-100 pb-6">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-orange font-mono text-sm font-bold text-white shadow-md">
          {n}
        </span>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
        </div>
      </div>
      {children}
    </fieldset>
  );
}

function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={`f-${id}`} className="font-mono text-xs uppercase tracking-wider text-slate-600">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function CardPreview({ number, name, exp, brand }: { number: string; name: string; exp: string; brand: string | null }) {
  const masked = (number || "•••• •••• •••• ••••").padEnd(19, "•");
  return (
    <div
      className="relative hidden aspect-[1.6/1] w-full overflow-hidden rounded-2xl p-6 text-white shadow-xl md:flex md:flex-col justify-between border border-brand-slate-800"
      style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 70%, #EA580C 100%)" }}
      aria-hidden="true"
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-sky/20 blur-2xl" />
      <div className="flex items-center justify-between relative z-10">
        <div className="h-8 w-12 rounded-lg bg-gradient-to-br from-brand-sky to-brand-sky-600 shadow-inner" />
        <span className="font-mono text-xs uppercase tracking-widest font-bold text-brand-sky">{brand ?? "Card"}</span>
      </div>
      <div className="relative z-10">
        <p className="font-mono text-xl tracking-[0.15em] text-white">{masked}</p>
        <div className="mt-4 flex justify-between font-mono text-xs uppercase tracking-widest text-slate-300">
          <span className="truncate pr-2 font-semibold">{name || "Name Surname"}</span>
          <span>{exp || "MM/YY"}</span>
        </div>
      </div>
    </div>
  );
}