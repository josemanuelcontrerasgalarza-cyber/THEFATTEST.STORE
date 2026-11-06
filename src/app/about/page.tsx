import type { Metadata } from "next";
import { AboutContent } from "@/components/home/AboutContent";

export const metadata: Metadata = {
  title: "Nosotros — Más que ropa",
  description: "THEFATTEST es más que una tienda. Es una declaración, una cultura, una forma de moverse. Streetwear con identidad propia, hecho en Colombia.",
};

export default function AboutPage() {
  return <AboutContent />;
}
