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
