import { createFileRoute, Link } from "@tanstack/react-router";

import PageHeader from "../../../../components/project/PageHeader";
import Avatar from "../../../../components/ui/Avatar";
import Spinner from "../../../../components/ui/Spinner";
import { useProjectTickets } from "../../../../hooks/useProjectTickets";
import { getStatusStyle } from "../../../../utils/statusStyle";

export const Route = createFileRoute("/_authenticated/project/$projectId/")({
  component: ListView,
});

function ListView() {
  const { projectId } = Route.useParams();
  const { project, tasks, statuses, isLoading, isError } = useProjectTickets(Number(projectId));

  const statusNames = new Map(statuses.map((status) => [status.status_id, status.name]));

  const renderContent = () => {
    if (isLoading) return <Spinner />;

    if (isError) {
      return (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          The tasks could not be loaded. Refresh the page to try again.
        </p>
      );
    }

    if (tasks.length === 0) {
      return (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <h2 className="text-base font-semibold text-slate-900">No tasks yet</h2>
          <p className="mt-1 text-sm text-slate-500">
            Create your first task on the{" "}
            <Link
              to="/project/$projectId/kanbanView"
              params={{ projectId }}
              className="font-medium text-brand-600 hover:text-brand-700"
            >
              board
            </Link>
            .
          </p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
            <tr>
              <th className="px-5 py-3">Key</th>
              <th className="px-5 py-3">Task</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Assignee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map((task) => {
              const statusName = statusNames.get(task.status) ?? "No status";
              return (
                <tr key={task.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-5 py-3.5 font-medium text-slate-500">
                    {task.ticketKey}
                  </td>
                  <td className="max-w-md px-5 py-3.5">
                    <p className="font-medium text-slate-900">{task.title}</p>
                    {task.description && (
                      <p className="mt-0.5 truncate text-slate-500">{task.description}</p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${getStatusStyle(statusName).pill}`}
                    >
                      {statusName}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5">
                    <span className="flex items-center gap-2 text-slate-700">
                      <Avatar name={task.assigneeName} src={task.assigneePicture} size={24} />
                      {task.assigneeName ?? "Unassigned"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-6">
      <PageHeader projectName={project?.name} title="List" />
      {renderContent()}
    </div>
  );
}
