"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
        company: formData.get("company"), // honeypot
      }),
    });

    if (res.ok) {
      setStatus("success");
      form.reset();
    } else {
      const data = await res.json().catch(() => null);
      setErrorMessage(data?.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="font-mono text-sm text-term-green">
        $ message sent — thanks, I&apos;ll get back to you soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 font-mono text-sm">
      {/* Honeypot field — hidden from real users, bots tend to fill every input */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px]"
        aria-hidden="true"
      />
      <label className="grid gap-1">
        <span className="text-term-fg-dim">name</span>
        <input
          name="name"
          required
          maxLength={100}
          className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 text-term-fg outline-none focus:border-term-green"
        />
      </label>
      <label className="grid gap-1">
        <span className="text-term-fg-dim">email</span>
        <input
          type="email"
          name="email"
          required
          maxLength={200}
          className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 text-term-fg outline-none focus:border-term-green"
        />
      </label>
      <label className="grid gap-1">
        <span className="text-term-fg-dim">message</span>
        <textarea
          name="message"
          required
          maxLength={2000}
          rows={5}
          className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 text-term-fg outline-none focus:border-term-green"
        />
      </label>
      {status === "error" && <p className="text-[#e8534d]">{errorMessage}</p>}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="justify-self-start rounded-md border border-term-green px-4 py-2 text-term-green transition-colors hover:bg-term-green hover:text-term-bg disabled:opacity-50"
      >
        {status === "submitting" ? "sending…" : "$ send message"}
      </button>
    </form>
  );
}
