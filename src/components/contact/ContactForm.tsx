"use client";

import { useState } from "react";
import { Check, Loader2, Lock, Send } from "lucide-react";
import Link from 'next/link';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";

type Field = "name" | "email" | "phone" | "interest" | "message" | "privacy";

export function ContactForm({ preset }: { preset?: string }) {
  const { lang, dict } = useLanguage();
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    interest: preset ?? "",
    message: "",
    website: "",
  });
  const [privacy, setPrivacy] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const set = (k: keyof typeof values, v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k as Field]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: Partial<Record<Field, string>> = {};
    if (values.name.trim().length < 2) e.name = dict.contactView.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) e.email = dict.contactView.errors.email;
    if (values.phone && values.phone.replace(/\D/g, "").length < 10) e.phone = dict.contactView.errors.phone;
    if (!values.interest) e.interest = dict.contactView.errors.interest;
    if (values.message.trim().length < 10) e.message = dict.contactView.errors.message;
    if (!privacy) e.privacy = dict.contactView.errors.privacy;
    return e;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, lang }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.error ?? "Revisa los campos marcados.");
      }
      setStatus("sent");
    } catch (err) {
      setStatus("idle");
      toast.error("No pudimos enviar tu mensaje", {
        description: err instanceof Error ? err.message : "Intenta de nuevo.",
      });
    }
  };

  if (status === "sent") {
    return (
      <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-8 md:p-12 border border-slate-200 text-slate-900 shadow-xl">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-orange text-white shadow-lg">
          <Check className="h-8 w-8" strokeWidth={3} />
        </div>
        <h3 className="mt-6 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
          {dict.contactView.receivedTitle} <em className="font-serif italic font-normal text-brand-orange">{dict.contactView.receivedTitleEm}</em>.
        </h3>
        <p className="mt-3 max-w-md leading-relaxed text-slate-600">
          {dict.contactView.receivedMessagePrefix} {values.name.split(" ")[0]}{dict.contactView.receivedMessageMiddle}{" "}
          <strong className="text-slate-900 font-semibold">{values.email}</strong> {dict.contactView.receivedMessageSuffix}
        </p>
        <div className="my-8">
          <div className="border-t border-dashed border-slate-200" />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-4">
          <Button
            variant="outline"
            className="rounded-full px-8 bg-white border-slate-300 text-slate-900 hover:bg-slate-100 transition-all duration-300"
            onClick={() => {
              setValues({ name: "", email: "", phone: "", interest: "", message: "", website: "" });
              setPrivacy(false);
              setStatus("idle");
            }}
          >
            {dict.contactView.sendAnother}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="p-8 md:p-12 text-slate-900 bg-white">
      <div className="grid gap-6 sm:grid-cols-2">
        
        <div className="space-y-2">
          <Label htmlFor="c-email" className="font-mono text-xs uppercase tracking-wider text-slate-600">{dict.contactView.emailLabel}</Label>
          <Input
            id="c-email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
            placeholder={dict.contactView.emailPlaceholder}
            className="h-14 rounded-2xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-brand-orange focus:ring-brand-orange/30 transition-all"
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="c-name" className="font-mono text-xs uppercase tracking-wider text-slate-600">{dict.contactView.nameLabel}</Label>
          <Input
            id="c-name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name}
            placeholder={dict.contactView.namePlaceholder}
            className="h-14 rounded-2xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-brand-orange focus:ring-brand-orange/30 transition-all"
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="c-phone" className="font-mono text-xs uppercase tracking-wider text-slate-600">{dict.contactView.phoneLabel}</Label>
          <Input
            id="c-phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value.replace(/[^\d\s+()-]/g, ""))}
            aria-invalid={!!errors.phone}
            placeholder={dict.contactView.phonePlaceholder}
            className="h-14 rounded-2xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-brand-orange focus:ring-brand-orange/30 transition-all"
          />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="c-interest" className="font-mono text-xs uppercase tracking-wider text-slate-600">{dict.contactView.interestLabel}</Label>
          <Select value={values.interest} onValueChange={(v) => set("interest", v)}>
            <SelectTrigger id="c-interest" aria-invalid={!!errors.interest} className="h-14 rounded-2xl bg-slate-50 border-slate-200 text-slate-900 focus:border-brand-orange">
              <SelectValue placeholder={dict.contactView.interestPlaceholder} />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 text-slate-900">
              {dict.contactView.interests.map((i) => (
                <SelectItem key={i} value={i} className="focus:bg-brand-orange focus:text-white">
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.interest && <p className="text-xs text-destructive">{errors.interest}</p>}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="c-message" className="font-mono text-xs uppercase tracking-wider text-slate-600">{dict.contactView.messageLabel}</Label>
            <span className="font-mono text-[0.65rem] text-slate-400">{values.message.length}/1500</span>
          </div>
          <Textarea
            id="c-message"
            value={values.message}
            maxLength={1500}
            onChange={(e) => set("message", e.target.value)}
            aria-invalid={!!errors.message}
            placeholder={dict.contactView.messagePlaceholder}
            className="min-h-[160px] rounded-2xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-brand-orange p-4 transition-all"
          />
          {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
        </div>

        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => set("website", e.target.value)}
          className="hidden"
          aria-hidden="true"
        />

        <div className="sm:col-span-2 pt-2">
          <label className="flex cursor-pointer items-start gap-3">
            <Checkbox
              checked={privacy}
              onCheckedChange={(v) => {
                setPrivacy(v === true);
                if (errors.privacy) setErrors((e) => ({ ...e, privacy: undefined }));
              }}
              aria-invalid={!!errors.privacy}
              className="mt-1 rounded-md border-slate-300 data-[state=checked]:bg-brand-orange data-[state=checked]:border-brand-orange"
            />
            <span className="text-xs md:text-sm leading-relaxed text-slate-600">
              {dict.contactView.privacyPrefix}{" "}
              <Link href="/legal/privacidad/" className="font-semibold text-slate-900 underline decoration-brand-orange underline-offset-4 hover:text-brand-orange">
                {dict.contactView.privacyLink}
              </Link>
              {dict.contactView.privacySuffix}
            </span>
          </label>
          {errors.privacy && <p className="mt-2 pl-7 text-xs text-destructive">{errors.privacy}</p>}
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 pt-6 border-t border-slate-200 sm:flex-row">
        <p className="flex items-center gap-2 text-xs text-slate-500">
          <Lock className="h-3.5 w-3.5 text-brand-orange" /> {dict.contactView.confidentialityNote}
        </p>
        <Button type="submit" size="lg" className="w-full sm:w-auto rounded-full px-8 h-14 bg-brand-orange text-white hover:bg-brand-orange-600 shadow-md transition-all duration-300 hover:scale-105" disabled={status === "sending"}>
          {status === "sending" ? (
            <>
              <Loader2 className="animate-spin mr-2" /> {dict.contactView.sending}
            </>
          ) : (
            <>
              {dict.contactView.sendBtn} <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}