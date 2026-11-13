"use client";

import Link from "next/link";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { type Product, getLocalizedProduct } from "@/lib/products";
import { formatMXNShort } from "@/lib/products";
import { isoDate, useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export function TicketCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { lang, dict } = useLanguage();
  const localizedProduct = getLocalizedProduct(product, lang);
  const categoryLabel = dict.catalogView.categories[product.category] ?? product.category;
  const { add, setOpen } = useCart();
  const [added, setAdded] = useState(false);

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(product.slug, isoDate(14), product.minPeople);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
    toast.success(dict.bookingWidget.addedToastTitle, {
      description: `${localizedProduct.short} · ${product.minPeople} adultos.`,
    });
  };

  return (
    <article className="group relative flex flex-col bg-white border border-brand-slate-200 transition-all duration-300 hover:shadow-2xl hover:border-brand-sky">
      <Link href={`/catalogo/${product.slug}`} className="absolute inset-0 z-10" aria-label={localizedProduct.title} />

      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={localizedProduct.short}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-brand-slate-900">
          {categoryLabel}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-brand-slate-400 uppercase tracking-widest">
            {product.region}
          </p>
          <span className="text-[0.65rem] font-mono text-brand-orange bg-brand-orange/10 px-2 py-1">
            {product.code}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-brand-slate-900 leading-tight mb-2">
          {localizedProduct.short}
        </h3>
        <p className="text-sm text-brand-slate-600 line-clamp-2 mb-6">
          {localizedProduct.summary}
        </p>

        <div className="mt-auto pt-6 border-t border-brand-slate-100 flex items-end justify-between">
          <div>
            <p className="text-[0.65rem] uppercase tracking-widest text-brand-slate-400 mb-1">
              {dict.bookingWidget.fromPerAdult}
            </p>
            <p className="text-xl font-black text-brand-slate-900">
              {formatMXNShort(product.price)} <span className="text-xs font-normal text-slate-500">MXN</span>
            </p>
          </div>
          <button
            type="button"
            onClick={quickAdd}
            className={cn(
              "relative z-20 flex h-10 w-10 items-center justify-center border transition-colors",
              added ? "bg-brand-sky border-brand-sky text-white" : "border-brand-slate-200 text-brand-slate-900 hover:bg-brand-slate-900 hover:text-white"
            )}
          >
            {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </article>
  );
}