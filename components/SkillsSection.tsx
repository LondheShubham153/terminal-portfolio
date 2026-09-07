import type { Skill } from "@prisma/client";
import { SectionLabel } from "./SectionLabel";

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const byCategory = new Map<string, Skill[]>();
  for (const skill of skills) {
    const list = byCategory.get(skill.category) ?? [];
    list.push(skill);
    byCategory.set(skill.category, list);
  }

  return (
    <section id="skills" className="mx-auto max-w-4xl px-6 py-20">
      <SectionLabel index="§02" title="Skills" />
      <div className="grid gap-6 sm:grid-cols-2">
        {Array.from(byCategory.entries()).map(([category, items]) => (
          <div key={category}>
            <p className="font-mono text-xs uppercase tracking-wider text-term-amber mb-2">
              {category}
            </p>
            <ul className="space-y-1">
              {items.map((skill) => (
                <li key={skill.id} className="font-mono text-sm text-term-fg flex items-center gap-2">
                  <span className="text-term-green">{"".padStart(skill.level, "#").padEnd(5, "-")}</span>
                  <span>{skill.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
