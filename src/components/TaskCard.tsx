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
      className="bg-white/70 hover:bg-white/90 transition-colors backdrop-blur-sm border border-gray-200 shadow-md hover:shadow-xl rounded-xl p-4 cursor-grab flex flex-col justify-between h-36"
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
        <Avatar src="images/user.png" className="h-6 w-6 ring-2 ring-white" /> {/* Now className is part of AvatarProps */}
      </div>
    </div>
  );
};

export default TaskCard;
