export function ErrorBanner({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <p className="mb-4 rounded-md border border-[#e8534d] bg-[#e8534d1a] px-3 py-2 font-mono text-xs text-[#e8534d]">
      Save failed — check required fields and that any URL fields are valid, then try again.
    </p>
  );
}
