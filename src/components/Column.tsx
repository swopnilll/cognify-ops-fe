import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task, Status } from "../types/kanban";
import TaskCard from "./TaskCard";

interface Props {
  title: string;
  color: string;
  status: Status;
  tasks: Task[];
}

const Column: React.FC<Props> = ({ title, color, status, tasks }) => {
  return (
    <div className="flex-1 min-w-[250px] bg-gray-100 rounded-lg p-3">
      <div
        className={`text-white px-4 py-2 rounded-t-md mb-2 flex justify-between items-center ${color}`}
      >
        <h3 className="text-sm font-semibold tracking-wide">{title}</h3>
      </div>

      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default Column;
