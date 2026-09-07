export function Footer() {
  return (
    <footer className="border-t border-term-border mt-auto">
      <div className="mx-auto max-w-4xl px-6 py-8 font-mono text-xs text-term-fg-dim flex justify-between">
        <span>© {new Date().getFullYear()} Shubham Londhe</span>
        <span>built with Next.js + SQLite</span>
      </div>
    </footer>
  );
}
