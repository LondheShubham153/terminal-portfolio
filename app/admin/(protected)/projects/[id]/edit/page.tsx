import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { ErrorBanner } from "@/components/admin/ErrorBanner";
import { updateProject } from "../../actions";

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const project = await db.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div>
      <p className="font-mono text-term-green mb-6">$ edit project</p>
      <ErrorBanner show={error === "1"} />
      <ProjectForm action={updateProject.bind(null, id)} project={project} />
    </div>
  );
}
