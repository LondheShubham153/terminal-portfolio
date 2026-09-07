"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin, runAdminAction } from "@/lib/admin-actions";

export async function markMessageRead(id: string) {
  await requireAdmin();
  await runAdminAction(async () => {
    await db.contactMessage.update({ where: { id }, data: { read: true } });
    revalidatePath("/admin/messages");
  }, "/admin/messages?error=1");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await runAdminAction(async () => {
    await db.contactMessage.delete({ where: { id } });
    revalidatePath("/admin/messages");
  }, "/admin/messages?error=1");
}
