import Link from "next/link";
import { cn } from "@/lib/format";

export function Logo({ className, withDomain = false }: { className?: string; withDomain?: boolean }) {
  return (
    <Link href="/" aria-label="THEFATTEST — inicio" className={cn("group inline-flex items-baseline font-display leading-none tracking-tight", className)}>
      <span>THE</span>
      <span className="transition-colors duration-300 group-hover:text-acid">FATTEST</span>
      {withDomain ? <span className="ml-1 font-mono text-[0.35em] tracking-[0.2em] text-ash">.STORE</span> : <span className="ml-0.5 inline-block size-[0.18em] translate-y-[-0.05em] bg-acid" aria-hidden />}
    </Link>
  );
}
