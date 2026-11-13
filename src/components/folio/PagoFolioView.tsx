"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, ShoppingBag, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart, isoDate } from "@/lib/cart";
import { useLanguage } from "@/context/LanguageContext";

export function PagoFolioView() {
  const { dict } = useLanguage();
  const { addCustomFolio, setOpen } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", folio: "", price: "" });
  const [errors, setErrors] = useState<{ name?: string; folio?: string; price?: string }>({});
  const [status, setStatus] = useState<"idle" | "processing">("idle");

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (form.name.trim().length < 2) e.name = dict.pagoFolio.errors.name;
    if (form.folio.trim().length < 2) e.folio = dict.pagoFolio.errors.folio;
    const priceNum = Number(form.price);
    if (isNaN(priceNum) || priceNum <= 0) e.price = dict.pagoFolio.errors.price;
    return e;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setStatus("processing");
    
    addCustomFolio({
      slug: `folio-${form.folio.toLowerCase()}`,
      folioName: `Folio a la medida: ${form.folio}`,
      customerName: form.name,
      price: Number(form.price),
      date: isoDate(0)
    });

    toast.success(dict.pagoFolio.successToast);
    
    if (typeof window !== "undefined") {
      localStorage.setItem("destinolibre_folio_name", form.name);
    }

    setOpen(true);
    router.push("/carrito");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-32 pt-36 md:pt-48 overflow-hidden relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="container relative z-10 mx-auto max-w-3xl">
        <Link
          href="/contacto"
          className="mb-8 inline-flex items-center gap-2 font-semibold text-slate-600 underline decoration-brand-orange decoration-2 underline-offset-[6px] hover:text-brand-orange transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a contacto
        </Link>
        
        {/* Cabecera limpia y profesional */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-8 md:p-12 border border-slate-200 shadow-sm mb-10">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-brand-orange/10 blur-3xl pointer-events-none" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-mono text-xs uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" /> {dict.pagoFolio.eyebrow}
          </div>
          <h1 className="text-[clamp(2.5rem,5.5vw,4.5rem)] font-extrabold leading-[0.9] tracking-[-0.05em] text-slate-900">
            {dict.pagoFolio.title} <em className="font-serif italic font-normal text-brand-orange">{dict.pagoFolio.titleEm}</em>.
          </h1>
          <p className="mt-4 max-w-xl text-slate-600 text-base md:text-lg">
            {dict.pagoFolio.description}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={onSubmit} noValidate className="rounded-[2.5rem] bg-white p-8 shadow-xl border border-slate-200 md:p-12">
          <div className="grid gap-6">
            
            <div className="space-y-2">
              <Label htmlFor="folio-code" className="font-mono text-xs uppercase tracking-wider text-slate-600">{dict.pagoFolio.folioLabel}</Label>
              <Input
                id="folio-code"
                value={form.folio}
                onChange={(e) => set("folio", e.target.value.toUpperCase())}
                aria-invalid={!!errors.folio}
                placeholder={dict.pagoFolio.folioPlaceholder}
                className="h-14 rounded-2xl bg-slate-50 font-mono uppercase border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-brand-orange text-lg tracking-wider"
              />
              {errors.folio && <p className="text-xs text-destructive">{errors.folio}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="folio-name" className="font-mono text-xs uppercase tracking-wider text-slate-600">{dict.pagoFolio.nameLabel}</Label>
              <Input
                id="folio-name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                aria-invalid={!!errors.name}
                placeholder={dict.pagoFolio.namePlaceholder}
                className="h-14 rounded-2xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-brand-orange text-base"
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="folio-price" className="font-mono text-xs uppercase tracking-wider text-slate-600">{dict.pagoFolio.priceLabel}</Label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-mono text-lg font-bold text-brand-orange">$</span>
                <Input
                  id="folio-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  aria-invalid={!!errors.price}
                  placeholder={dict.pagoFolio.pricePlaceholder}
                  className="h-14 rounded-2xl bg-slate-50 pl-10 font-mono text-lg font-bold border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-brand-orange"
                />
              </div>
              {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
            </div>

          </div>

          <Button type="submit" size="lg" className="mt-10 w-full h-14 rounded-full bg-brand-orange text-white hover:bg-brand-orange-600 text-base shadow-lg transition-all duration-300 hover:scale-[1.02]" disabled={status === "processing"}>
            {status === "processing" ? (
              <><Loader2 className="animate-spin mr-2" /> {dict.pagoFolio.processing}</>
            ) : (
              <><ShoppingBag className="mr-2 h-5 w-5" /> {dict.pagoFolio.addBtn}</>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}