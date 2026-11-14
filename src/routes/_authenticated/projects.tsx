import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FolderKanban, Plus } from "lucide-react";

import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import CreateProjectModal from "../../components/project/CreateProject";
import { Project, useProjects } from "../../hooks/useProject";

export const Route = createFileRoute("/_authenticated/projects")({
  component: Projects,
});

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to="/project/$projectId/kanbanView"
      params={{ projectId: project.project_id.toString() }}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-lg bg-brand-50 px-2 text-xs font-bold tracking-wide text-brand-700">
          {project.project_key}
        </span>
        <h2 className="truncate text-base font-semibold text-slate-900 group-hover:text-brand-700">
          {project.name}
        </h2>
      </div>
      <p className="mt-3 line-clamp-2 min-h-10 text-sm text-slate-500">
        {project.description || "No description"}
      </p>
      <p className="mt-4 text-xs text-slate-400">Created {formatDate(project.created_at)}</p>
    </Link>
  );
}

function Projects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: projects = [], isLoading, isError, refetch } = useProjects();

  const newProjectButton = (
    <Button icon={<Plus className="h-4 w-4" />} onClick={() => setIsModalOpen(true)}>
      New project
    </Button>
  );

  const renderContent = () => {
    if (isLoading) return <Spinner />;

    if (isError) {
      return (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Your projects could not be loaded.{" "}
          <button type="button" onClick={() => refetch()} className="font-medium underline">
            Try again
          </button>
        </div>
      );
    }

    if (projects.length === 0) {
      return (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <FolderKanban className="h-6 w-6" />
          </span>
          <h2 className="mt-4 text-base font-semibold text-slate-900">No projects yet</h2>
          <p className="mb-6 mt-1 max-w-sm text-sm text-slate-500">
            Create your first project to get a board for your tasks and an assistant that
            knows them.
          </p>
          {newProjectButton}
        </div>
      );
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.project_id} project={project} />
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Projects</h1>
          <p className="mt-1 text-sm text-slate-500">
            {projects.length === 1 ? "1 project" : `${projects.length} projects`}
          </p>
        </div>
        {projects.length > 0 && newProjectButton}
      </div>

      {renderContent()}

      <CreateProjectModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onProjectCreated={refetch}
      />
    </div>
  );
}
