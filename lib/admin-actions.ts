import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "./auth";

/**
 * Every admin server action must call this before touching the DB.
 * Redirects to login rather than throwing, since a plain <form action>
 * calling a Server Action has no error boundary to catch a thrown error.
 */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

/**
 * Runs a mutating admin action's validation + DB work, catching any thrown
 * error (zod validation, Prisma "record not found" on a stale delete, etc.)
 * so a bad submission redirects back instead of crashing the Server Action
 * with no error boundary. `redirectTo` fires only on failure — success paths
 * still call their own `redirect()` after this returns.
 */
function isNextNavigationError(error: unknown): boolean {
  const digest = (error as { digest?: string } | null)?.digest;
  return typeof digest === "string" && (digest.startsWith("NEXT_REDIRECT") || digest.startsWith("NEXT_NOT_FOUND"));
}

export async function runAdminAction(work: () => Promise<void>, redirectTo: string) {
  try {
    await work();
  } catch (error) {
    // Next's redirect()/notFound() throw a special error to unwind the stack —
    // never swallow those, only genuine validation/DB failures.
    if (isNextNavigationError(error)) throw error;
    console.error("Admin action failed:", error);
    redirect(redirectTo);
  }
}
