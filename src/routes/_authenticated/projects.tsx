import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { useMutation } from "@tanstack/react-query";

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

  const [projects, setProjects] = useState<any[]>([]);

  const {user: authUser} = useAuth();

  const mutation = useMutation({
    mutationFn: fetchProjectsForUser,
    onSuccess: (data) => {
      console.log("Mutation successful:", data);
      setProjects(data);
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  useEffect(() => {
    if (authUser) {
      mutation.mutate(authUser.id);
    } else {
      console.error("User is not authenticated");
    }
  }, [])

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
          {projects.length > 0 ? (
            <ProjectTable data={projects} />
          ) : (
            <p className="text-center text-gray-500">No projects found.</p>
          )}
        </section>
      </section>

      <CreateProjectModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
