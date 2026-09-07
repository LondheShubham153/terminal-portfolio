import { PostForm } from "@/components/admin/PostForm";
import { createPost } from "../actions";

export default function NewPostPage() {
  return (
    <div>
      <p className="font-mono text-term-green mb-6">$ new post</p>
      <PostForm action={createPost} />
    </div>
  );
}
