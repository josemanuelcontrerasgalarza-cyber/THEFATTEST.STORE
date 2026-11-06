"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, AlertTriangle, X } from "lucide-react";
import { useToast } from "@/store/toast";

export function Toaster() {
  const { toasts, dismiss } = useToast();
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[80] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-start sm:pl-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex w-full max-w-sm items-start gap-3 border border-white/10 bg-cement/95 px-4 py-3 shadow-2xl backdrop-blur"
          >
            <span className={`mt-0.5 grid size-5 shrink-0 place-items-center ${t.tone === "error" ? "bg-danger text-ink" : "bg-acid text-ink"}`}>
              {t.tone === "error" ? <AlertTriangle className="size-3" /> : <Check className="size-3" strokeWidth={3} />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold uppercase tracking-wide">{t.title}</p>
              {t.description && <p className="mt-0.5 text-xs text-ash">{t.description}</p>}
            </div>
            <button onClick={() => dismiss(t.id)} aria-label="Cerrar notificación" className="text-ash hover:text-bone">
              <X className="size-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
