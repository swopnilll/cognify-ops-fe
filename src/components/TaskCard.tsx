import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "../types/kanban";
import { PencilIcon, EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import Avatar from "./ui/Avatar";

interface Props {
  task: Task;
}

const TaskCard: React.FC<Props> = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-white border rounded-md p-4 shadow-sm hover:shadow-md transition cursor-grab flex flex-col justify-between h-36"
    >
      {/* Top section with title, edit and menu */}
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-2">
          <p className="text-gray-800 font-medium text-sm">{task.title}</p>
          {task.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        <div className="flex items-start gap-1">
          <PencilIcon className="h-4 w-4 text-gray-500 hover:text-gray-700 cursor-pointer" />
          <EllipsisVerticalIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
        </div>
      </div>

      {/* Bottom section with user icon */}
      <div className="flex justify-end mt-3">
        <Avatar src="images/user.png" />
      </div>
    </div>
  );
};

export default TaskCard;
