import PricingClient from "./PricingClient";

export const metadata = {
  title: "Pricing — Kittie",
  description: "Choose a plan that fits your team. Stop sending your assets through zip files.",
};

export default function Page() {
  return <PricingClient />;
}