"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, Globe, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";
import { useCart } from "@/lib/cart";
import { useLanguage } from "@/context/LanguageContext";
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { count, setOpen, hydrated } = useCart();
  const { lang, setLang, dict } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const NAV = [
    { href: "/#metodo", label: dict.header.criterion },
    { href: "/catalogo", label: dict.header.catalog },
    { href: "/#esencia", label: dict.header.aboutUs },
    { href: "/contacto", label: dict.header.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleLanguage = () => setLang(lang === "es" ? "en" : "es");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 border-b",
        scrolled ? "bg-white border-brand-slate-200 shadow-sm py-4" : "bg-white/95 backdrop-blur-md border-transparent py-6"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        <div className="flex items-center gap-12">
          <Logo tone="dark" />
          <nav className="hidden lg:flex items-center gap-8" aria-label="Principal">
            {NAV.map((item) => {
              const active = item.href === pathname || (item.href !== "/" && pathname.startsWith(item.href) && !item.href.includes("#"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-semibold tracking-wide transition-colors",
                    active ? "text-brand-orange" : "text-brand-slate-900 hover:text-brand-orange"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={toggleLanguage}
            className="hidden lg:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-slate-500 hover:text-brand-orange transition-colors"
          >
            <Globe className="h-4 w-4" />
            {lang}
          </button>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative flex items-center gap-2 text-brand-slate-900 hover:text-brand-orange transition-colors"
            aria-label={`${dict.header.openCart} (${count})`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-sm font-semibold">
              {hydrated ? count : 0}
            </span>
          </button>

          <Link
            href="/contacto"
            className="hidden lg:inline-flex items-center gap-2 bg-brand-slate-900 text-white px-6 py-2.5 rounded-sm text-sm font-bold tracking-wide hover:bg-brand-orange transition-colors"
          >
            {dict.common.startTrip} <ArrowRight className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="lg:hidden text-brand-slate-900"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="bg-white border-r border-brand-slate-200">
          <SheetTitle className="sr-only">Menú</SheetTitle>
          <SheetDescription className="sr-only">Navegación principal</SheetDescription>
          <div className="flex flex-col h-full py-6">
            <Logo tone="dark" />
            <nav className="mt-12 flex flex-col space-y-6">
              {[{ href: "/", label: dict.header.home }, ...NAV].map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className="text-2xl font-bold text-brand-slate-900 hover:text-brand-orange"
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-4">
              <button
                type="button"
                onClick={toggleLanguage}
                className="flex justify-center items-center gap-2 border border-brand-slate-200 py-3 text-sm font-bold uppercase"
              >
                <Globe className="h-4 w-4" /> Cambiar idioma
              </button>
              <SheetClose asChild>
                <Link
                  href="/contacto"
                  className="flex justify-center bg-brand-slate-900 text-white py-4 font-bold"
                >
                  {dict.common.startTrip}
                </Link>
              </SheetClose>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}