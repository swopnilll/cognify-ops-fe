import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import * as React from "react";

export const Route = createFileRoute("/_authenticated/project/$projectId")({
  component: ProjectLayout,
});

function ProjectLayout(): React.JSX.Element {
  const { projectId } = Route.useParams();
  const [isNavCollapsed, setIsNavCollapsed] = React.useState(false);

  return (
    <div className="relative flex h-[calc(100vh-80px)]">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 bg-white border-r border-t border-gray-300 overflow-hidden p-4 ${
          isNavCollapsed ? "w-[10px]" : "w-[200px]"
        }`}
      >
        {!isNavCollapsed && (
          <nav className="mt-8 flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Project: {projectId}</h3>
            <Link
              to="/project/$projectId"
              params={{ projectId }}
              preload="intent"
              activeProps={{ className: "font-bold text-blue-600" }}
              className="hover:underline"
            >
              Overview
            </Link>
            <Link
              to="/project/$projectId/kanbanView"
              params={{ projectId }}
              preload="intent"
              activeProps={{ className: "font-bold text-blue-600" }}
              className="hover:underline"
            >
              Kanban Board
            </Link>
            <Link
              to="/project/$projectId/ai-portal"
              params={{ projectId }}
              preload="intent"
              activeProps={{ className: "font-bold text-blue-600" }}
              className="hover:underline"
            >
              AI Portal
            </Link>
          </nav>
        )}
      </div>

      {/* Toggle Button - pulled out of sidebar and into main flex container */}
      <button
        onClick={() => setIsNavCollapsed(!isNavCollapsed)}
        className="absolute top-4 left-[calc(200px-0.75rem)] z-20 flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white shadow-md transition-all duration-300"
        style={{
          left: isNavCollapsed ? "30px" : "200px",
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
