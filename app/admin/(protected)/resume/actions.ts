"use server";

import { revalidatePath } from "next/cache";
import { writeFile, mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { put, del } from "@vercel/blob";
import { db } from "@/lib/db";
import { requireAdmin, runAdminAction } from "@/lib/admin-actions";

const ALLOWED_TYPE = "application/pdf";
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

/**
 * Vercel's runtime filesystem is read-only outside /tmp, so production
 * (BLOB_READ_WRITE_TOKEN set) uploads to Vercel Blob; local dev without that
 * token falls back to writing into public/uploads directly.
 */
async function storeResumeFile(file: File, fileName: string): Promise<string> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(fileName, file, { access: "public", addRandomSuffix: false });
    return blob.url;
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, fileName), buffer);
  return `/uploads/${fileName}`;
}

/** Best-effort cleanup so old uploads don't accumulate indefinitely. */
async function deleteResumeFile(fileUrl: string): Promise<void> {
  try {
    if (fileUrl.startsWith("/uploads/")) {
      await unlink(path.join(process.cwd(), "public", fileUrl));
    } else {
      await del(fileUrl);
    }
  } catch (error) {
    console.error("Failed to delete previous resume file:", error);
  }
}

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

    const previous = await db.resume.findFirst({ where: { isActive: true } });

    const fileName = `resume-${Date.now()}-${crypto.randomUUID().slice(0, 8)}.pdf`;
    const fileUrl = await storeResumeFile(file, fileName);

    // Transaction so a concurrent upload can't leave two rows marked active.
    await db.$transaction([
      db.resume.updateMany({ data: { isActive: false } }),
      db.resume.create({
        data: { fileUrl, fileName: file.name, isActive: true },
      }),
    ]);

    if (previous) {
      await deleteResumeFile(previous.fileUrl);
    }

    revalidatePath("/admin/resume");
    revalidatePath("/resume");
  }, "/admin/resume?error=1");
}
