"use client";

import { motion } from "framer-motion";

export function Reveal({ children, delay = 0, className, y = 32 }: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <Reveal>
        <p className="font-mono text-[11px] tracking-[0.3em] text-ash">{eyebrow}</p>
        <h2 className="mt-3 font-display text-[clamp(44px,8vw,112px)] uppercase leading-[0.85] tracking-tight">{title}</h2>
      </Reveal>
      {children && <Reveal delay={0.1}>{children}</Reveal>}
    </div>
  );
}
