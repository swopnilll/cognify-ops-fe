import React from "react";
import { Link } from "@tanstack/react-router";

interface PageHeaderProps {
  projectName?: string;
  title: string;
  actions?: React.ReactNode;
}

// Breadcrumb + title row used at the top of every project page.
const PageHeader: React.FC<PageHeaderProps> = ({ projectName, title, actions }) => {
  return (
    <div className="mb-4 flex flex-wrap items-end sm:mb-6 justify-between gap-x-4 gap-y-3">
      <div className="min-w-0">
        <p className="truncate text-sm text-slate-500">
          <Link to="/projects" className="hover:text-slate-700">
            Projects
          </Link>
          <span className="mx-1.5 text-slate-300">/</span>
          <span className="text-slate-700">{projectName ?? "…"}</span>
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};

export default PageHeader;
