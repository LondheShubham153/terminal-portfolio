import type { Project } from "@prisma/client";
import { SectionLabel } from "./SectionLabel";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="mx-auto max-w-4xl px-6 py-20">
      <SectionLabel index="§01" title="Projects" />
      {projects.length === 0 ? (
        <p className="font-mono text-sm text-term-fg-dim">// no projects added yet</p>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <a
              key={project.id}
              href={project.liveUrl ?? project.repoUrl ?? `#${project.slug}`}
              target="_blank"
              rel="noreferrer"
              className="group rounded-md border border-term-border bg-term-bg-raised p-5 transition-colors hover:border-term-green"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-mono text-base text-term-fg group-hover:text-term-green">
                  {project.title}
                </h3>
                <span className="font-mono text-xs text-term-fg-dim">
                  {project.tags.split(",").join(" · ")}
                </span>
              </div>
              <p className="mt-2 font-serif text-sm text-term-fg-dim">{project.summary}</p>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
