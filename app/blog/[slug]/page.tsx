import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { getPostBySlug } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
    },
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <NavBar />
      <main className="flex-1 mx-auto max-w-4xl px-6 py-20 w-full">
        <p className="font-mono text-xs text-term-fg-dim mb-2">$ cat {post.slug}.md</p>
        <h1 className="font-mono text-2xl text-term-fg mb-6">{post.title}</h1>
        <article className="prose-terminal font-serif text-sm leading-relaxed text-term-fg-dim max-w-none">
          <ReactMarkdown>{post.contentMdx}</ReactMarkdown>
        </article>
      </main>
      <Footer />
    </>
  );
}
