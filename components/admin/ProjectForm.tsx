import type { Project } from "@prisma/client";

export function ProjectForm({
  action,
  project,
}: {
  action: (formData: FormData) => Promise<void>;
  project?: Project;
}) {
  return (
    <form action={action} className="grid gap-4 font-mono text-sm max-w-2xl">
      <label className="grid gap-1">
        <span className="text-term-fg-dim">slug</span>
        <input
          name="slug"
          defaultValue={project?.slug}
          required
          className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green"
        />
      </label>
      <label className="grid gap-1">
        <span className="text-term-fg-dim">title</span>
        <input
          name="title"
          defaultValue={project?.title}
          required
          className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green"
        />
      </label>
      <label className="grid gap-1">
        <span className="text-term-fg-dim">summary</span>
        <input
          name="summary"
          defaultValue={project?.summary}
          required
          className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green"
        />
      </label>
      <label className="grid gap-1">
        <span className="text-term-fg-dim">description</span>
        <textarea
          name="description"
          defaultValue={project?.description}
          required
          rows={5}
          className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green"
        />
      </label>
      <label className="grid gap-1">
        <span className="text-term-fg-dim">tags (comma-separated)</span>
        <input
          name="tags"
          defaultValue={project?.tags}
          className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green"
        />
      </label>
      <label className="grid gap-1">
        <span className="text-term-fg-dim">image URL</span>
        <input
          name="imageUrl"
          defaultValue={project?.imageUrl ?? ""}
          className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green"
        />
      </label>
      <label className="grid gap-1">
        <span className="text-term-fg-dim">live URL</span>
        <input
          name="liveUrl"
          defaultValue={project?.liveUrl ?? ""}
          className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green"
        />
      </label>
      <label className="grid gap-1">
        <span className="text-term-fg-dim">repo URL</span>
        <input
          name="repoUrl"
          defaultValue={project?.repoUrl ?? ""}
          className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green"
        />
      </label>
      <label className="grid gap-1">
        <span className="text-term-fg-dim">order</span>
        <input
          type="number"
          name="order"
          defaultValue={project?.order ?? 0}
          className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green"
        />
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" name="featured" defaultChecked={project?.featured} />
        <span className="text-term-fg-dim">featured</span>
      </label>
      <button
        type="submit"
        className="justify-self-start rounded-md border border-term-green px-4 py-2 text-term-green transition-colors hover:bg-term-green hover:text-term-bg"
      >
        $ save
      </button>
    </form>
  );
}
