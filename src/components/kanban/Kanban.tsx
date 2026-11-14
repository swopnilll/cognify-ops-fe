import React, { useState, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  closestCenter,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";

import { Task } from "../../types/kanban";
import Column from "./Column";
import CreateTaskModal from "../CreateTasksModal";
import DroppableColumnWrapper from "./DroppableColumnWrapper";
import PageHeader from "../project/PageHeader";
import Button from "../ui/Button";
import SearchBox from "../ui/SearchBox";
import Spinner from "../ui/Spinner";
import AvatarGroup from "../ui/AvatarGroup";
import TaskCard from "../TaskCard";

import {
  createTicket,
  CreateTicketPayload,
  ProjectTicket,
  updateTicketStatus,
} from "../../services/ticketService";
import { useAuth } from "../../hooks/useAuthV2";
import {
  displayNameOf,
  ticketsQueryKey,
  useProjectTickets,
} from "../../hooks/useProjectTickets";

interface KanbanBoardProps {
  projectId: number;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();
  const { project, tasks, statuses, projectUsers, isLoading, isError } =
    useProjectTickets(projectId);

  const [search, setSearch] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 8 },
    }),
    // On touch screens a card is picked up with a long press, so a normal
    // swipe still scrolls the board.
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // --- Mutations ---
  const createTicketMutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      toast.success("Task created");
      queryClient.invalidateQueries({ queryKey: ticketsQueryKey(projectId) });
    },
  });

  const updateTicketStatusMutation = useMutation({
    mutationFn: ({ ticketId, statusId }: { ticketId: number; statusId: number }) =>
      updateTicketStatus(ticketId, statusId),
    // Move the card immediately, then roll back if the request fails.
    onMutate: async ({ ticketId, statusId }) => {
      const queryKey = ticketsQueryKey(projectId);
      await queryClient.cancelQueries({ queryKey });
      const previousTickets = queryClient.getQueryData<ProjectTicket[]>(queryKey);
      if (previousTickets) {
        queryClient.setQueryData<ProjectTicket[]>(
          queryKey,
          previousTickets.map((ticket) =>
            ticket.ticket_id === ticketId ? { ...ticket, status_id: statusId } : ticket
          )
        );
      }
      return { previousTickets };
    },
    onError: (_error, _variables, context) => {
      toast.error("The task could not be moved. It has been put back.");
      if (context?.previousTickets) {
        queryClient.setQueryData(ticketsQueryKey(projectId), context.previousTickets);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ticketsQueryKey(projectId) });
    },
  });

  // --- Drag and drop ---
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setActiveTask(tasks.find((task) => task.id === event.active.id) || null);
    },
    [tasks]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveTask(null);

      const { active, over } = event;
      if (!over) return;

      const droppedOnColumn =
        active.data?.current?.type === "task" && over.data?.current?.type === "column";
      if (!droppedOnColumn) return;

      const taskId = Number(active.id);
      const targetStatusId = Number(over.id);
      const originalStatusId = active.data?.current?.originalStatusId;

      if (targetStatusId !== originalStatusId && tasks.some((t) => t.id === taskId)) {
        updateTicketStatusMutation.mutate({ ticketId: taskId, statusId: targetStatusId });
      }
    },
    [tasks, updateTicketStatusMutation]
  );

  const handleCreateTask = (payload: CreateTicketPayload) =>
    createTicketMutation.mutateAsync(payload);

  // --- Filtering ---
  const searchTerm = search.trim().toLowerCase();
  const visibleTasks = tasks.filter(
    (task) =>
      (assigneeFilter === null || task.assignee === assigneeFilter) &&
      (searchTerm === "" ||
        task.title.toLowerCase().includes(searchTerm) ||
        task.description?.toLowerCase().includes(searchTerm))
  );

  if (isLoading) return <Spinner className="h-full" />;

  if (isError) {
    return (
      <div className="p-4 sm:p-6">
        <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          The board could not be loaded. Refresh the page to try again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-4 sm:p-6">
      <PageHeader
        projectName={project?.name}
        title="Board"
        actions={
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => setModalOpen(true)}>
            New task
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-3 sm:mb-5">
        <SearchBox value={search} onChange={setSearch} placeholder="Search tasks" />
        <AvatarGroup
          avatars={projectUsers.map((user) => ({
            id: user.user_id,
            src: user.picture || undefined,
            name: displayNameOf(user),
          }))}
          selectedId={assigneeFilter}
          onSelect={setAssigneeFilter}
        />
        {assigneeFilter && (
          <button
            type="button"
            onClick={() => setAssigneeFilter(null)}
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Clear filter
          </button>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveTask(null)}
      >
        <div className="-mx-4 flex min-h-80 flex-1 gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:gap-4 sm:px-0">
          {statuses.map((status) => (
            <DroppableColumnWrapper key={status.status_id} id={status.status_id}>
              <Column
                title={status.name}
                tasks={visibleTasks.filter((task) => task.status === status.status_id)}
              />
            </DroppableColumnWrapper>
          ))}
        </div>

        <DragOverlay>{activeTask ? <TaskCard task={activeTask} overlay /> : null}</DragOverlay>
      </DndContext>

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateTask}
        users={projectUsers}
        statusOptions={statuses}
        projectId={projectId}
        currentUserId={authUser?.id || ""}
      />
    </div>
  );
};

export default KanbanBoard;
