import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";

export const metadata: Metadata = { title: "Pedido generado", robots: { index: false } };

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <OrderConfirmation />
    </Suspense>
  );
}
