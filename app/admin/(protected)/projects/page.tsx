import Link from "next/link";
import { db } from "@/lib/db";
import { deleteProject } from "./actions";

export default async function AdminProjectsPage() {
  const projects = await db.project.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="font-mono text-term-green">$ ls ./projects</p>
        <Link
          href="/admin/projects/new"
          className="font-mono text-xs rounded-md border border-term-green px-3 py-1.5 text-term-green hover:bg-term-green hover:text-term-bg"
        >
          + new project
        </Link>
      </div>
      <div className="grid gap-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between rounded-md border border-term-border bg-term-bg-raised px-4 py-3"
          >
            <div>
              <p className="font-mono text-sm text-term-fg">{project.title}</p>
              <p className="font-mono text-xs text-term-fg-dim">/{project.slug}</p>
            </div>
            <div className="flex gap-3 font-mono text-xs">
              <Link href={`/admin/projects/${project.id}/edit`} className="text-term-amber hover:underline">
                edit
              </Link>
              <form action={deleteProject.bind(null, project.id)}>
                <button type="submit" className="text-[#e8534d] hover:underline">
                  delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
