"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-actions";

const postSchema = z.object({
  slug: z.string().trim().min(1).max(150).regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, hyphens only"),
  title: z.string().trim().min(1).max(200),
  excerpt: z.string().trim().min(1).max(500),
  contentMdx: z.string().trim().min(1).max(50000),
  coverImage: z.string().trim().max(500).optional().or(z.literal("")),
  published: z.coerce.boolean().optional(),
});

function parseFormData(formData: FormData) {
  return postSchema.parse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    contentMdx: formData.get("contentMdx"),
    coverImage: formData.get("coverImage"),
    published: formData.get("published") === "on",
  });
}

export async function createPost(formData: FormData) {
  await requireAdmin();
  const data = parseFormData(formData);
  await db.blogPost.create({
    data: { ...data, publishedAt: data.published ? new Date() : null },
  });
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function updatePost(id: string, formData: FormData) {
  await requireAdmin();
  const data = parseFormData(formData);
  const existing = await db.blogPost.findUnique({ where: { id } });
  await db.blogPost.update({
    where: { id },
    data: {
      ...data,
      publishedAt: data.published ? (existing?.publishedAt ?? new Date()) : null,
    },
  });
  revalidatePath("/blog");
  revalidatePath(`/blog/${data.slug}`);
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function deletePost(id: string) {
  await requireAdmin();
  await db.blogPost.delete({ where: { id } });
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}
