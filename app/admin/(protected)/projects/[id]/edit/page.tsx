import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { updateProject } from "../../actions";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await db.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div>
      <p className="font-mono text-term-green mb-6">$ edit project</p>
      <ProjectForm action={updateProject.bind(null, id)} project={project} />
    </div>
  );
}
