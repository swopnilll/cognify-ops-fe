import React from "react";
import { useDraggable } from "@dnd-kit/core";

import { Task } from "../types/kanban";
import Avatar from "./ui/Avatar";

interface Props {
  task: Task;
  overlay?: boolean; // true for the copy that follows the cursor while dragging
}

const TaskCard: React.FC<Props> = ({ task, overlay = false }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: {
      type: "task",
      taskDetails: task,
      originalStatusId: task.status,
    },
    disabled: overlay,
  });

  return (
    <div
      ref={overlay ? undefined : setNodeRef}
      {...(overlay ? {} : attributes)}
      {...(overlay ? {} : listeners)}
      className={`rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition ${
        overlay
          ? "rotate-2 cursor-grabbing shadow-lg ring-1 ring-brand-300"
          : "cursor-grab hover:border-slate-300 hover:shadow"
      } ${isDragging ? "opacity-40" : ""}`}
    >
      <p className="text-sm font-medium leading-snug text-slate-900">{task.title}</p>
      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">{task.ticketKey}</span>
        <Avatar name={task.assigneeName} src={task.assigneePicture} size={24} />
      </div>
    </div>
  );
};

export default TaskCard;
