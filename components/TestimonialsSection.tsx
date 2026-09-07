import type { Testimonial } from "@prisma/client";
import { SectionLabel } from "./SectionLabel";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="mx-auto max-w-4xl px-6 py-20">
      <SectionLabel index="§04" title="Testimonials" />
      <div className="grid gap-4 sm:grid-cols-2">
        {testimonials.map((t) => (
          <figure
            key={t.id}
            className="rounded-md border border-term-border bg-term-bg-raised p-5"
          >
            <blockquote className="font-serif text-sm text-term-fg leading-relaxed">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-3 font-mono text-xs text-term-fg-dim">
              — {t.authorName}
              {t.authorRole ? `, ${t.authorRole}` : ""}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
