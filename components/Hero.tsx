export function Hero() {
  return (
    <section className="terminal-texture border-b border-term-border">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <div className="rounded-md border border-term-border bg-term-bg-raised p-6 font-mono text-sm shadow-lg shadow-black/40">
          <div className="flex gap-2 mb-4">
            <span className="h-3 w-3 rounded-full bg-[#e8534d]" />
            <span className="h-3 w-3 rounded-full bg-term-amber" />
            <span className="h-3 w-3 rounded-full bg-term-green" />
          </div>
          <p className="text-term-fg-dim">
            <span className="text-term-green">shubham@portfolio</span>:~$ whoami
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold text-term-fg">
            Shubham Londhe<span className="cursor-blink" />
          </h1>
          <p className="mt-4 font-serif text-base leading-relaxed text-term-fg-dim max-w-xl">
            Software engineer building reliable, well-tested products. This site is itself
            a working full-stack app — content lives in a database, not hardcoded HTML.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 font-mono text-xs">
            <a href="#projects" className="text-term-green hover:underline">
              → view projects
            </a>
            <a href="/resume" className="text-term-amber hover:underline">
              → download resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
