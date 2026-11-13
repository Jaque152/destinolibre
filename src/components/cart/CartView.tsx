"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Lock, Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatDateLong, isoDate, useCart } from "@/lib/cart";
import { formatMXN, COUPONS } from "@/lib/products";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export function CartView() {
  const { lang, dict } = useLanguage();
  const {
    lines, hydrated, subtotal, discount, total, coupon,
    updateAdults, updateDate, remove, applyCoupon, removeCoupon, clear
  } = useCart();
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [minDate, setMinDate] = useState("");

  useEffect(() => setMinDate(isoDate(2)), []);

  const submitCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    if (applyCoupon(code)) {
      setCodeError(null); setCode("");
      toast.success(dict.cartView.couponApplied, { description: COUPONS[code.trim().toUpperCase()]?.label });
    } else {
      setCodeError(dict.cartView.invalidCoupon);
    }
  };

  return (
    <section className="container mx-auto px-6 pb-24 pt-32 md:pt-40 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-brand-slate-200 pb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-sky mb-4">{dict.cartView.eyebrow}</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-brand-slate-900 leading-none">
            {dict.cartView.title} <span className="text-brand-orange">{dict.cartView.titleEm}</span>
          </h1>
        </div>
        <Link href="/catalogo" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-slate-500 hover:text-brand-orange transition-colors">
          <ArrowLeft className="h-4 w-4" /> {dict.cartView.keepExploring}
        </Link>
      </div>

      {!hydrated ? (
        <div className="h-64 animate-pulse bg-slate-100 border border-brand-slate-200" />
      ) : lines.length === 0 ? (
        <div className="py-24 text-center">
          <h2 className="text-3xl font-black text-brand-slate-900 mb-4">{dict.cartView.emptyTitle}</h2>
          <p className="text-brand-slate-500 mb-8 max-w-md mx-auto">{dict.cartView.emptyText}</p>
          <Link href="/catalogo" className="bg-brand-slate-900 text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-brand-orange transition-colors">
            {dict.common.exploreCatalog}
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_400px] gap-12 lg:gap-20">
          <div>
            <div className="hidden md:grid grid-cols-[1fr_200px_120px_150px] gap-6 border-b-2 border-brand-slate-900 pb-4 text-xs font-bold uppercase tracking-widest text-brand-slate-500">
              <span>Experiencia</span>
              <span>Fecha</span>
              <span>Viajeros</span>
              <span className="text-right">Subtotal</span>
            </div>
            
            <ul className="divide-y divide-brand-slate-200">
              {lines.map((line) => (
                <li key={line.id} className="grid md:grid-cols-[1fr_200px_120px_150px] gap-6 py-8 items-center">
                  <div className="flex gap-6">
                    <img src={line.product.image} alt="" className="h-24 w-24 object-cover bg-slate-100" />
                    <div>
                      <p className="text-[0.65rem] font-bold uppercase tracking-widest text-brand-orange mb-1">{line.product.code}</p>
                      <h3 className="text-lg font-bold text-brand-slate-900 leading-tight mb-2">{line.product.title}</h3>
                      <button onClick={() => remove(line.id)} className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700 flex items-center gap-1">
                        <Trash2 className="h-3 w-3" /> {dict.cartView.remove}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="block md:hidden text-xs font-bold uppercase tracking-widest text-brand-slate-400 mb-2">Fecha</span>
                    <input
                      type="date"
                      value={line.date}
                      min={minDate || undefined}
                      onChange={(e) => e.target.value && updateDate(line.id, e.target.value)}
                      className="w-full border border-brand-slate-200 px-3 py-2 text-sm font-medium focus:border-brand-sky outline-none bg-slate-50"
                    />
                  </div>

                  <div>
                    <span className="block md:hidden text-xs font-bold uppercase tracking-widest text-brand-slate-400 mb-2">Viajeros</span>
                    <div className="flex items-center justify-between border border-brand-slate-200 bg-slate-50 p-1">
                      <button
                        onClick={() => updateAdults(line.id, line.adults - 1)}
                        disabled={line.adults <= line.product.minPeople}
                        className="h-8 w-8 flex items-center justify-center bg-white border border-brand-slate-200 text-brand-slate-900 hover:bg-brand-slate-900 hover:text-white disabled:opacity-50"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="font-mono text-sm font-bold">{line.adults}</span>
                      <button
                        onClick={() => updateAdults(line.id, line.adults + 1)}
                        className="h-8 w-8 flex items-center justify-center bg-white border border-brand-slate-200 text-brand-slate-900 hover:bg-brand-slate-900 hover:text-white"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block md:hidden text-xs font-bold uppercase tracking-widest text-brand-slate-400 mb-2">Total</span>
                    <p className="text-xl font-black text-brand-slate-900">{formatMXN(line.lineTotal)}</p>
                  </div>
                </li>
              ))}
            </ul>
            
            <button onClick={() => { clear(); toast(dict.cartView.cartEmptiedToast); }} className="mt-8 text-xs font-bold uppercase tracking-widest text-brand-slate-400 hover:text-brand-slate-900 transition-colors border-b border-transparent hover:border-brand-slate-900 pb-1">
              {dict.cartView.emptyCartBtn}
            </button>
          </div>

          {/* Resumen */}
          <aside className="relative">
            <div className="sticky top-28 bg-brand-slate-900 text-white p-8 border-t-4 border-brand-orange">
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-sky mb-8 border-b border-brand-slate-800 pb-4">
                {dict.cartView.summary}
              </h3>

              <form onSubmit={submitCoupon} className="mb-8">
                <label className="block text-[0.65rem] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  {dict.cartView.discountCode}
                </label>
                <div className="flex gap-2">
                  <input
                    value={code}
                    onChange={(e) => { setCode(e.target.value); setCodeError(null); }}
                    placeholder="CÓDIGO"
                    className="flex-1 bg-slate-800 border border-transparent focus:border-brand-sky px-4 py-2 text-sm text-white font-mono uppercase outline-none"
                  />
                  <button type="submit" className="bg-brand-slate-700 hover:bg-brand-sky text-white px-4 text-xs font-bold uppercase tracking-widest transition-colors">
                    {dict.cartView.apply}
                  </button>
                </div>
                {codeError && <p className="mt-2 text-xs text-red-400">{codeError}</p>}
                {coupon && (
                  <div className="mt-3 flex items-center justify-between bg-brand-sky/20 px-3 py-2 text-sm text-brand-sky">
                    <span className="font-mono font-bold tracking-widest">{coupon}</span>
                    <button onClick={removeCoupon} className="hover:text-white">Remover</button>
                  </div>
                )}
              </form>

              <dl className="space-y-4 text-sm font-medium text-slate-300 border-t border-brand-slate-800 pt-6">
                <div className="flex justify-between">
                  <dt>{dict.cart.subtotal}</dt>
                  <dd>{formatMXN(subtotal)}</dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-brand-orange">
                    <dt>{dict.cart.discount}</dt>
                    <dd>−{formatMXN(discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between border-t border-brand-slate-800 pt-4 text-white">
                  <dt className="text-lg font-bold">{dict.cartView.total}</dt>
                  <dd className="text-3xl font-black">{formatMXN(total)}</dd>
                </div>
              </dl>

              <Link href="/checkout" className="mt-8 w-full bg-brand-orange text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                {dict.cartView.checkoutBtn} <ArrowRight className="h-4 w-4" />
              </Link>
              
              <p className="mt-6 flex items-center justify-center gap-2 text-[0.65rem] uppercase tracking-widest text-slate-500">
                <Lock className="h-3 w-3" /> Pago Seguro y Encriptado
              </p>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}