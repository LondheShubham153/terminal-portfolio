import { db } from "@/lib/db";
import { createExperience, deleteExperience } from "./actions";

export default async function AdminExperiencePage() {
  const experience = await db.experience.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <p className="font-mono text-term-green mb-6">$ ls ./experience</p>
      <form action={createExperience} className="grid gap-3 sm:grid-cols-2 mb-8 font-mono text-sm max-w-2xl">
        <input name="role" placeholder="role" required className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green" />
        <input name="company" placeholder="company" required className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green" />
        <input name="location" placeholder="location (optional)" className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green" />
        <input name="order" type="number" placeholder="order" defaultValue={0} className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green" />
        <label className="grid gap-1 text-xs text-term-fg-dim">
          start date
          <input name="startDate" type="date" required className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green" />
        </label>
        <label className="grid gap-1 text-xs text-term-fg-dim">
          end date (blank = present)
          <input name="endDate" type="date" className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green" />
        </label>
        <textarea name="description" placeholder="description" required rows={3} className="sm:col-span-2 rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green" />
        <button type="submit" className="justify-self-start rounded-md border border-term-green px-4 py-2 text-term-green hover:bg-term-green hover:text-term-bg">
          + add
        </button>
      </form>
      <div className="grid gap-2">
        {experience.map((role) => (
          <div key={role.id} className="flex items-center justify-between rounded-md border border-term-border bg-term-bg-raised px-4 py-2 font-mono text-sm">
            <span>
              {role.role} <span className="text-term-fg-dim">@ {role.company}</span>
            </span>
            <form action={deleteExperience.bind(null, role.id)}>
              <button type="submit" className="text-[#e8534d] text-xs hover:underline">delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
