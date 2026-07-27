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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Registration failed");
      setLoading(false);
      return;
    }
    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    setLoading(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="px-4 py-10 max-w-sm mx-auto">
      <h1 className="text-lg font-semibold mb-4">Create Account</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input required placeholder="Full Name" className="w-full border rounded-lg p-3"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required type="email" placeholder="Email" className="w-full border rounded-lg p-3"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Phone" className="w-full border rounded-lg p-3"
          value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input required type="password" placeholder="Password (min 6 chars)" className="w-full border rounded-lg p-3"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-brand text-white rounded-lg py-3 font-semibold disabled:opacity-50">
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        Already have an account? <Link href="/login" className="text-brand underline">Sign In</Link>
      </p>
    </div>
  );
}
