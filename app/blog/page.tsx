import type { Metadata } from "next";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { getPublishedPosts } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog — Shubham Londhe",
  description: "Writing on software engineering, systems, and building things.",
};

export default async function BlogIndex() {
  const posts = await getPublishedPosts();

  return (
    <>
      <NavBar />
      <main className="flex-1 mx-auto max-w-4xl px-6 py-20 w-full">
        <h1 className="font-mono text-2xl text-term-fg mb-8">$ ls ./blog</h1>
        {posts.length === 0 ? (
          <p className="font-mono text-sm text-term-fg-dim">// no posts published yet</p>
        ) : (
          <ul className="space-y-6">
            {posts.map((post) => (
              <li key={post.id} className="border-b border-term-border pb-6">
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-mono text-lg text-term-fg hover:text-term-green"
                >
                  {post.title}
                </Link>
                <p className="mt-2 font-serif text-sm text-term-fg-dim">{post.excerpt}</p>
                {post.publishedAt && (
                  <p className="mt-2 font-mono text-xs text-term-fg-dim">
                    {post.publishedAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </>
  );
}
