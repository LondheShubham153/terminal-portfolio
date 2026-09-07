import type { Experience } from "@prisma/client";
import { SectionLabel } from "./SectionLabel";

function formatRange(start: Date, end: Date | null) {
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  return `${fmt(start)} — ${end ? fmt(end) : "present"}`;
}

export function ExperienceSection({ experience }: { experience: Experience[] }) {
  return (
    <section id="experience" className="mx-auto max-w-4xl px-6 py-20">
      <SectionLabel index="§03" title="Experience" />
      {experience.length === 0 ? (
        <p className="font-mono text-sm text-term-fg-dim">// no experience added yet</p>
      ) : (
        <ol className="space-y-6 border-l border-term-border pl-6">
          {experience.map((role) => (
            <li key={role.id} className="relative">
              <span className="absolute -left-[29px] top-1 h-2 w-2 rounded-full bg-term-green" />
              <p className="font-mono text-xs text-term-fg-dim">
                {formatRange(role.startDate, role.endDate)}
              </p>
              <h3 className="font-mono text-base text-term-fg mt-1">
                {role.role} <span className="text-term-fg-dim">@ {role.company}</span>
              </h3>
              <p className="mt-1 font-serif text-sm text-term-fg-dim">{role.description}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
