import Link from "next/link";
import { db } from "@/lib/db";
import { deletePost } from "./actions";

export default async function AdminBlogPage() {
  const posts = await db.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="font-mono text-term-green">$ ls ./blog</p>
        <Link
          href="/admin/blog/new"
          className="font-mono text-xs rounded-md border border-term-green px-3 py-1.5 text-term-green hover:bg-term-green hover:text-term-bg"
        >
          + new post
        </Link>
      </div>
      <div className="grid gap-3">
        {posts.map((post) => (
          <div key={post.id} className="flex items-center justify-between rounded-md border border-term-border bg-term-bg-raised px-4 py-3">
            <div>
              <p className="font-mono text-sm text-term-fg">
                {post.title} {!post.published && <span className="text-term-fg-dim">(draft)</span>}
              </p>
              <p className="font-mono text-xs text-term-fg-dim">/{post.slug}</p>
            </div>
            <div className="flex gap-3 font-mono text-xs">
              <Link href={`/admin/blog/${post.id}/edit`} className="text-term-amber hover:underline">edit</Link>
              <form action={deletePost.bind(null, post.id)}>
                <button type="submit" className="text-[#e8534d] hover:underline">delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
