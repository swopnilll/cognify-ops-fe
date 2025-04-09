import React from "react";

import Header from "../../components/Header";
import ProjectCard from "../../components/ProjectsCard";
import CognigyButton from "../../components/ui/CognigyButton";

import { useNavigate } from "@tanstack/react-router";

const projectData = [
  {
    id: "1",
    keyCode: "HP",
    title: "HealthPro",
    description:
      "A comprehensive platform for managing healthcare tasks and communication across teams, patients, and hospitals.A comprehensive platform for managing healthcare tasks and communication across teams, patients, and hospitalsA comprehensive platform for managing healthcare tasks and communication across teams, patients, and hospitalsA comprehensive platform for managing healthcare tasks and communication across teams, patients, and hospitalsA comprehensive platform for managing healthcare tasks and communication across teams, patients, and hospitalsA comprehensive platform for managing healthcare tasks and communication across teams, patients, and hospitals",
  },
  {
    id: "2",
    keyCode: "FINX",
    title: "FinX Analytics",
    description:
      "Financial dashboarding and visualization suite with predictive analytics and live data streaming support.",
  },
  {
    id: "3",
    keyCode: "EDU101",
    title: "EduPlatform",
    description:
      "Online learning platform with assessments, progress tracking, and AI-based learning suggestions for students.",
  },
];

const ProjectList: React.FC = () => {
  const navigate = useNavigate();

  const handleProjectClick = (id: string) => {
    navigate({ to: `/projects/${id}` });
  };

  const handleCreateProject = () => {
    //todo: implementation
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-blue-50 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Projects</h1>
          <CognigyButton
            label="+ Create Project"
            variant="contained"
            customColor="blue"
            textColor="#fff"
            size="small"
            onClick={handleCreateProject}
            sx={{
              marginRight: "0.5rem",
              opacity: 0.7,
              "&:hover": {
                backgroundColor: "#1e40af", // blue-800
              },
            }}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-6 w-full">
          {projectData.map((proj) => (
            <ProjectCard
              key={proj.id}
              id={proj.id}
              title={proj.title}
              keyCode={proj.keyCode}
              description={proj.description}
              onClick={handleProjectClick}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ProjectList;
