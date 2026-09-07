"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin, runAdminAction } from "@/lib/admin-actions";
import { httpUrl } from "@/lib/validation";

const projectSchema = z.object({
  slug: z.string().trim().min(1).max(100).regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, hyphens only"),
  title: z.string().trim().min(1).max(150),
  summary: z.string().trim().min(1).max(300),
  description: z.string().trim().min(1).max(5000),
  imageUrl: httpUrl,
  liveUrl: httpUrl,
  repoUrl: httpUrl,
  tags: z.string().trim().max(200),
  featured: z.coerce.boolean().optional(),
  order: z.coerce.number().int().default(0),
});

function parseFormData(formData: FormData) {
  return projectSchema.parse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    liveUrl: formData.get("liveUrl"),
    repoUrl: formData.get("repoUrl"),
    tags: formData.get("tags"),
    featured: formData.get("featured") === "on",
    order: formData.get("order") || 0,
  });
}

export async function createProject(formData: FormData) {
  await requireAdmin();
  await runAdminAction(async () => {
    const data = parseFormData(formData);
    await db.project.create({ data });
    revalidatePath("/");
    revalidatePath("/admin/projects");
  }, "/admin/projects/new?error=1");
  redirect("/admin/projects");
}

export async function updateProject(id: string, formData: FormData) {
  await requireAdmin();
  await runAdminAction(async () => {
    const data = parseFormData(formData);
    await db.project.update({ where: { id }, data });
    revalidatePath("/");
    revalidatePath("/admin/projects");
  }, `/admin/projects/${id}/edit?error=1`);
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await runAdminAction(async () => {
    await db.project.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/projects");
  }, "/admin/projects?error=1");
}
