import Link from "next/link";

const LINKS = [
  { href: "#projects", label: "projects" },
  { href: "#skills", label: "skills" },
  { href: "#experience", label: "experience" },
  { href: "/blog", label: "blog" },
  { href: "#contact", label: "contact" },
];

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-term-border bg-term-bg/90 backdrop-blur">
      <nav className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between font-mono text-sm">
        <Link href="/" className="text-term-green">
          ~/shubham
        </Link>
        <ul className="flex gap-6 text-term-fg-dim">
          {LINKS.map((link) =>
            link.href.startsWith("#") ? (
              <li key={link.href}>
                <a href={link.href} className="hover:text-term-green transition-colors">
                  {link.label}
                </a>
              </li>
            ) : (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-term-green transition-colors">
                  {link.label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </nav>
    </header>
  );
}
