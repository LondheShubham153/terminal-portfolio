"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin, runAdminAction } from "@/lib/admin-actions";

const skillSchema = z.object({
  name: z.string().trim().min(1).max(100),
  category: z.string().trim().min(1).max(100),
  level: z.coerce.number().int().min(1).max(5),
  order: z.coerce.number().int().default(0),
});

export async function createSkill(formData: FormData) {
  await requireAdmin();
  await runAdminAction(async () => {
    const data = skillSchema.parse({
      name: formData.get("name"),
      category: formData.get("category"),
      level: formData.get("level") || 3,
      order: formData.get("order") || 0,
    });
    await db.skill.create({ data });
    revalidatePath("/");
    revalidatePath("/admin/skills");
  }, "/admin/skills?error=1");
}

export async function deleteSkill(id: string) {
  await requireAdmin();
  await runAdminAction(async () => {
    await db.skill.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/skills");
  }, "/admin/skills?error=1");
}
