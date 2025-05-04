// src/components/kanban/Column.tsx
import React from "react";
// REMOVE: import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task } from "../../types/kanban"; // Adjust path
import TaskCard from "../TaskCard"; // Adjust path

interface Props {
  title: string;
  color: string; // This seems unused, using getHeaderStyles instead
  status?: number; // Pass the actual status ID
  tasks: Task[];
}

// Color mapping (using title)
const getHeaderStyles = (name: string) => {
  const key = name.toLowerCase();
  // ... (getHeaderStyles remains the same) ...
    if (key.includes("todo")) return { bg: "bg-blue-100", text: "text-blue-900", border: "border-l-4 border-blue-500" };
    if (key.includes("progress")) return { bg: "bg-orange-100", text: "text-orange-900", border: "border-l-4 border-orange-500" };
    if (key.includes("done")) return { bg: "bg-green-100", text: "text-green-900", border: "border-l-4 border-green-500" };
    return { bg: "bg-gray-100", text: "text-gray-900", border: "border-l-4 border-gray-400" };
};


const Column: React.FC<Props> = ({ title, tasks }) => { // Receive status ID if needed
  const headerStyle = getHeaderStyles(title);
  return (
    <div className="flex-1 min-w-[250px] rounded-2xl p-3 h-[calc(100vh-350px)] bg-white/60 backdrop-blur-lg shadow-md ring-1 ring-gray-200 border border-white/20 flex flex-col">
      {/* Modern Header */}
      <div
        className={`px-4 py-2 rounded-t-lg mb-2 font-semibold tracking-wide ${headerStyle.bg} ${headerStyle.text} ${headerStyle.border}`}
      >
        <h3 className="text-sm uppercase">{title} ({tasks.length})</h3> {/* Added count */}
      </div>

      {/* Tasks List - Remove SortableContext */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
        {tasks.length > 0 ? (
          tasks.map((task) => (
             // TaskCard is now just draggable, not sortable
            <TaskCard key={task.id} task={task} />
          ))
        ) : (
          <p className="text-center text-gray-500 italic pt-4">No tasks</p>
        )}
      </div>
      {/* End Tasks List */}
    </div>
  );
};

export default Column;