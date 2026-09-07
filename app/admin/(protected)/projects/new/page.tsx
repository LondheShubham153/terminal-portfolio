import { ProjectForm } from "@/components/admin/ProjectForm";
import { ErrorBanner } from "@/components/admin/ErrorBanner";
import { createProject } from "../actions";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div>
      <p className="font-mono text-term-green mb-6">$ new project</p>
      <ErrorBanner show={error === "1"} />
      <ProjectForm action={createProject} />
    </div>
  );
}
