import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { ProjectUser, Task } from "../types/kanban";
import { fetchUsersForProect } from "../services/projectService";
import { fetchAllStatuses, KanbanStatus } from "../services/statusService";
import { fetchTicketsByProjectId, ProjectTicket } from "../services/ticketService";
import { useProject } from "./useProject";

export const ticketsQueryKey = (projectId: number) => ["tickets", projectId] as const;
export const projectUsersQueryKey = (projectId: number) => ["projectUsers", projectId] as const;

export const displayNameOf = (user: ProjectUser) =>
  user.user_metadata?.fullName || user.name || user.email;

// Everything the board and list views need: tickets (as tasks, with the
// assignee's name filled in), the status columns and the project's members.
export function useProjectTickets(projectId: number) {
  const { project } = useProject(projectId);

  const ticketsQuery = useQuery<ProjectTicket[]>({
    queryKey: ticketsQueryKey(projectId),
    queryFn: () => fetchTicketsByProjectId(projectId),
    staleTime: 1000 * 60 * 5,
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
      };
    });
  }, [ticketsQuery.data, usersQuery.data, project]);

  return {
    project,
    tasks,
    statuses: statusesQuery.data ?? [],
    projectUsers: usersQuery.data ?? [],
    isLoading: ticketsQuery.isLoading || statusesQuery.isLoading || usersQuery.isLoading,
    isError: ticketsQuery.isError || statusesQuery.isError || usersQuery.isError,
  };
}
