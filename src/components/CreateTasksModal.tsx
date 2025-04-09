import React, { useState } from "react";
import Modal from "./ui/Modal";
import { Status } from "../types/kanban";

interface User {
  id: number;
  name: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (task: {
    title: string;
    description: string;
    status: Status;
    assigneeId?: number;
  }) => void;
  users?: User[]; // optional user list for dropdown
}

const CreateTaskModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onCreate,
  users = [],
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>("todo");
  const [assigneeId, setAssigneeId] = useState<number | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreate({ title, description, status, assigneeId });

    // Reset form
    setTitle("");
    setDescription("");
    setStatus("todo");
    setAssigneeId(undefined);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring"
          required
        />

        {/* Description */}
        <textarea
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring min-h-[100px]"
        />

        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
          className="w-full border px-4 py-2 rounded-md"
        >
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
        </select>

        {/* Assignee */}
        <select
          value={assigneeId}
          onChange={(e) =>
            setAssigneeId(e.target.value ? Number(e.target.value) : undefined)
          }
          className="w-full border px-4 py-2 rounded-md"
        >
          <option value="">Assign to...</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create
        </button>
      </form>
    </Modal>
  );
};

export default CreateTaskModal;
