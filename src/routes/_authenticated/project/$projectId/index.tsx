import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import PageHeader from "../../../../components/project/PageHeader";
import { DueDate, PriorityBadge, TypeIcon } from "../../../../components/TaskBadges";
import TaskFilters from "../../../../components/TaskFilters";
import TaskModal from "../../../../components/TaskModal";
import Avatar from "../../../../components/ui/Avatar";
import Button from "../../../../components/ui/Button";
import Spinner from "../../../../components/ui/Spinner";
import { useAuth } from "../../../../hooks/useAuthV2";
import { useProjectTickets } from "../../../../hooks/useProjectTickets";
import { useTaskFilters } from "../../../../hooks/useTaskFilters";
import { Task } from "../../../../types/kanban";
import { getStatusStyle } from "../../../../utils/statusStyle";

export const Route = createFileRoute("/_authenticated/project/$projectId/")({
  component: ListView,
});

function ListView() {
  const { projectId } = Route.useParams();
  const { user: authUser } = useAuth();
  const filters = useTaskFilters();
  const { project, tasks, statuses, projectUsers, isLoading, isRefreshing, isError } =
    useProjectTickets(Number(projectId), filters.apiFilters);

  // The modal creates a task when `task` is null and edits it otherwise.
  const [modal, setModal] = useState<{ open: boolean; task: Task | null }>({
    open: false,
    task: null,
  });
  const openTask = (task: Task) => setModal({ open: true, task });
  const openNewTask = () => setModal({ open: true, task: null });

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
          {filters.isFiltered ? (
            <>
              <h2 className="text-base font-semibold text-slate-900">No tasks match</h2>
              <p className="mt-1 text-sm text-slate-500">
                Change the search or filters, or{" "}
                <button
                  type="button"
                  onClick={filters.clear}
                  className="font-medium text-brand-600 hover:text-brand-700"
                >
                  clear them
                </button>
                .
              </p>
            </>
          ) : (
            <>
              <h2 className="text-base font-semibold text-slate-900">No tasks yet</h2>
              <p className="mt-1 text-sm text-slate-500">
                <button
                  type="button"
                  onClick={openNewTask}
                  className="font-medium text-brand-600 hover:text-brand-700"
                >
                  Create your first task
                </button>
                .
              </p>
            </>
          )}
        </div>
      );
    }

    return (
      <div aria-busy={isRefreshing} className={isRefreshing ? "opacity-60" : ""}>
        {/* Phones: one card per task. */}
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white sm:hidden">
          {tasks.map((task) => {
            const statusName = statusNames.get(task.status) ?? "No status";
            return (
              <li key={task.id}>
                <button
                  type="button"
                  onClick={() => openTask(task)}
                  className="block w-full p-4 text-left active:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 break-words text-sm font-medium text-slate-900">
                      {task.title}
                    </p>
                    <span
                      className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${getStatusStyle(statusName).pill}`}
                    >
                      {statusName}
                    </span>
                  </div>
                  {task.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">{task.description}</p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <PriorityBadge priority={task.priority} />
                    {task.dueDate && <DueDate day={task.dueDate} isDone={task.isDone} />}
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      <TypeIcon type={task.type} />
                      {task.ticketKey}
                    </span>
                    <span className="flex min-w-0 items-center gap-2">
                      <Avatar name={task.assigneeName} src={task.assigneePicture} size={20} />
                      <span className="truncate">{task.assigneeName ?? "Unassigned"}</span>
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white sm:block">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
              <tr>
                <th className="px-5 py-3">Key</th>
                <th className="px-5 py-3">Task</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Priority</th>
                <th className="px-5 py-3">Due</th>
                <th className="px-5 py-3">Assignee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((task) => {
                const statusName = statusNames.get(task.status) ?? "No status";
                return (
                  <tr
                    key={task.id}
                    onClick={() => openTask(task)}
                    className="cursor-pointer hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap px-5 py-3.5 font-medium text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <TypeIcon type={task.type} />
                        {task.ticketKey}
                      </span>
                    </td>
                    <td className="max-w-md px-5 py-3.5">
                      {/* The button makes the row reachable by keyboard. */}
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openTask(task);
                        }}
                        className="block max-w-full truncate text-left font-medium text-slate-900 hover:text-brand-700"
                      >
                        {task.title}
                      </button>
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
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5">
                      {task.dueDate ? (
                        <DueDate day={task.dueDate} isDone={task.isDone} />
                      ) : (
                        <span className="text-slate-400">–</span>
                      )}
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
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6">
      <PageHeader
        projectName={project?.name}
        title="List"
        actions={
          <Button icon={<Plus className="h-4 w-4" />} onClick={openNewTask}>
            New task
          </Button>
        }
      />

      {!isLoading && !isError && (
        <TaskFilters
          state={filters.state}
          onChange={filters.set}
          onClear={filters.clear}
          isFiltered={filters.isFiltered}
          users={projectUsers}
          statuses={statuses}
        />
      )}

      {renderContent()}

      <TaskModal
        isOpen={modal.open}
        onClose={() => setModal((current) => ({ ...current, open: false }))}
        task={modal.task}
        users={projectUsers}
        statusOptions={statuses}
        projectId={Number(projectId)}
        currentUserId={authUser?.id || ""}
      />
    </div>
  );
}
