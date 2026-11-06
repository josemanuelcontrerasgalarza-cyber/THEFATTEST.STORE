import Link from "next/link";
import { cn } from "@/lib/format";

/**
 * Stacked typographic logo:
 *   THE
 *   FATTEST
 *   ■ .STORE
 * Scale it with a font-size class (e.g. "text-[26px]"); every line is sized in em.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="THEFATTEST.STORE — inicio"
      className={cn("group inline-flex w-max flex-col items-start font-display uppercase leading-none", className)}
    >
      <span className="mb-[0.1em] text-[0.42em] leading-none tracking-[0.18em]" aria-hidden>
        THE
      </span>
      <span className="text-[1em] leading-[0.8] tracking-tight transition-colors duration-300 group-hover:text-acid" aria-hidden>
        FATTEST
      </span>
      <span className="mt-[0.2em] flex items-center gap-[0.35em] font-mono text-[0.3em] font-medium leading-none tracking-[0.42em] text-white/70" aria-hidden>
        <span className="inline-block size-[0.7em] bg-acid" />
        .STORE
      </span>
    </Link>
  );
}
