import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminNav } from "@/components/AdminNav";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-term-bg text-term-fg">
      <AdminNav />
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
