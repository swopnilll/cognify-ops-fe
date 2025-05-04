// src/components/kanban/DroppableColumnWrapper.tsx
import { useDroppable } from "@dnd-kit/core";
import React from "react";

interface Props {
  id: number; // Column's status_id
  children: React.ReactNode;
}

const DroppableColumnWrapper: React.FC<Props> = ({ id, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id, // Unique ID for the droppable column
    data: { // Data associated with the droppable column
      type: "column",
      statusId: id, // Pass the status if needed in handlers
      accepts: ["task"], // Explicitly accept 'task' type draggables
    },
  });

  // Optional visual feedback
  const style: React.CSSProperties = isOver
    ? { outline: "3px dashed green", outlineOffset: "-2px" }
    : { outline: "3px dashed transparent", outlineOffset: "-2px"}; // Add transparent outline for layout consistency

  return (
    // Ensure this div correctly wraps the Column and receives the ref
    <div ref={setNodeRef} className="flex-1 min-w-[250px]" style={style}>
      {children}
    </div>
  );
};

export default DroppableColumnWrapper;