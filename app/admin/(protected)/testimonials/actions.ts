"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin, runAdminAction } from "@/lib/admin-actions";
import { httpUrl } from "@/lib/validation";

const testimonialSchema = z.object({
  authorName: z.string().trim().min(1).max(150),
  authorRole: z.string().trim().max(150).optional().or(z.literal("")),
  quote: z.string().trim().min(1).max(1000),
  avatarUrl: httpUrl,
  order: z.coerce.number().int().default(0),
});

export async function createTestimonial(formData: FormData) {
  await requireAdmin();
  await runAdminAction(async () => {
    const data = testimonialSchema.parse({
      authorName: formData.get("authorName"),
      authorRole: formData.get("authorRole"),
      quote: formData.get("quote"),
      avatarUrl: formData.get("avatarUrl"),
      order: formData.get("order") || 0,
    });
    await db.testimonial.create({ data });
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
  }, "/admin/testimonials?error=1");
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  await runAdminAction(async () => {
    await db.testimonial.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
  }, "/admin/testimonials?error=1");
}
