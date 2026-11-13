"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { formatDateLong, useCart } from "@/lib/cart";
import { formatMXN } from "@/lib/products";
import { useLanguage } from "@/context/LanguageContext";

export function CartDrawer() {
  const { isOpen, setOpen, lines, subtotal, discount, total, updateAdults, remove, travelers } = useCart();
  const { dict } = useLanguage();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="p-0 border-l border-brand-slate-200">
        <div className="border-b border-brand-slate-100 bg-slate-50 px-6 pb-6 pt-8">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] font-bold text-brand-sky">
            {dict.cart.eyebrow}
          </p>
          <SheetTitle className="mt-2 text-3xl font-bold text-brand-slate-900">
            {dict.cart.title} <span className="text-brand-orange">{dict.cart.titleEm}</span>
          </SheetTitle>
          <SheetDescription className="mt-2 text-brand-slate-600">
            {lines.length === 0
              ? dict.cart.emptyTitle
              : `${lines.length} ${lines.length === 1 ? dict.cart.experience : dict.cart.experiences} · ${travelers} ${travelers === 1 ? dict.cart.traveler : dict.cart.travelers}`}
          </SheetDescription>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 bg-white">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="h-32 w-32 rounded-3xl bg-slate-100 flex items-center justify-center text-brand-slate-300">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="mt-6 max-w-[16rem] text-brand-slate-500">
                {dict.cart.emptyText}
              </p>
              <Button asChild className="mt-6 rounded-full bg-brand-orange hover:bg-brand-orange-600 text-white" onClick={() => setOpen(false)}>
                <Link href="/catalogo">{dict.common.exploreCatalog}</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map((line) => (
                <li
                  key={line.id}
                  className="group relative flex gap-4 rounded-2xl border border-brand-slate-100 bg-white p-3 pr-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <Link
                    href={`/experiencia/${line.slug}`}
                    onClick={() => setOpen(false)}
                    className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100"
                  >
                    <img src={line.product.image} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col py-1">
                    <p className="font-mono text-[0.65rem] font-bold uppercase tracking-widest text-brand-sky">
                      {line.product.code} · {formatDateLong(line.date)}
                    </p>
                    <Link
                      href={`/experiencia/${line.slug}`}
                      onClick={() => setOpen(false)}
                      className="mt-1 line-clamp-2 text-sm font-semibold leading-tight text-brand-slate-900 hover:text-brand-orange"
                    >
                      {line.product.short}
                    </Link>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-full border border-brand-slate-200 bg-slate-50">
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-full text-brand-slate-600 hover:bg-brand-slate-200 disabled:opacity-30"
                          onClick={() => updateAdults(line.id, line.adults - 1)}
                          disabled={line.adults <= line.product.minPeople}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center font-mono text-xs font-semibold">{line.adults}</span>
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-full text-brand-slate-600 hover:bg-brand-slate-200"
                          onClick={() => updateAdults(line.id, line.adults + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-brand-slate-900">{formatMXN(line.lineTotal)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(line.id)}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-brand-slate-100 bg-slate-50 px-6 pb-6 pt-5">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between text-brand-slate-600">
                <dt>{dict.cart.subtotal}</dt>
                <dd>{formatMXN(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between font-medium text-brand-orange">
                  <dt>{dict.cart.discount}</dt>
                  <dd>−{formatMXN(discount)}</dd>
                </div>
              )}
              <div className="flex items-baseline justify-between pt-3">
                <dt className="font-semibold text-brand-slate-900">{dict.cart.total}</dt>
                <dd className="text-2xl font-bold tracking-tight text-brand-slate-900">{formatMXN(total)}</dd>
              </div>
              <p className="text-right font-mono text-[0.65rem] uppercase tracking-widest text-brand-slate-400">{dict.cart.taxIncluded}</p>
            </dl>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button 
                asChild 
                variant="outline" 
                className="rounded-full border-brand-slate-300 bg-white text-brand-slate-900 hover:bg-brand-slate-100 hover:text-brand-slate-900 font-medium shadow-sm" 
                onClick={() => setOpen(false)}
              >
                <Link href="/carrito">{dict.cart.viewCart}</Link>
              </Button>
              <Button 
                asChild 
                className="rounded-full bg-brand-slate-900 text-white hover:bg-brand-slate-800 font-medium shadow-sm" 
                onClick={() => setOpen(false)}
              >
                <Link href="/checkout">
                  {dict.cart.pay} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}