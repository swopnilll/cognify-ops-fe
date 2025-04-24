import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import * as React from "react";

export const Route = createFileRoute("/_authenticated/project/$projectId")({
  component: ProjectLayout,
});

function ProjectLayout(): React.JSX.Element {
  const { projectId } = Route.useParams();
  const [isNavCollapsed, setIsNavCollapsed] = React.useState(false);

  const [project, setProject] = React.useState({
    name: "Cognify Ops",
    description: "Software Project",
  });

  // TODO: Remove This
  React.useEffect(() => {
    setProject({
      name: "Cognify Ops",
      description: "Software Project",
    })
  }, [])

  return (
    <div className="relative flex h-[calc(100vh-100px)]">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 bg-white border-r border-t border-gray-300 overflow-hidden p-4 ${
          isNavCollapsed ? "w-[10px]" : "w-[400px]"
        }`}
      >
        {!isNavCollapsed && (
          <>
            <div className="flex gap-2 mt-4">
              <img
                src="/images/project-icon.png"
                alt="Project Icon"
                className="w-8"
              />
              <div>
                <p className="text-sm">{project.name}</p>
                <p className="text-xs">{project.description}</p>
              </div>
            </div>
            <nav className="mt-18 flex flex-col gap-4">
              <h2 className="text-lg text-[#5B6274] font-bold mb-6">
                PLANNING
              </h2>

              <Link
                to="/project/$projectId/kanbanView"
                params={{ projectId }}
                preload="intent"
                activeProps={{
                  className: "bg-[#F2F7FF] font-bold text-blue-600",
                }}
                className="hover:underline flex gap-2 items-center rounded-lg p-2 transition"
              >
                <img
                  src="/images/kanban-board-icon.png"
                  alt="Board Icon"
                  className="w-8 h-8"
                />
                <p className="text-center">Board</p>
              </Link>

              <Link
                to="/project/$projectId"
                params={{ projectId }}
                preload="intent"
                activeProps={{
                  className: "bg-[#F2F7FF] font-bold text-blue-600",
                }}
                className="hover:underline flex gap-2 items-center rounded-lg p-2 transition"
              >
                <img
                  src="/images/list-icon.png"
                  alt="Board Icon"
                  className="w-8 h-8"
                />
                <p className="text-center">List</p>
              </Link>

              <div className="mt-16 mb-8">
                <hr />
              </div>

              <Link
                to="/project/$projectId/ai-portal"
                params={{ projectId }}
                preload="intent"
                activeProps={{
                  className: "bg-[#F2F7FF] font-bold text-blue-600",
                }}
                className="hover:underline flex gap-2 items-center rounded-lg p-2 transition"
              >
                <img
                  src="/images/intellecta-logo.png"
                  alt="Ai Logo Icon"
                  className="w-8 h-8"
                />
                <p className="text-center">List</p>
              </Link>
          </nav>
          </>
        )}
      </div>

      {/* Toggle Button - pulled out of sidebar and into main flex container */}
      <button
        onClick={() => setIsNavCollapsed(!isNavCollapsed)}
        className="absolute top-4 left-[calc(200px-0.75rem)] z-20 flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white shadow-md transition-all duration-300"
        style={{
          left: isNavCollapsed ? "30px" : "400px",
          transform: "translateX(-50%)",
        }}
      >
        {isNavCollapsed ? "›" : "‹"}
      </button>

      {/* Right Content Panel */}
      <div className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  );
}
