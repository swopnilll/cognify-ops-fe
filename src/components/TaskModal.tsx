import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";

import { ProjectUser, Task } from "../types/kanban";
import { displayNameOf, ticketsQueryKey } from "../hooks/useProjectTickets";
import { KanbanStatus } from "../services/statusService";
import {
  createTicket,
  deleteTicket,
  TicketPriority,
  TicketType,
  updateTicket,
  updateTicketAssignee,
  updateTicketStatus,
  UpdateTicketPayload,
} from "../services/ticketService";
import { PRIORITY_OPTIONS, TYPE_OPTIONS } from "../utils/ticketMeta";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import Select from "./ui/Select";
import TextField from "./ui/TextField";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null; // the task to edit; leave out to create a new one
  users: ProjectUser[];
  statusOptions: KanbanStatus[];
  projectId: number;
  currentUserId: string;
}

interface FormErrors {
  title?: string;
  assigneeId?: string;
}

// Creates a task, or edits and deletes an existing one.
const TaskModal: React.FC<Props> = ({
  isOpen,
  onClose,
  task = null,
  users,
  statusOptions,
  projectId,
  currentUserId,
}) => {
  const queryClient = useQueryClient();
  const isEdit = task !== null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<TicketType>("task");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [statusId, setStatusId] = useState<number | "">("");
  const [assigneeId, setAssigneeId] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // Fill the form each time the modal opens.
  useEffect(() => {
    if (!isOpen) return;
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setType(task?.type ?? "task");
    setPriority(task?.priority ?? "medium");
    setDueDate(task?.dueDate ?? "");
    setStatusId(task?.status ?? "");
    setAssigneeId(task?.assignee ?? "");
    setFormErrors({});
    setApiError("");
    setConfirmingDelete(false);
    // Only when it opens: a background refetch must not overwrite what the
    // user is typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, task?.id]);

  // Defaults for a new task: the first column, and yourself if you are a member.
  const effectiveStatusId: number | undefined =
    statusId === "" ? statusOptions[0]?.status_id : statusId;
  const effectiveAssigneeId =
    assigneeId ||
    (!isEdit && users.some((user) => user.user_id === currentUserId) ? currentUserId : "");

  const busy = saving || deleting;
  const refreshTickets = () =>
    queryClient.invalidateQueries({ queryKey: ticketsQueryKey(projectId) });

  const saveNew = async () => {
    await createTicket({
      ticketData: {
        name: title.trim(),
        description: description.trim(),
        project_id: projectId,
        created_by: currentUserId,
        status_id: effectiveStatusId as number,
        type,
        priority,
        due_date: dueDate || null,
      },
      userId: effectiveAssigneeId,
    });
    toast.success("Task created");
  };

  // Sends only what changed. Status and assignee have their own endpoints.
  const saveChanges = async (current: Task) => {
    const changes: UpdateTicketPayload = {};
    if (title.trim() !== current.title) changes.name = title.trim();
    if (description.trim() !== (current.description ?? "")) {
      changes.description = description.trim();
    }
    if (type !== current.type) changes.type = type;
    if (priority !== current.priority) changes.priority = priority;
    if (dueDate !== (current.dueDate ?? "")) changes.due_date = dueDate || null;

    if (Object.keys(changes).length > 0) await updateTicket(current.id, changes);
    if (effectiveStatusId !== undefined && effectiveStatusId !== current.status) {
      await updateTicketStatus(current.id, effectiveStatusId);
    }
    if (effectiveAssigneeId !== current.assignee) {
      await updateTicketAssignee(current.id, effectiveAssigneeId);
    }
    toast.success("Task updated");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: FormErrors = {};
    if (!title.trim()) errors.title = "Enter a title";
    if (!effectiveAssigneeId) errors.assigneeId = "Choose who this is assigned to";
    setFormErrors(errors);
    if (Object.keys(errors).length > 0 || effectiveStatusId === undefined) return;

    setSaving(true);
    setApiError("");

    try {
      if (task) await saveChanges(task);
      else await saveNew();
      onClose();
    } catch {
      setApiError(
        task
          ? "The task could not be saved. Please try again."
          : "The task could not be created. Please try again."
      );
    } finally {
      // Also after a failure: part of an edit may have been saved.
      refreshTickets();
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    setDeleting(true);
    setApiError("");

    try {
      await deleteTicket(task.id);
      toast.success("Task deleted");
      refreshTickets();
      onClose();
    } catch {
      setApiError("The task could not be deleted. Please try again.");
      setConfirmingDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={busy ? () => {} : onClose}
      title={isEdit ? `Edit ${task.ticketKey ?? "task"}` : "New task"}
    >
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
            label="Type"
            value={type}
            onChange={(value) => setType(value as TicketType)}
            options={TYPE_OPTIONS}
          />

          <Select
            label="Priority"
            value={priority}
            onChange={(value) => setPriority(value as TicketPriority)}
            options={PRIORITY_OPTIONS}
          />

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

          <TextField label="Due date" type="date" value={dueDate} onChange={setDueDate} />
        </div>

        {apiError && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {apiError}
          </p>
        )}

        {confirmingDelete ? (
          <div className="mt-2 flex flex-col gap-3 rounded-lg bg-red-50 p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-red-800">Delete this task? This cannot be undone.</p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button
                variant="secondary"
                disabled={deleting}
                onClick={() => setConfirmingDelete(false)}
              >
                Keep task
              </Button>
              <Button variant="danger" loading={deleting} onClick={handleDelete}>
                Delete task
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
            {isEdit && (
              <Button
                variant="ghost"
                className="text-red-600 hover:bg-red-50 hover:text-red-700 sm:mr-auto"
                icon={<Trash2 className="h-4 w-4" />}
                disabled={saving}
                onClick={() => setConfirmingDelete(true)}
              >
                Delete
              </Button>
            )}
            <Button
              variant="secondary"
              className={isEdit ? "" : "sm:ml-auto"}
              disabled={saving}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {isEdit ? "Save changes" : "Create task"}
            </Button>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default TaskModal;
