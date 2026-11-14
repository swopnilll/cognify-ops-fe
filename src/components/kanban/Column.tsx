import React from "react";

import { Task } from "../../types/kanban";
import { getStatusStyle } from "../../utils/statusStyle";
import TaskCard from "../TaskCard";

interface Props {
  title: string;
  tasks: Task[];
}

const Column: React.FC<Props> = ({ title, tasks }) => {
  const style = getStatusStyle(title);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-2 pb-3 pt-1">
        <span className={`h-2 w-2 rounded-full ${style.dot}`} />
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-xs font-medium text-slate-600">
          {tasks.length}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
        {tasks.length > 0 ? (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        ) : (
          <p className="rounded-lg border border-dashed border-slate-300 px-3 py-6 text-center text-xs text-slate-400">
            No tasks
          </p>
        )}
      </div>
    </div>
  );
};

export default Column;
