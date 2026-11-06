"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { waLink } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/config";

const topics = [
  { label: "Consultar un producto", text: "Hola THEFATTEST 👋 Quiero consultar por un producto." },
  { label: "Preguntar por tallas", text: "Hola THEFATTEST 👋 ¿Me ayudan con la guía de tallas?" },
  { label: "Disponibilidad", text: "Hola THEFATTEST 👋 ¿Qué tienen disponible ahora mismo?" },
  { label: "Asesoría de outfit", text: "Hola THEFATTEST 👋 Quiero asesoría personalizada para armar un outfit." },
  { label: "Confirmar un pedido", text: "Hola THEFATTEST 👋 Quiero confirmar mi pedido. Mi código es: " },
];

export function WhatsAppFloat() {
  const [open, setOpen] = useState(false);
  const configured = !!siteConfig.whatsappNumber;

  return (
    <div className="fixed bottom-5 right-4 z-[65] sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-[72px] right-0 w-[min(88vw,320px)] origin-bottom-right border border-white/10 bg-cement shadow-2xl"
            role="dialog"
            aria-label="Chatea con THEFATTEST"
          >
            <div className="border-b border-white/10 p-4">
              <p className="font-display text-2xl leading-none">HABLEMOS.</p>
              <p className="mt-1 text-xs text-ash">Respuesta directa por WhatsApp. Elige un tema:</p>
            </div>
            {configured ? (
              <ul className="p-2">
                {topics.map((t) => (
                  <li key={t.label}>
                    <a
                      href={waLink(t.text)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-3 py-2.5 text-sm transition hover:bg-white/5 hover:text-acid"
                    >
                      {t.label}
                      <MessageCircle className="size-4 text-ash" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-4 text-xs leading-relaxed text-ash">
                El número de WhatsApp aún no está configurado. Mientras tanto escríbenos por Instagram{" "}
                <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-bone underline">
                  {siteConfig.instagramHandle}
                </a>
                .
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.92 }}
        aria-label={open ? "Cerrar chat de WhatsApp" : "Abrir chat de WhatsApp"}
        aria-expanded={open}
        className="relative grid size-14 place-items-center rounded-full bg-[#25D366] text-ink shadow-[0_10px_30px_-5px_rgba(37,211,102,0.5)] transition hover:brightness-110"
      >
        {!open && <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-20 [animation-duration:2.5s]" aria-hidden />}
        {open ? <X className="size-6" /> : <WhatsAppIcon className="size-7" />}
      </motion.button>
    </div>
  );
}
