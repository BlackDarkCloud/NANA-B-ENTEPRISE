import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SettingsForm from "@/components/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: (session?.user as any).id },
    select: { name: true, email: true, phone: true, emailNotifications: true, marketingEmails: true },
  });

  return (
    <div>
      <span className="eyebrow">Account preferences</span><h1 className="mt-2 text-3xl font-black text-brand-dark">Profile and settings</h1>
      <p className="mt-2 text-sm text-slate-500">Signed in as {user.email}. Contact support to change your email address.</p>
      <SettingsForm initial={{ name: user.name, phone: user.phone || "", emailNotifications: user.emailNotifications, marketingEmails: user.marketingEmails }} />
    </div>
  );
}
