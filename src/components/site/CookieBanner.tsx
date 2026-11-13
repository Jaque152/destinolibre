"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const KEY = "destinolibre.cookies.v1";

export function CookieBanner() {
  const { dict } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(KEY)) {
        const t = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(t);
      }
    } catch {
      // storage unavailable
    }
  }, []);

  const save = (value: "all" | "none" | "custom") => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ value, analytics: value === "all" || (value === "custom" && analytics) }));
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label={dict.cookie.title}
      className="fixed inset-x-4 bottom-4 z-50 animate-rise sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-md"
    >
      <div className="rounded-2xl bg-white p-6 text-brand-slate-900 shadow-2xl border border-brand-slate-200">
        <div className="flex items-start gap-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-orange/10 text-brand-orange">
            <Cookie className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold tracking-tight text-brand-slate-900">{dict.cookie.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-brand-slate-600">
              {dict.cookie.text}{" "}
              <Link href="/legal/privacidad" className="font-semibold text-brand-orange underline underline-offset-4 hover:text-brand-slate-900">
                {dict.cookie.notice}
              </Link>
            </p>
          </div>
        </div>

        {custom && (
          <div className="mt-4 space-y-3 rounded-xl bg-slate-50 p-4 text-sm border border-brand-slate-200">
            <label className="flex items-center justify-between font-medium text-brand-slate-700">
              <span>{dict.cookie.necessary}</span>
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-brand-orange font-bold">{dict.cookie.necessaryActive}</span>
            </label>
            <label className="flex cursor-pointer items-center justify-between font-medium text-brand-slate-700">
              <span>{dict.cookie.analytics}</span>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="h-4 w-4 accent-brand-orange rounded"
              />
            </label>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2.5">
          {custom ? (
            <button
              type="button"
              onClick={() => save("custom")}
              className="h-11 flex-1 rounded-full bg-brand-slate-900 px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-orange transition-colors"
            >
              {dict.cookie.savePreferences}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setCustom(true)}
                className="h-11 rounded-full border border-brand-slate-200 px-4 text-xs font-bold uppercase tracking-wider text-brand-slate-700 hover:border-brand-slate-900 transition-colors"
              >
                {dict.cookie.customize}
              </button>
              <button
                type="button"
                onClick={() => save("none")}
                className="h-11 rounded-full border border-brand-slate-200 px-4 text-xs font-bold uppercase tracking-wider text-brand-slate-500 hover:border-brand-slate-900 transition-colors"
              >
                {dict.cookie.reject}
              </button>
              <button
                type="button"
                onClick={() => save("all")}
                className="h-11 flex-1 rounded-full bg-brand-slate-900 px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-orange transition-colors"
              >
                {dict.cookie.acceptAll}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
