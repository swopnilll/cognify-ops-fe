import React from "react";
import { useDraggable } from "@dnd-kit/core";

import { Task } from "../types/kanban";
import Avatar from "./ui/Avatar";
import { DueDate, PriorityBadge, TypeIcon } from "./TaskBadges";

interface Props {
  task: Task;
  overlay?: boolean; // true for the copy that follows the cursor while dragging
  onOpen?: (task: Task) => void; // called on a click (not on a drag)
}

const TaskCard: React.FC<Props> = ({ task, overlay = false, onOpen }) => {
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
      onClick={overlay || !onOpen ? undefined : () => onOpen(task)}
      className={`touch-manipulation select-none rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition [-webkit-touch-callout:none] ${
        overlay
          ? "rotate-2 cursor-grabbing shadow-lg ring-1 ring-brand-300"
          : "cursor-grab hover:border-slate-300 hover:shadow"
      } ${isDragging ? "opacity-40" : ""}`}
    >
      <p className="break-words text-sm font-medium leading-snug text-slate-900">{task.title}</p>
      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PriorityBadge priority={task.priority} />
        {task.dueDate && <DueDate day={task.dueDate} isDone={task.isDone} />}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <TypeIcon type={task.type} />
          {task.ticketKey}
        </span>
        <Avatar name={task.assigneeName} src={task.assigneePicture} size={24} />
      </div>
    </div>
  );
};

export default TaskCard;
