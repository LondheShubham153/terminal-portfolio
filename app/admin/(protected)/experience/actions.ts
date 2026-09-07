"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-actions";

const experienceSchema = z.object({
  role: z.string().trim().min(1).max(150),
  company: z.string().trim().min(1).max(150),
  location: z.string().trim().max(150).optional().or(z.literal("")),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().or(z.literal("").transform(() => undefined)),
  description: z.string().trim().min(1).max(2000),
  order: z.coerce.number().int().default(0),
});

export async function createExperience(formData: FormData) {
  await requireAdmin();
  const data = experienceSchema.parse({
    role: formData.get("role"),
    company: formData.get("company"),
    location: formData.get("location"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") || undefined,
    description: formData.get("description"),
    order: formData.get("order") || 0,
  });
  await db.experience.create({ data });
  revalidatePath("/");
  revalidatePath("/admin/experience");
}

export async function deleteExperience(id: string) {
  await requireAdmin();
  await db.experience.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/experience");
}
