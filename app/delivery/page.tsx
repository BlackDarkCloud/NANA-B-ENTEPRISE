import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Appliance Delivery Across Ghana",
  description: "Learn about Nana B Enterprises appliance delivery in Accra and across Ghana, including delivery fees and estimated times.",
  alternates: { canonical: "/delivery" },
};

export default function DeliveryPage() {
  return (
    <div className="site-shell py-12 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <span className="eyebrow">Nationwide service</span>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-brand-dark">Appliance delivery across Ghana</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">Select your delivery area during checkout to see the current fee and estimated delivery time before payment.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[['01', 'Choose your appliance', 'Browse available products and add your preferred items to your bag.'], ['02', 'Select your location', 'Choose the applicable delivery zone during secure checkout.'], ['03', 'Track your order', 'Sign in anytime to follow your order from processing to delivery.']].map(([number, title, copy]) => (
            <div key={number} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="text-sm font-black text-brand-red">{number}</span>
              <h2 className="mt-4 text-lg font-black text-brand-dark">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-3xl bg-brand-dark p-7 text-white sm:flex sm:items-center sm:justify-between">
          <div><h2 className="text-2xl font-black">Need a delivery estimate?</h2><p className="mt-2 text-sm text-white/70">Chat with us before placing your order.</p></div>
          <a href="https://wa.me/233244018530" className="mt-5 inline-flex rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white sm:mt-0">Ask on WhatsApp</a>
        </div>
        <Link href="/" className="mt-8 inline-flex text-sm font-bold text-brand">Browse appliances →</Link>
      </div>
    </div>
  );
}
