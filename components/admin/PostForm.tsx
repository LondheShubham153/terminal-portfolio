import type { BlogPost } from "@prisma/client";

export function PostForm({
  action,
  post,
}: {
  action: (formData: FormData) => Promise<void>;
  post?: BlogPost;
}) {
  return (
    <form action={action} className="grid gap-4 font-mono text-sm max-w-2xl">
      <label className="grid gap-1">
        <span className="text-term-fg-dim">slug</span>
        <input name="slug" defaultValue={post?.slug} required className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green" />
      </label>
      <label className="grid gap-1">
        <span className="text-term-fg-dim">title</span>
        <input name="title" defaultValue={post?.title} required className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green" />
      </label>
      <label className="grid gap-1">
        <span className="text-term-fg-dim">excerpt</span>
        <input name="excerpt" defaultValue={post?.excerpt} required className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green" />
      </label>
      <label className="grid gap-1">
        <span className="text-term-fg-dim">content (Markdown)</span>
        <textarea name="contentMdx" defaultValue={post?.contentMdx} required rows={12} className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green font-mono" />
      </label>
      <label className="grid gap-1">
        <span className="text-term-fg-dim">cover image URL</span>
        <input name="coverImage" defaultValue={post?.coverImage ?? ""} className="rounded-md border border-term-border bg-term-bg-raised px-3 py-2 outline-none focus:border-term-green" />
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" name="published" defaultChecked={post?.published} />
        <span className="text-term-fg-dim">published</span>
      </label>
      <button type="submit" className="justify-self-start rounded-md border border-term-green px-4 py-2 text-term-green hover:bg-term-green hover:text-term-bg">
        $ save
      </button>
    </form>
  );
}
