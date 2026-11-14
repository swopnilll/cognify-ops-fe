import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import * as React from "react";
import { ChevronLeft, ChevronRight, Kanban, List, Settings, Sparkles } from "lucide-react";

import { useProject } from "../../../../hooks/useProject";

export const Route = createFileRoute("/_authenticated/project/$projectId")({
  component: ProjectLayout,
});

const navItems = [
  { to: "/project/$projectId/kanbanView", label: "Board", icon: Kanban, exact: false },
  { to: "/project/$projectId", label: "List", icon: List, exact: true },
  { to: "/project/$projectId/ai-portal", label: "Intellecta", icon: Sparkles, exact: false },
  { to: "/project/$projectId/settings", label: "Settings", icon: Settings, exact: false },
] as const;

function ProjectLayout(): React.JSX.Element {
  const { projectId } = Route.useParams();
  const { project } = useProject(Number(projectId));
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col md:flex-row">
      {/* Desktop: sidebar. Phones get the tab bar at the bottom instead. */}
      <aside
        className={`hidden shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-200 ${
          collapsed ? "w-16" : "w-60"
        } md:flex`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-3">
          <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-lg bg-brand-50 px-1.5 text-xs font-bold tracking-wide text-brand-700">
            {project?.project_key ?? "…"}
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {project?.name ?? "Project"}
              </p>
              <p className="text-xs text-slate-500">Project</p>
            </div>
          )}
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map(({ to, label, icon: Icon, exact }) => (
            <Link
              key={to}
              to={to}
              params={{ projectId }}
              activeOptions={{ exact }}
              title={collapsed ? label : undefined}
              className={`flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 ${
                collapsed ? "justify-center" : ""
              }`}
              activeProps={{ className: "!bg-brand-50 !text-brand-700" }}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`flex h-9 w-full items-center gap-3 rounded-lg px-3 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {!collapsed && "Collapse"}
          </button>
        </div>
      </aside>

      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">
        <Outlet />
      </div>

      <nav
        aria-label="Project"
        className="grid shrink-0 grid-cols-4 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <Link
            key={to}
            to={to}
            params={{ projectId }}
            activeOptions={{ exact }}
            className="flex h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-500"
            activeProps={{ className: "!text-brand-700" }}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
