import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout · Pago seguro",
  description: "Completa tu reservación de experiencias destinolibre.",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}