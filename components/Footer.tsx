import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contact" className="mb-16 bg-brand-dark text-white md:mb-0">
      <div className="site-shell grid gap-10 py-12 md:grid-cols-[1.3fr_.8fr_.8fr_1fr]">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <Image src="/assets/nana-b-logo.jpg" alt="" width={54} height={54} className="h-14 w-14 rounded-xl object-cover object-top" />
            <div><p className="text-lg font-extrabold">Nana B Enterprises</p><p className="text-xs text-white/60">Wholesale and retail</p></div>
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/70">Trusted home, kitchen and lifestyle appliances, carefully selected for homes and businesses across Ghana.</p>
        </div>
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-wider text-white/50">Shop</p>
          <div className="space-y-3 text-sm text-white/75">
            <Link href="/category/home-appliances" className="block hover:text-white">Home appliances</Link>
            <Link href="/category/kitchen-dining" className="block hover:text-white">Kitchen & dining</Link>
            <Link href="/category/lifestyle" className="block hover:text-white">Lifestyle</Link>
            <Link href="/account/orders" className="block hover:text-white">Track my orders</Link>
          </div>
        </div>
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-wider text-white/50">Call or WhatsApp</p>
          <div className="space-y-3 text-sm">
            <a href="tel:+233244018530" className="block font-semibold hover:text-white/70">0244 018 530</a>
            <a href="https://wa.me/233505580710" className="block font-semibold hover:text-white/70">0505 580 710</a>
            <a href="https://wa.me/233505580710" className="block text-white/70 hover:text-white">Message us on WhatsApp</a>
          </div>
        </div>
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-wider text-white/50">Visit our shop</p>
          <p className="text-sm leading-6 text-white/75">Makola Shopping Mall, opposite Georgina Stores, Angelina House, 1st Floor, Shop 31.</p>
          <p className="mt-4 text-xs font-semibold text-white">@NaNa_B_Enterprises</p>
          <p className="mt-2 text-xs text-white/60">Instagram • Facebook • TikTok • X • Snapchat</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">© {new Date().getFullYear()} Nana B Enterprises. Home of quality and professional appliances.</div>
    </footer>
  );
}
