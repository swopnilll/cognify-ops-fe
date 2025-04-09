// components/CreateTaskModal.tsx
import React, { useState } from "react";
import Modal from "./ui/Modal";
import { Status } from "../types/kanban";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (task: any) => void;
}

const CreateTaskModal: React.FC<Props> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<Status>("todo");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title, status });
    setTitle("");
    setStatus("todo");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring"
          required
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
          className="w-full border px-4 py-2 rounded-md"
        >
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
        </select>

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
