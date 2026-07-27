"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) setError("That email or password is not correct.");
    else {
      const session = await fetch("/api/auth/session").then((response) => response.json());
      router.push(session?.user?.role === "ADMIN" ? "/admin" : "/account");
      router.refresh();
    }
  }

  return (
    <div className="site-shell grid min-h-[650px] items-center gap-10 py-12 lg:grid-cols-2">
      <div className="hidden overflow-hidden rounded-3xl bg-brand-dark lg:block">
        <img src="/assets/appliance-showroom.png" alt="" className="h-[560px] w-full object-cover object-[65%_center] opacity-90" />
      </div>
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <span className="eyebrow">Welcome back</span>
        <h1 className="mt-3 text-3xl font-black text-brand-dark">Sign in to your account</h1>
        <p className="mt-2 text-sm text-slate-500">View your orders and enjoy a faster checkout.</p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div><label className="mb-1.5 block text-sm font-semibold">Email address</label><input required type="email" autoComplete="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><label className="mb-1.5 block text-sm font-semibold">Password</label><input required type="password" autoComplete="current-password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-brand py-3.5 font-bold text-white hover:bg-brand-dark disabled:opacity-50">{loading ? "Signing in..." : "Sign in"}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">New to Nana B? <Link href="/register" className="font-bold text-brand">Create an account</Link></p>
        <div className="mt-5 border-t border-slate-100 pt-5 text-center">
          <Link href="/admin/login" className="text-xs font-bold text-slate-500 hover:text-brand">Administrator sign in →</Link>
        </div>
      </div>
    </div>
  );
}
