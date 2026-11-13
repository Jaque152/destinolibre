"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { formatDateLong, isoDate, useCart } from "@/lib/cart";
import { formatMXN, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export function BookingWidget({ product }: { product: Product }) {
  const router = useRouter();
  const { lang, dict } = useLanguage();
  const { add, setOpen } = useCart();
  const [minDate, setMinDate] = useState("");
  const [date, setDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setMinDate(isoDate(2)), []);

  const total = product.price * adults;

  const validate = () => {
    if (!date) { setError(dict.bookingWidget.tourDateRequired); return false; }
    if (minDate && date < minDate) { setError(dict.bookingWidget.tour48hNotice); return false; }
    setError(null);
    return true;
  };

  const handleBuyNow = () => {
    if (!validate()) return;
    add(product.slug, date, adults);
    router.push("/checkout");
  };

  return (
    <div className="bg-white border border-brand-slate-200 shadow-xl flex flex-col">
      <div className="bg-brand-slate-900 p-6 text-white border-t-4 border-brand-orange">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-sky mb-2">Reservar Experiencia</p>
        <p className="text-3xl font-black tracking-tighter">{formatMXN(product.price)}</p>
        <p className="text-[0.65rem] text-slate-400 uppercase tracking-widest mt-1">Por Viajero</p>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-brand-slate-500 mb-2">
            Fecha de Salida
          </label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-slate-400" />
            <input
              type="date"
              value={date}
              min={minDate || undefined}
              onChange={(e) => { setDate(e.target.value); setError(null); }}
              className={cn(
                "w-full bg-slate-50 border px-10 py-3 text-brand-slate-900 font-medium focus:outline-none focus:border-brand-sky transition-colors",
                error ? "border-red-500" : "border-brand-slate-200"
              )}
            />
          </div>
          {error && <p className="mt-2 text-xs text-red-500 font-medium">{error}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-brand-slate-500 mb-2">
            Viajeros
          </label>
          <div className="flex items-center justify-between border border-brand-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setAdults((a) => Math.max(1, a - 1))}
              disabled={adults <= 1}
              className="h-10 w-10 flex items-center justify-center bg-white border border-brand-slate-200 text-brand-slate-900 hover:bg-brand-slate-900 hover:text-white transition-colors disabled:opacity-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="font-mono text-lg font-bold text-brand-slate-900">{adults}</span>
            <button
              type="button"
              onClick={() => setAdults((a) => Math.min(20, a + 1))}
              className="h-10 w-10 flex items-center justify-center bg-white border border-brand-slate-200 text-brand-slate-900 hover:bg-brand-slate-900 hover:text-white transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="border-t border-brand-slate-200 pt-6 flex justify-between items-end">
          <span className="text-sm font-medium text-brand-slate-500">Total a Pagar</span>
          <span className="text-2xl font-black text-brand-slate-900">{formatMXN(total)}</span>
        </div>

        <button
          onClick={handleBuyNow}
          className="w-full bg-brand-orange text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
        >
          {dict.bookingWidget.bookAndPay} <ArrowRight className="h-4 w-4" />
        </button>

        <div className="pt-6 border-t border-brand-slate-100">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-brand-slate-500">Categoría</dt>
              <dd className="font-bold text-brand-slate-900">{product.category}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-slate-500">Duración</dt>
              <dd className="font-bold text-brand-slate-900">{product.duration}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-slate-500">Formato</dt>
              <dd className="font-bold text-brand-slate-900">{dict.bookingWidget.formatValue}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}