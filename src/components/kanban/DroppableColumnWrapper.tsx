import { useDroppable } from "@dnd-kit/core";
import React from "react";

interface Props {
  id: number; // the column's status_id
  children: React.ReactNode;
}

const DroppableColumnWrapper: React.FC<Props> = ({ id, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: "column",
      statusId: id,
      accepts: ["task"],
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex h-full w-[min(18rem,80vw)] shrink-0 flex-col rounded-xl p-2 transition-colors md:w-auto md:min-w-64 md:flex-1 ${
        isOver ? "bg-brand-50 ring-2 ring-inset ring-brand-300" : "bg-slate-100"
      }`}
    >
      {children}
    </div>
  );
};

export default DroppableColumnWrapper;
