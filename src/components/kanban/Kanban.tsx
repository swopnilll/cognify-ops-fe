import React, { useState, useMemo, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"; // <-- Needed for KeyboardSensor
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

// --- Types ---
import { Task } from "../../types/kanban";
import { KanbanStatus } from "../../services/statusService";

// --- Components ---
import Column from "./Column";
import CreateTaskModal from "../CreateTasksModal";
import DroppableColumnWrapper from "./DroppableColumnWrapper";
import CognifyButton from "../ui/CognigyButton";
import SearchBox from "../ui/SearchBox";
import AvatarGroup from "../ui/AvatarGroup";
import TaskCard from "../TaskCard"; // <-- Ensure TaskCard is imported

// --- Services ---
import { fetchAllStatuses } from "../../services/statusService";
import { fetchUsersForProect } from "../../services/projectService";
import {
  createTicket,
  // CreateTicketPayload,
  fetchTicketsByProjectId,
  updateTicketStatus,
} from "../../services/ticketService";

// --- Hooks ---
import { useAuth } from "../../hooks/useAuthV2";

// --- Helper Functions ---
const getColorClass = (name: string) => {
  const key = name.toLowerCase();
  if (key.includes("todo")) return "bg-blue-600";
  if (key.includes("progress")) return "bg-amber-700";
  if (key.includes("done")) return "bg-green-700";
  return "bg-gray-400";
};

interface TicketApiResponse {
  ticket_id: number;
  name: string;
  description?: string;
  status_id: number;
  Ticket_Assignment?: Array<{ user_id: string }>;
}

const mapApiTicketToTask = (ticket: TicketApiResponse): Task => ({
  id: ticket.ticket_id,
  title: ticket.name,
  description: ticket.description,
  status: ticket.status_id,
  assignee: ticket.Ticket_Assignment?.[0]?.user_id || "Unassigned",
});

interface KanbanBoardProps {
  projectId: number;
}

// --- Component ---
const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  // const [activeId, setActiveId] = useState<number | string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // --- Data Fetching ---
  const { data: rawTickets } = useQuery<TicketApiResponse[]>({
    queryKey: ["tickets", projectId],
    queryFn: ({ queryKey }) => fetchTicketsByProjectId(queryKey[1] as number),
    staleTime: 1000 * 60 * 5,
  });

  const tasks: Task[] = useMemo(() => {
    return rawTickets?.map(mapApiTicketToTask) || [];
  }, [rawTickets]);

  const { data: statusOptions, isLoading: isLoadingStatuses } = useQuery<
    KanbanStatus[]
  >({
    queryKey: ["statuses"],
    queryFn: fetchAllStatuses,
  });

  const { data: projectUsers, isLoading: isLoadingProjectUsers } = useQuery({
    queryKey: ["projectUsers", projectId],
    queryFn: ({ queryKey }) => fetchUsersForProect(queryKey[1] as number),
  });

  // --- Sensors ---
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // --- Mutations ---
  const createTicketMutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      toast.success("Ticket Created successfully");
      queryClient.invalidateQueries({ queryKey: ["tickets", projectId] });
    },
    onError: (error: any) => {
      console.error("Error while creating ticket:", error);
      toast.error(error?.message || "Cannot Create Ticket");
    },
  });

  const updateTicketStatusMutation = useMutation({
    mutationFn: ({
      ticketId,
      statusId,
    }: {
      ticketId: number;
      statusId: number;
    }) => updateTicketStatus(ticketId, statusId),
    onMutate: async (variables) => {
      const { ticketId, statusId } = variables;
      const queryKey = ["tickets", projectId];
      await queryClient.cancelQueries({ queryKey });
      const previousTickets =
        queryClient.getQueryData<TicketApiResponse[]>(queryKey);
      if (previousTickets) {
        const updatedTickets = previousTickets.map((ticket) =>
          ticket.ticket_id === ticketId
            ? { ...ticket, status_id: statusId }
            : ticket
        );
        queryClient.setQueryData<TicketApiResponse[]>(queryKey, updatedTickets);
      }
      console.log(
        `Optimistic UI update: Task ${ticketId} moved to status ${statusId}`
      );
      return { previousTickets };
    },
    onError: (error: any, _, context) => {
      console.error("Error updating ticket status:", error);
      toast.error(
        `Failed to move task: ${error?.message || "Unknown error"}. Reverting.`
      );
      if (context?.previousTickets) {
        queryClient.setQueryData(
          ["tickets", projectId],
          context.previousTickets
        );
      }
    },
    onSettled: () => {
      console.log("Mutation settled. Invalidating tickets query...");
      queryClient.invalidateQueries({ queryKey: ["tickets", projectId] });
    },
  });

  // --- Event Handlers ---

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      // --- Enhanced Logging ---
      console.log("--- DragStart Event (Full Active) ---", event.active);
      console.log("--- DragStart Event (Active Data) ---", event.active.data);
      // ------------------------

      const { active } = event;
      const id = active.id as number; // Task ID
      // setActiveId(id);
      const currentActiveTask = tasks.find((task) => task.id === id);
      setActiveTask(currentActiveTask || null);

      // --- Access data via .current ---
      console.log(
        // Make sure template literal interpolation is correct
        `Drag Start: ID=${id}, Type=${active.data?.current?.type}` // <-- Access .current.type
      );
      // ---------------------------------
    },
    [tasks]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      // setActiveId(null);
      setActiveTask(null);

      const { active, over } = event;

      if (!over) {
        console.log("Drag ended outside a droppable area.");
        return;
      }

      const activeId = active.id;
      const activeType = active.data?.current?.type; // Type from useDraggable data
      const overId = over.id;
      const overType = over.data?.current?.type; // Type from useDroppable data
      const originalStatusId = active.data?.current?.originalStatusId;

      console.log("DragEnd Event Details:", {
        activeId,
        activeType,
        overId,
        overType,
        originalStatusId,
      });

      // --- Simplified Logic Focus ---

      // Primary Goal: Did we drop a TASK onto a COLUMN?
      if (activeType === "task" && overType === "column") {
        const taskId = Number(activeId);
        const targetStatusId = Number(overId);
        const currentTask = tasks.find((t) => t.id === taskId);

        console.log(
          `Checking drop: Task ${taskId} (from status ${originalStatusId}) onto Column ${targetStatusId}`
        );

        // Only mutate if the status ID is actually different
        if (currentTask && targetStatusId !== originalStatusId) {
          console.log(
            `Attempting to move task ${taskId} from status ${originalStatusId} to COLUMN ${targetStatusId}`
          );
          updateTicketStatusMutation.mutate({
            ticketId: taskId,
            statusId: targetStatusId,
          });
        } else if (currentTask) {
          console.log(
            `Task ${taskId} dropped in the same status column (${targetStatusId}) or target matches original. No mutation needed.`
          );
        } else {
          console.warn(
            `Could not find task with ID ${taskId} for status update.`
          );
        }
      }
      // Handle other cases (like dropping on self if ID/Type matched, though less likely now)
      else if (activeId === overId && activeType === overType) {
        console.log(
          `Dropped on self (ID: ${activeId}, Type: ${activeType}). No action needed.`
        );
      } else {
        // Log if the types didn't match what we expected
        console.log(
          `Unhandled drop or type mismatch: Active ${activeType} (${activeId}) onto Over ${overType} (${overId}). No action.`
        );
      }
    },
    [tasks, updateTicketStatusMutation] // Dependencies
  );

  const handleDragCancel = useCallback(() => {
    // setActiveId(null);
    setActiveTask(null);
    console.log("Drag Cancelled");
  }, []);

  const handleCreateTask = (taskPayload: any) => {
    createTicketMutation.mutate(taskPayload);
    setModalOpen(false);
  };

  const handleUserSelect = (user: any) => {
    if (user) {
      /* ... TODO ... */
    } else {
      /* ... */
    }
  };

  // --- Render Logic ---
  if (isLoadingStatuses || isLoadingProjectUsers) {
    return <div className="p-6 text-center">Loading board data...</div>;
  }

  // Log status options for debugging if needed
  // console.log("Current Status Options:", statusOptions);

  return (
    <div className="relative p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-md">Project / Health Pro</h2>
        <CognifyButton
          label="Create New Task"
          variant="outlined"
          customColor="blue"
          textColor="white"
          onClick={() => setModalOpen(true)}
          sx={{ marginRight: "1rem", opacity: 0.7 }}
        />
      </div>
      <h2 className="text-xl font-bold mb-4 px-2">Board</h2>

      {/* Filters/Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 px-2">
        <div className="mr-2">
          <SearchBox value={search} onChange={setSearch} />
        </div>
        <div>
          <AvatarGroup
            avatars={
              projectUsers?.map(
                (user: {
                  user_id: string;
                  picture: string;
                  user_metadata: { fullName: string };
                }) => {
                  return {
                    id: user.user_id,
                    src: user.picture,
                    name: user.user_metadata.fullName,
                  };
                }
              ) || []
            }
            onSelect={handleUserSelect}
          />
        </div>
      </div>

      {/* Kanban Board Area */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="w-full flex flex-col md:flex-row gap-4 px-2">
          {statusOptions?.map((status) => (
            <DroppableColumnWrapper
              key={status.status_id}
              id={status.status_id}
            >
              <Column
                status={status.status_id}
                color={getColorClass(status.name)}
                title={status.name}
                // *** FIX THE FILTER PREDICATE HERE ***
                tasks={
                  tasks?.filter(
                    (t) =>
                      t.status === status.status_id && // Filter by column status
                      (search === "" || // Filter by search term
                        t.title.toLowerCase().includes(search.toLowerCase()) ||
                        (t.description && // Check if description exists before calling includes
                          t.description
                            .toLowerCase()
                            .includes(search.toLowerCase())))
                  ) || []
                }
              />
            </DroppableColumnWrapper>
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateTask}
        users={projectUsers}
        statusOptions={statusOptions}
        projectId={projectId}
        currentUserId={authUser?.id || ""}
      />
    </div>
  );
};

export default KanbanBoard;
