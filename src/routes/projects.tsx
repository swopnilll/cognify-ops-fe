import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import Header from "../components/Header";
import { useAuth } from "../hooks/useAuth";
import CognifyButton from "../components/ui/CognigyButton";

export const Route = createFileRoute("/projects")({
  component: Projects,
});

function Projects() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate({ to: "/login", replace: true });
    return null;
  }

  return (
    <>
      <Header />
      <section className="flex flex-col items-center justify-center w-full h-[calc(100vh-80px)] gap-6 p-4">
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
        <Link to="/kanban">
        <CognifyButton
          label="Create Project"
          variant="outlined"
          customColor="#1868DB"
          textColor="white"
        />
      </Link>
      </section>
    </>
  );
}
