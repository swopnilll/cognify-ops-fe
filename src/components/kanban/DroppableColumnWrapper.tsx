import { useDroppable } from "@dnd-kit/core";
import React from "react";

interface Props {
  id: string;
  children: React.ReactNode;
}

const DroppableColumnWrapper: React.FC<Props> = ({ id, children }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="flex-1 min-w-[250px]">
      {children}
    </div>
  );
};

export default DroppableColumnWrapper;
