"use server";

import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { db } from "@/lib/db";
import { requireAdmin, runAdminAction } from "@/lib/admin-actions";

const ALLOWED_TYPE = "application/pdf";
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

// Local-disk upload for dev. On Vercel, the runtime filesystem is read-only,
// so production must swap this for a Vercel Blob `put()` call instead —
// see CLAUDE.md "Known constraints".
export async function uploadResume(formData: FormData) {
  await requireAdmin();
  await runAdminAction(async () => {
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      throw new Error("No file provided.");
    }
    if (file.type !== ALLOWED_TYPE) {
      throw new Error("Resume must be a PDF.");
    }
    if (file.size > MAX_SIZE_BYTES) {
      throw new Error("Resume must be under 5MB.");
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const fileName = `resume-${Date.now()}.pdf`;
    const filePath = path.join(uploadsDir, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Transaction so a concurrent upload can't leave two rows marked active.
    await db.$transaction([
      db.resume.updateMany({ data: { isActive: false } }),
      db.resume.create({
        data: { fileUrl: `/uploads/${fileName}`, fileName: file.name, isActive: true },
      }),
    ]);

    revalidatePath("/admin/resume");
    revalidatePath("/resume");
  }, "/admin/resume?error=1");
}
