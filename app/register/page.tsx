"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await response.json();
    if (!response.ok) { setError(data.error || "We could not create your account."); setLoading(false); return; }
    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    setLoading(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="site-shell grid min-h-[700px] items-center gap-10 py-12 lg:grid-cols-2">
      <div className="hidden rounded-3xl bg-brand-dark p-12 text-white lg:block">
        <span className="text-xs font-bold uppercase tracking-[.2em] text-white/50">Nana B customer account</span>
        <h2 className="mt-5 text-4xl font-black tracking-tight">One account. Easier shopping.</h2>
        <div className="mt-10 space-y-6">
          {["See every order and its current status", "Check out faster on your next purchase", "Keep your details linked to your orders"].map((item) => <p key={item} className="border-b border-white/10 pb-6 font-semibold">✓ {item}</p>)}
        </div>
      </div>
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <span className="eyebrow">Join Nana B</span>
        <h1 className="mt-3 text-3xl font-black text-brand-dark">Create your account</h1>
        <p className="mt-2 text-sm text-slate-500">It takes less than a minute.</p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div><label className="mb-1.5 block text-sm font-semibold">Full name</label><input required autoComplete="name" className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="mb-1.5 block text-sm font-semibold">Email address</label><input required type="email" autoComplete="email" className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><label className="mb-1.5 block text-sm font-semibold">Phone number</label><input type="tel" autoComplete="tel" className="form-input" placeholder="e.g. 0244 000 000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label className="mb-1.5 block text-sm font-semibold">Password</label><input required type="password" minLength={6} autoComplete="new-password" className="form-input" placeholder="At least 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-brand py-3.5 font-bold text-white hover:bg-brand-dark disabled:opacity-50">{loading ? "Creating account..." : "Create account"}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">Already registered? <Link href="/login" className="font-bold text-brand">Sign in</Link></p>
      </div>
    </div>
  );
}
