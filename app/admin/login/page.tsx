"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setError("The administrator email or password is not correct.");
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="site-shell flex min-h-[680px] items-center justify-center py-12">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl lg:grid-cols-[.9fr_1.1fr]">
        <div className="bg-brand-dark p-8 text-white sm:p-10">
          <span className="text-xs font-bold uppercase tracking-[.2em] text-white/50">Private management area</span>
          <h1 className="mt-5 text-4xl font-black tracking-tight">Run the store with confidence.</h1>
          <p className="mt-4 text-sm leading-6 text-white/65">Review new orders, update delivery progress, manage products, stock, delivery zones and offers.</p>
          <div className="mt-10 space-y-4 text-sm font-semibold text-white/80">
            <p>✓ Customer status notifications</p>
            <p>✓ Secure role-protected access</p>
            <p>✓ Orders and revenue overview</p>
          </div>
        </div>
        <div className="p-8 sm:p-10">
          <span className="eyebrow">Administrator access</span>
          <h2 className="mt-3 text-3xl font-black text-brand-dark">Sign in to the admin panel</h2>
          <p className="mt-2 text-sm text-slate-500">Use the administrator credentials configured for this store.</p>
          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div><label className="mb-1.5 block text-sm font-semibold">Admin email</label><input required type="email" autoComplete="email" className="form-input" value={email} onChange={(event) => setEmail(event.target.value)} /></div>
            <div><label className="mb-1.5 block text-sm font-semibold">Password</label><input required type="password" autoComplete="current-password" className="form-input" value={password} onChange={(event) => setPassword(event.target.value)} /></div>
            {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button disabled={loading} className="w-full rounded-xl bg-brand py-3.5 font-bold text-white hover:bg-brand-dark disabled:opacity-50">{loading ? "Checking access..." : "Open admin panel"}</button>
          </form>
          <div className="mt-6 flex items-center justify-between text-xs">
            <Link href="/" className="font-semibold text-slate-500 hover:text-brand">Back to store</Link>
            <Link href="/login" className="font-semibold text-brand">Customer sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
