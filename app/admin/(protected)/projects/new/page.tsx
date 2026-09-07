import { ProjectForm } from "@/components/admin/ProjectForm";
import { createProject } from "../actions";

export default function NewProjectPage() {
  return (
    <div>
      <p className="font-mono text-term-green mb-6">$ new project</p>
      <ProjectForm action={createProject} />
    </div>
  );
}
