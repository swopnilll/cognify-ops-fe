import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task, Status } from "../../types/kanban";
import TaskCard from "../TaskCard";

interface Props {
  title: string;
  color: string;
  status?: Status;
  tasks: Task[];
}

// Color mapping (could be a utility function or simple logic)
const getHeaderStyles = (status: Status | undefined) => {
  switch (status) {
    case "todo":
      return {
        bg: "bg-blue-100",
        text: "text-blue-900",
        border: "border-l-4 border-blue-500",
      };
    case "inprogress":
      return {
        bg: "bg-orange-100",
        text: "text-orange-900",
        border: "border-l-4 border-orange-500",
      };
    case "done":
      return {
        bg: "bg-green-100",
        text: "text-green-900",
        border: "border-l-4 border-green-500",
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-900",
        border: "border-l-4 border-gray-400",
      };
  }
};

const Column: React.FC<Props> = ({ title, status, tasks }) => {
  const headerStyle = getHeaderStyles(status);

  return (
    <div className="flex-1 min-w-[250px] rounded-2xl p-3 h-[calc(100vh-350px)] bg-white/60 backdrop-blur-lg shadow-md ring-1 ring-gray-200 border border-white/20 flex flex-col">
      {/* Modern Header */}
      <div
        className={`px-4 py-2 rounded-t-lg mb-2 font-semibold tracking-wide ${headerStyle.bg} ${headerStyle.text} ${headerStyle.border}`}
      >
        <h3 className="text-sm uppercase">{title}</h3>
      </div>

      {/* Tasks */}
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
          {tasks.length > 0 ? (
            tasks.map((task) => <TaskCard key={task.id} task={task} />)
          ) : (
            <p className="text-center text-gray-500 italic">No tasks yet</p>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default Column;
