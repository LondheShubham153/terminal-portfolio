import { PostForm } from "@/components/admin/PostForm";
import { ErrorBanner } from "@/components/admin/ErrorBanner";
import { createPost } from "../actions";

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div>
      <p className="font-mono text-term-green mb-6">$ new post</p>
      <ErrorBanner show={error === "1"} />
      <PostForm action={createPost} />
    </div>
  );
}
