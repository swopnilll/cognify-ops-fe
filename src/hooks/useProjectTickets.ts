import { useMemo } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ProjectUser, Task } from "../types/kanban";
import { fetchUsersForProect } from "../services/projectService";
import { fetchAllStatuses, KanbanStatus } from "../services/statusService";
import {
  fetchTicketsByProjectId,
  ProjectTicket,
  TicketFilters,
} from "../services/ticketService";
import { isDoneStatus } from "../utils/ticketMeta";
import { useProject } from "./useProject";

// Every ticket list of a project, whatever its filters. Use it to invalidate
// or update all of them at once.
export const ticketsQueryKey = (projectId: number) => ["tickets", projectId] as const;
export const projectUsersQueryKey = (projectId: number) => ["projectUsers", projectId] as const;

export const displayNameOf = (user: ProjectUser) =>
  user.user_metadata?.fullName || user.name || user.email;

// Everything the board and list views need: tickets (as tasks, with the
// assignee's name filled in), the status columns and the project's members.
// The filters and the sort order are applied by the API.
export function useProjectTickets(projectId: number, filters: TicketFilters = {}) {
  const { project } = useProject(projectId);

  const ticketsQuery = useQuery<ProjectTicket[]>({
    queryKey: [...ticketsQueryKey(projectId), filters],
    queryFn: () => fetchTicketsByProjectId(projectId, filters),
    staleTime: 1000 * 60 * 5,
    // Keep showing the current tasks while a changed filter loads.
    placeholderData: keepPreviousData,
  });

  const statusesQuery = useQuery<KanbanStatus[]>({
    queryKey: ["statuses"],
    queryFn: fetchAllStatuses,
  });

  const usersQuery = useQuery<ProjectUser[]>({
    queryKey: projectUsersQueryKey(projectId),
    queryFn: () => fetchUsersForProect(projectId),
  });

  const tasks: Task[] = useMemo(() => {
    const usersById = new Map((usersQuery.data ?? []).map((user) => [user.user_id, user]));
    const doneStatusIds = new Set(
      (statusesQuery.data ?? [])
        .filter((status) => isDoneStatus(status.name))
        .map((status) => status.status_id)
    );

    return (ticketsQuery.data ?? []).map((ticket) => {
      const assigneeId = ticket.Ticket_Assignment?.[0]?.user_id ?? "";
      const assignee = usersById.get(assigneeId);

      return {
        id: ticket.ticket_id,
        title: ticket.name,
        description: ticket.description,
        status: ticket.status_id,
        assignee: assigneeId,
        assigneeName: assignee ? displayNameOf(assignee) : undefined,
        assigneePicture: assignee?.picture || undefined,
        ticketKey: project ? `${project.project_key}-${ticket.ticket_id}` : `#${ticket.ticket_id}`,
        priority: ticket.priority ?? "medium",
        type: ticket.type ?? "task",
        dueDate: ticket.due_date ? ticket.due_date.slice(0, 10) : null,
        isDone: doneStatusIds.has(ticket.status_id),
      };
    });
  }, [ticketsQuery.data, usersQuery.data, statusesQuery.data, project]);

  return {
    project,
    tasks,
    statuses: statusesQuery.data ?? [],
    projectUsers: usersQuery.data ?? [],
    isRefreshing: ticketsQuery.isPlaceholderData,
    isLoading: ticketsQuery.isLoading || statusesQuery.isLoading || usersQuery.isLoading,
    isError: ticketsQuery.isError || statusesQuery.isError || usersQuery.isError,
  };
}
