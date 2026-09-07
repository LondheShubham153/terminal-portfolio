import { db } from "@/lib/db";
import { ErrorBanner } from "@/components/admin/ErrorBanner";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { createTestimonial, deleteTestimonial } from "./actions";

export default async function AdminTestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const testimonials = await db.testimonial.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <p className="font-mono text-term-green mb-6">$ ls ./testimonials</p>
      <ErrorBanner show={error === "1"} />
      <form action={createTestimonial} className="grid gap-3 mb-8 font-mono text-sm max-w-2xl">
        <input name="authorName" placeholder="author name" required className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green" />
        <input name="authorRole" placeholder="author role (optional)" className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green" />
        <textarea name="quote" placeholder="quote" required rows={3} className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green" />
        <input name="avatarUrl" placeholder="avatar URL (optional)" className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green" />
        <button type="submit" className="justify-self-start rounded-md border border-term-green px-4 py-2 text-term-green hover:bg-term-green hover:text-term-bg">
          + add
        </button>
      </form>
      <div className="grid gap-2">
        {testimonials.map((t) => (
          <div key={t.id} className="flex items-center justify-between rounded-md border border-term-border bg-term-bg-raised px-4 py-2 font-mono text-sm">
            <span>{t.authorName}</span>
            <form action={deleteTestimonial.bind(null, t.id)}>
              <ConfirmSubmitButton confirmMessage={`Delete testimonial from "${t.authorName}"?`} className="text-[#e8534d] text-xs hover:underline">
                delete
              </ConfirmSubmitButton>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
