export function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-8">
      <span className="font-mono text-sm text-term-green">{index}</span>
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-term-fg-dim">
        {title}
      </span>
      <span className="flex-1 h-px bg-term-border" />
    </div>
  );
}
