import Link from "next/link";
import { cn } from "@/lib/utils";

/** Ave abstracta en vuelo + sol naciente: "Libertad y nuevos horizontes". */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 52 52" className={cn("h-9 w-auto", className)} aria-hidden="true">
      <circle cx="26" cy="26" r="26" fill="#F97316" /> {/* orange-500 */}
      <path d="M12 34L26 14L40 34H32L26 24L20 34H12Z" fill="#F8FAFC" /> {/* slate-50 */}
      <path d="M26 42L18 34H34L26 42Z" fill="#38BDF8" /> {/* sky-400 */}
    </svg>
  );
}

export function Logo({
  className,
  tone = "dark",
  showDomain = false,
}: {
  className?: string;
  tone?: "dark" | "light";
  showDomain?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Destino Libre — inicio"
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <LogoMark className="h-8 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[1.45rem] font-bold tracking-tight",
            tone === "dark" ? "text-slate-900" : "text-slate-50",
          )}
        >
          destinolibre
        </span>
        {showDomain && (
          <span
            className={cn(
              "mt-1 font-mono text-[0.55rem] uppercase tracking-[0.2em]",
              tone === "dark" ? "text-slate-500" : "text-slate-400",
            )}
          >
            .mx
          </span>
        )}
      </span>
    </Link>
  );
}