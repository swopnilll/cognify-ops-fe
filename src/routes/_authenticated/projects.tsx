import { createFileRoute } from "@tanstack/react-router";
import {  useState } from "react";

import {  useQuery } from "@tanstack/react-query";

import CognifyButton from "../../components/ui/CognigyButton";
import CreateProjectModal from "../../components/project/CreateProject";
import { fetchProjectsForUser } from "../../services/projectService";
import { useAuth } from "../../hooks/useAuthV2";
import ProjectTable from "../../components/ui/ProjectTable";

export const Route = createFileRoute("/_authenticated/projects")({
  component: Projects,
});

function Projects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user: authUser } = useAuth();

  const {
    data: projects = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["projects", authUser?.id],
    queryFn: () => fetchProjectsForUser(authUser!.id),
    enabled: !!authUser, // only run if user is available
  });

  return (
    <>
      <section className="flex flex-col items-center w-full h-[calc(100vh-80px)] gap-6 p-4 pt-16">
        <img
          src="images/projects-logo.svg"
          alt="Projects Logo"
          className="w-[120px] h-[120px]"
        />
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold text-[#1868DB]">
            Welcome to Cognify Ops
          </h1>
          <p className="text-[#7E899C] text-center text-sm leading-relaxed font-normal max-w-[540px] px-4">
            Where innovation meets efficiency. Harness the power of AI to
            simplify your project management, streamline workflows, and achieve
            unparalleled clarity in your operations.
          </p>
        </div>

        <CognifyButton
          label="Create Project"
          variant="outlined"
          customColor="#1868DB"
          textColor="white"
          onClick={() => setIsModalOpen(true)}
        />

        <section className="px-4 py-6">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading projects...</p>
          ) : isError ? (
            <p className="text-center text-red-500">Error loading projects.</p>
          ) : projects.length > 0 ? (
            <ProjectTable data={projects} />
          ) : (
            <p className="text-center text-gray-500">No projects found.</p>
          )}
        </section>
      </section>

      <CreateProjectModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onProjectCreated={refetch}
      />
    </>
  );
}
