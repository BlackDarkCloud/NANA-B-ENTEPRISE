import { auth } from "@/lib/auth";
import AccountNav from "@/components/AccountNav";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="site-shell grid gap-6 py-8 md:grid-cols-[220px_1fr] md:py-12">
      <AccountNav />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
