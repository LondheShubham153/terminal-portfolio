import { db } from "@/lib/db";
import { createSkill, deleteSkill } from "./actions";

export default async function AdminSkillsPage() {
  const skills = await db.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });

  return (
    <div>
      <p className="font-mono text-term-green mb-6">$ ls ./skills</p>
      <form action={createSkill} className="grid gap-3 sm:grid-cols-5 mb-8 font-mono text-sm">
        <input name="name" placeholder="name" required className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green" />
        <input name="category" placeholder="category" required className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green" />
        <input name="level" type="number" min={1} max={5} defaultValue={3} className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green" />
        <input name="order" type="number" defaultValue={0} className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green" />
        <button type="submit" className="rounded-md border border-term-green px-3 py-2 text-term-green hover:bg-term-green hover:text-term-bg">
          + add
        </button>
      </form>
      <div className="grid gap-2">
        {skills.map((skill) => (
          <div key={skill.id} className="flex items-center justify-between rounded-md border border-term-border bg-term-bg-raised px-4 py-2 font-mono text-sm">
            <span>
              {skill.name} <span className="text-term-fg-dim">— {skill.category}, level {skill.level}</span>
            </span>
            <form action={deleteSkill.bind(null, skill.id)}>
              <button type="submit" className="text-[#e8534d] text-xs hover:underline">delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
