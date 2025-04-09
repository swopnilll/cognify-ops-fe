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
      className="bg-white border rounded-md p-4 shadow-sm hover:shadow-md transition cursor-grab flex flex-col justify-between h-32"
    >
      {/* Top section with title, edit and menu */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <p className="text-gray-800 font-medium text-sm">{task.title}</p>
          <PencilIcon className="h-4 w-4 text-gray-500 hover:text-gray-700 cursor-pointer" />
        </div>
        <EllipsisVerticalIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
      </div>

      {/* Bottom section with user icon */}
      <div className="flex justify-end mt-4">
        <Avatar src="images/user.png" />
      </div>
    </div>
  );
};

export default TaskCard;
