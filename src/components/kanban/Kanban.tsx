import React, { useState } from "react";
import { DndContext, closestCorners, DragEndEvent } from "@dnd-kit/core";

import { Status, Task } from "../../types/kanban";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import Column from "./Column";
import CreateTaskModal from "../CreateTasksModal";
import Header from "../Header";

import DroppableColumnWrapper from "./DroppableColumnWrapper";

import CognifyButton from "../ui/CognigyButton";
import SearchBox from "../ui/SearchBox";
import AvatarGroup from "../ui/AvatarGroup";

const statuses: { id: Status; title: string; color: string }[] = [
  { id: "todo", title: "TO DO", color: "bg-blue-600" },
  { id: "inprogress", title: "IN PROGRESS", color: "bg-amber-700" },
  { id: "done", title: "DONE", color: "bg-green-700" },
];

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>("kanbanTasks", []);
  const [lastId, setLastId] = useLocalStorage<number>("kanbanLastId", 1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    console.log("active", active);
    console.log("over", over);

    if (!over || active.id == over.id) return;

    const taskId = Number(active.id);
    const targetColumn = over.id as Status;

    console.log("tasksid", taskId);
    console.log("target column", targetColumn);

    // Find the task and update status
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: targetColumn } : task
    );

    console.log("..updated tasks", updatedTasks);
    setTasks(updatedTasks);

    // TODO: change this with API call
  };

  //TODO: change this with api call
  const handleCreateTask = (task: any) => {
    const newTask: Task = { ...task, id: lastId };
    setTasks([...tasks, newTask]);
    setLastId(lastId + 1);
  };

  const teamMembers = [
    { id: 1, src: "/images/user.png", name: "Alice" },
    { id: 2, src: "/images/user1.png", name: "Bob" },
    { id: 3, src: "/images/user2.png", name: "Charlie" },
    { id: 4, src: "/images/user3.png", name: "Daisy" },
  ];

  const handleUserSelect = (user: any) => {
    if (user) {
      console.log("Call API with selected user:", user);
      //TODO: API call
    } else {
      console.log("User deselected");
    }
  };

  return (
    <>
      <Header isauthenticated={true} />
      <div className="relative p-6">
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-md">Project / Health Pro</h2>
          <CognifyButton
            label="+ Create New Task"
            variant="outlined"
            customColor="blue"
            textColor="white"
            onClick={() => setModalOpen(true)}
            sx={{ marginRight: "1rem", opacity: 0.7 }}
          />
        </div>
        <h2 className="text-xl font-bold mb-4 px-2">Board</h2>
        <div className="flex flex-col sm:flex-row  items-center gap-4 mb-4 px-2">
          <div className="mr-2">
            {" "}
            <SearchBox value={search} onChange={setSearch} />
          </div>

          <div>
            <AvatarGroup avatars={teamMembers} onSelect={handleUserSelect} />
          </div>
        </div>

        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="w-full flex flex-col md:flex-row gap-4 px-2">
            {statuses.map((col) => (
              <DroppableColumnWrapper key={col.id} id={col.id}>
                <Column
                  status={col.id}
                  color={col.color}
                  title={col.title}
                  tasks={tasks.filter((t) => t.status === col.id)}
                />
              </DroppableColumnWrapper>
            ))}
          </div>
        </DndContext>

        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={handleCreateTask}
          users={[
            { id: 1, name: "Alice" },
            { id: 2, name: "Bob" },
          ]}
          //TODO : add users from api call
        />
      </div>
    </>
  );
};

export default KanbanBoard;
