import React, { useState } from "react";

import { ProjectUser } from "../types/kanban";
import { displayNameOf } from "../hooks/useProjectTickets";
import { KanbanStatus } from "../services/statusService";
import { CreateTicketPayload } from "../services/ticketService";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import Select from "./ui/Select";
import TextField from "./ui/TextField";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: CreateTicketPayload) => Promise<unknown>;
  users: ProjectUser[];
  statusOptions: KanbanStatus[];
  projectId: number;
  currentUserId: string;
}

interface FormErrors {
  title?: string;
  assigneeId?: string;
}

const CreateTaskModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onCreate,
  users,
  statusOptions,
  projectId,
  currentUserId,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [statusId, setStatusId] = useState<number | "">("");
  const [assigneeId, setAssigneeId] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  // Defaults: the first column, and yourself if you are a member.
  const effectiveStatusId: number | undefined =
    statusId === "" ? statusOptions[0]?.status_id : statusId;
  const effectiveAssigneeId =
    assigneeId || (users.some((user) => user.user_id === currentUserId) ? currentUserId : "");

  const close = () => {
    setTitle("");
    setDescription("");
    setStatusId("");
    setAssigneeId("");
    setFormErrors({});
    setApiError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: FormErrors = {};
    if (!title.trim()) errors.title = "Enter a title";
    if (!effectiveAssigneeId) errors.assigneeId = "Choose who this is assigned to";
    setFormErrors(errors);
    if (Object.keys(errors).length > 0 || effectiveStatusId === undefined) return;

    setLoading(true);
    setApiError("");

    try {
      await onCreate({
        ticketData: {
          name: title.trim(),
          description: description.trim(),
          project_id: projectId,
          created_by: currentUserId,
          status_id: effectiveStatusId,
        },
        userId: effectiveAssigneeId,
      });
      close();
    } catch {
      setApiError("The task could not be created. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={close} title="New task">
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          label="Title"
          placeholder="What needs to be done?"
          autoFocus
          value={title}
          onChange={(value) => {
            setTitle(value);
            setFormErrors((prev) => ({ ...prev, title: undefined }));
          }}
          error={formErrors.title}
          required
        />

        <TextField
          label="Description"
          placeholder="Add details, links or acceptance criteria"
          value={description}
          onChange={setDescription}
          multiline
          rows={4}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Status"
            value={effectiveStatusId ?? ""}
            onChange={(value) => setStatusId(Number(value))}
            options={statusOptions.map((status) => ({
              label: status.name,
              value: status.status_id,
            }))}
          />

          <Select
            label="Assignee"
            value={effectiveAssigneeId}
            onChange={(value) => {
              setAssigneeId(value);
              setFormErrors((prev) => ({ ...prev, assigneeId: undefined }));
            }}
            options={users.map((user) => ({
              label: displayNameOf(user),
              value: user.user_id,
            }))}
            placeholder="Choose a member"
            error={formErrors.assigneeId}
          />
        </div>

        {apiError && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {apiError}
          </p>
        )}

        <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create task
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTaskModal;
