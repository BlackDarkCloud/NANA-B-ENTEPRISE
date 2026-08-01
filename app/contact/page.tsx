import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Nana B Enterprises",
  description: "Call, WhatsApp or follow Nana B Enterprises. Visit our appliance shop at Makola Shopping Mall in Accra, Ghana.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="site-shell py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <span className="eyebrow">Contact and social media</span>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-brand-dark">Connect with Nana B Enterprises</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">Ask about products, wholesale prices, availability and delivery throughout Ghana.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <a href="tel:+233244018530" className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><span className="eyebrow">Call us</span><strong className="mt-3 block text-2xl text-brand-dark">0244 018 530</strong></a>
          <a href="https://wa.me/233244018530" className="rounded-3xl bg-[#25D366] p-7 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><span className="text-xs font-black uppercase tracking-[.18em] text-white/75">WhatsApp</span><strong className="mt-3 block text-2xl">Chat with Nana B</strong></a>
          <a href="https://www.instagram.com/nana_b_enterprises?igsh=YWFuejd3ZXY3dXFq&utm_source=qr" target="_blank" rel="noopener noreferrer" className="rounded-3xl bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] p-7 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><span className="text-xs font-black uppercase tracking-[.18em] text-white/75">Instagram</span><strong className="mt-3 block text-2xl">@nana_b_enterprises</strong></a>
          <a href="https://www.facebook.com/share/1GC8MPxyDJ/" target="_blank" rel="noopener noreferrer" className="rounded-3xl bg-[#1877F2] p-7 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><span className="text-xs font-black uppercase tracking-[.18em] text-white/75">Facebook</span><strong className="mt-3 block text-2xl">Nana B Enterprises</strong></a>
        </div>
        <div className="mt-8 rounded-3xl bg-brand-dark p-8 text-white">
          <span className="text-xs font-black uppercase tracking-[.18em] text-white/50">Visit the shop</span>
          <h2 className="mt-3 text-2xl font-black">Makola Shopping Mall, Accra</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">Opposite Georgina Stores, Angelina House, 1st Floor, Shop 31.</p>
        </div>
      </div>
    </div>
  );
}
