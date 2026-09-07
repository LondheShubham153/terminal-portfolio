"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "dashboard" },
  { href: "/admin/projects", label: "projects" },
  { href: "/admin/blog", label: "blog" },
  { href: "/admin/skills", label: "skills" },
  { href: "/admin/experience", label: "experience" },
  { href: "/admin/testimonials", label: "testimonials" },
  { href: "/admin/resume", label: "resume" },
  { href: "/admin/messages", label: "messages" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-term-border">
      <nav className="mx-auto max-w-4xl px-6 py-4 flex flex-wrap items-center gap-4 font-mono text-xs">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              pathname === link.href || (link.href !== "/admin" && pathname.startsWith(`${link.href}/`))
                ? "text-term-green"
                : "text-term-fg-dim hover:text-term-fg transition-colors"
            }
          >
            {link.label}
          </Link>
        ))}
        <button onClick={handleLogout} className="ml-auto text-term-fg-dim hover:text-[#e8534d]">
          logout
        </button>
      </nav>
    </header>
  );
}
