// src/components/TaskCard.tsx
import React from "react";
// REMOVE: import { useSortable } from "@dnd-kit/sortable";
// REMOVE: import { CSS } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core"; // <-- IMPORT this
import { Task } from "../types/kanban"; // Adjust path if needed
import { PencilIcon, EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import Avatar from "./ui/Avatar"; // Adjust path if needed

interface Props {
  task: Task;
}

const TaskCard: React.FC<Props> = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging // <-- Get isDragging state from useDraggable
   } = useDraggable({ // <-- USE useDraggable
      id: task.id,
      data: { // <-- Keep providing the necessary data
        type: "task",
        taskDetails: task, // Pass the full task if needed in DragOverlay or handlers
        originalStatusId: task.status // Keep track of where it started
      },
    });

  // Style to visually indicate dragging (e.g., dim the original)
  // No transform/transition needed from the hook itself for basic dragging
  const style: React.CSSProperties = {
    opacity: isDragging ? 0.5 : 1, // Example: Dim original when dragging
    // touchAction: 'none', // Might be needed for touch devices depending on setup
  };

  return (
    <div
      ref={setNodeRef} // Assign ref
      style={style}     // Apply dragging style
      {...attributes} // Apply draggable attributes
      {...listeners}  // Apply drag listeners
      className="bg-white/70 hover:bg-white/90 transition-opacity duration-200 backdrop-blur-sm border border-gray-200 shadow-md hover:shadow-lg rounded-xl p-4 cursor-grab flex flex-col justify-between h-36" // Removed hover:shadow-xl to simplify, added transition-opacity
    >
      {/* Title & Icons */}
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-2">
          <p className="text-gray-900 font-semibold text-sm truncate">
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        <div className="flex items-start gap-2">
          <PencilIcon className="h-4 w-4 text-gray-500 hover:text-gray-700 cursor-pointer transition" />
          <EllipsisVerticalIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer transition" />
        </div>
      </div>

      {/* Avatar */}
      <div className="flex justify-end mt-3">
        {/* Ensure Avatar component handles className */}
        <Avatar src="/images/user.png" className="h-6 w-6 ring-2 ring-white" />
      </div>
    </div>
  );
};

export default TaskCard;