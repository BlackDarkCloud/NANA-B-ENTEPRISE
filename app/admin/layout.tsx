import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/delivery-zones", label: "Delivery Zones" },
  { href: "/admin/coupons", label: "Coupons" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-48 bg-ink text-white shrink-0 hidden sm:block">
        <div className="p-4 font-bold text-brand">Nana B Admin</div>
        <nav className="flex flex-col">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="px-4 py-3 text-sm hover:bg-white/10">
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile top nav */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-ink text-white flex justify-around py-2 z-40 text-xs">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="px-2">
            {l.label}
          </Link>
        ))}
      </div>

      <main className="flex-1 p-4 pb-20 sm:pb-4">{children}</main>
    </div>
  );
}
