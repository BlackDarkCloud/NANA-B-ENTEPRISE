import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Nana B Enterprises",
  description: "Learn about Nana B Enterprises, a wholesale and retail home appliance shop serving Accra and customers across Ghana.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="site-shell grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-20">
        <div>
          <span className="eyebrow">About Nana B Enterprises</span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-brand-dark sm:text-5xl">Quality appliances for homes and businesses across Ghana.</h1>
          <p className="mt-6 text-base leading-8 text-slate-600">Nana B Enterprises is a wholesale and retail appliance business based in Makola, Accra. We supply dependable home, kitchen and lifestyle appliances with friendly support and nationwide delivery options.</p>
          <p className="mt-4 text-base leading-8 text-slate-600">Our goal is simple: make it easier for families, hostels, shops and growing businesses to find useful appliances at honest prices.</p>
          <Link href="/contact" className="btn-primary mt-8">Contact Nana B</Link>
        </div>
        <div className="overflow-hidden rounded-3xl bg-slate-50 p-4 shadow-xl">
          <Image src="/assets/nana-b-flyer.jpg" alt="Nana B Enterprises wholesale and retail appliances" width={1200} height={900} className="w-full rounded-2xl object-cover" />
        </div>
      </section>
    </div>
  );
}
