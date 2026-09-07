"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
      return;
    }

    const data = await res.json().catch(() => null);
    setError(data?.error ?? "Login failed.");
    setSubmitting(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-term-bg px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-md border border-term-border bg-term-bg-raised p-6 font-mono text-sm"
      >
        <p className="text-term-green mb-4">$ admin login</p>
        <label className="grid gap-1 mb-4">
          <span className="text-term-fg-dim">email</span>
          <input
            type="email"
            name="email"
            required
            className="rounded-md border border-term-border bg-term-bg px-3 py-2 text-term-fg outline-none focus:border-term-green"
          />
        </label>
        <label className="grid gap-1 mb-4">
          <span className="text-term-fg-dim">password</span>
          <input
            type="password"
            name="password"
            required
            className="rounded-md border border-term-border bg-term-bg px-3 py-2 text-term-fg outline-none focus:border-term-green"
          />
        </label>
        {error && <p className="text-[#e8534d] mb-4">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md border border-term-green px-4 py-2 text-term-green transition-colors hover:bg-term-green hover:text-term-bg disabled:opacity-50"
        >
          {submitting ? "signing in…" : "$ sign in"}
        </button>
      </form>
    </main>
  );
}
