import React, { useState, useCallback, useRef } from "react";
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
import TaskModal from "../TaskModal";
import TaskFilters from "../TaskFilters";
import DroppableColumnWrapper from "./DroppableColumnWrapper";
import PageHeader from "../project/PageHeader";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import TaskCard from "../TaskCard";

import { ProjectTicket, updateTicketStatus } from "../../services/ticketService";
import { useAuth } from "../../hooks/useAuthV2";
import { ticketsQueryKey, useProjectTickets } from "../../hooks/useProjectTickets";
import { useTaskFilters } from "../../hooks/useTaskFilters";

interface KanbanBoardProps {
  projectId: number;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();
  const filters = useTaskFilters();
  const { project, tasks, statuses, projectUsers, isLoading, isRefreshing, isError } =
    useProjectTickets(projectId, filters.apiFilters);

  // The modal creates a task when `task` is null and edits it otherwise.
  const [modal, setModal] = useState<{ open: boolean; task: Task | null }>({
    open: false,
    task: null,
  });
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  // Dropping a card on its own column ends with a click on the card: that
  // click must not open the task.
  const justDragged = useRef(false);

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
  const updateTicketStatusMutation = useMutation({
    mutationFn: ({ ticketId, statusId }: { ticketId: number; statusId: number }) =>
      updateTicketStatus(ticketId, statusId),
    // Move the card immediately, then roll back if the request fails. The
    // project's ticket lists are cached once per filter: all are updated.
    onMutate: async ({ ticketId, statusId }) => {
      const queryKey = ticketsQueryKey(projectId);
      await queryClient.cancelQueries({ queryKey });
      const previousLists = queryClient.getQueriesData<ProjectTicket[]>({ queryKey });
      queryClient.setQueriesData<ProjectTicket[]>({ queryKey }, (tickets) =>
        tickets?.map((ticket) =>
          ticket.ticket_id === ticketId ? { ...ticket, status_id: statusId } : ticket
        )
      );
      return { previousLists };
    },
    onError: (_error, _variables, context) => {
      toast.error("The task could not be moved. It has been put back.");
      context?.previousLists.forEach(([key, tickets]) => {
        queryClient.setQueryData<ProjectTicket[]>(key, tickets);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ticketsQueryKey(projectId) });
    },
  });

  // --- Drag and drop ---
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      justDragged.current = true;
      setActiveTask(tasks.find((task) => task.id === event.active.id) || null);
    },
    [tasks]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveTask(null);
      setTimeout(() => (justDragged.current = false), 0);

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

  const openTask = useCallback((task: Task) => {
    if (!justDragged.current) setModal({ open: true, task });
  }, []);

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
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => setModal({ open: true, task: null })}>
            New task
          </Button>
        }
      />

      <TaskFilters
        state={filters.state}
        onChange={filters.set}
        onClear={filters.clear}
        isFiltered={filters.isFiltered}
        users={projectUsers}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => {
          setActiveTask(null);
          setTimeout(() => (justDragged.current = false), 0);
        }}
      >
        <div
          aria-busy={isRefreshing}
          className={`-mx-4 flex min-h-80 flex-1 gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:gap-4 sm:px-0 ${
            isRefreshing ? "opacity-60" : ""
          }`}
        >
          {statuses.map((status) => (
            <DroppableColumnWrapper key={status.status_id} id={status.status_id}>
              <Column
                title={status.name}
                tasks={tasks.filter((task) => task.status === status.status_id)}
                onOpenTask={openTask}
              />
            </DroppableColumnWrapper>
          ))}
        </div>

        <DragOverlay>{activeTask ? <TaskCard task={activeTask} overlay /> : null}</DragOverlay>
      </DndContext>

      <TaskModal
        isOpen={modal.open}
        onClose={() => setModal((current) => ({ ...current, open: false }))}
        task={modal.task}
        users={projectUsers}
        statusOptions={statuses}
        projectId={projectId}
        currentUserId={authUser?.id || ""}
      />
    </div>
  );
};

export default KanbanBoard;
