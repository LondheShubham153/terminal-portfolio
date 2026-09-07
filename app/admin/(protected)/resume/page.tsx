import { db } from "@/lib/db";
import { ErrorBanner } from "@/components/admin/ErrorBanner";
import { uploadResume } from "./actions";

export default async function AdminResumePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const active = await db.resume.findFirst({ where: { isActive: true }, orderBy: { uploadedAt: "desc" } });

  return (
    <div>
      <p className="font-mono text-term-green mb-6">$ resume</p>
      <ErrorBanner show={error === "1"} />
      {active ? (
        <p className="font-mono text-sm text-term-fg mb-6">
          current: <a href={active.fileUrl} className="text-term-amber hover:underline">{active.fileName}</a>
        </p>
      ) : (
        <p className="font-mono text-sm text-term-fg-dim mb-6">// no resume uploaded yet</p>
      )}
      <form action={uploadResume} className="flex items-center gap-4 font-mono text-sm">
        <input type="file" name="file" accept="application/pdf" required className="text-term-fg-dim" />
        <button type="submit" className="rounded-md border border-term-green px-4 py-2 text-term-green hover:bg-term-green hover:text-term-bg">
          $ upload
        </button>
      </form>
    </div>
  );
}
