import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PostForm } from "@/components/admin/PostForm";
import { ErrorBanner } from "@/components/admin/ErrorBanner";
import { updatePost } from "../../actions";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const post = await db.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <p className="font-mono text-term-green mb-6">$ edit post</p>
      <ErrorBanner show={error === "1"} />
      <PostForm action={updatePost.bind(null, id)} post={post} />
    </div>
  );
}
