import React, { useState } from "react";
import Modal from "./ui/Modal";
import { Status } from "../types/kanban";
import CognifySelect from "./ui/CognifySelect";
import CognifyInput from "./ui/CognifyInput";
import CognifyButton from "./ui/CognigyButton";

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
  users?: User[];
}

interface FormErrors {
  title?: string;
  description?: string;
  status?: string;
  assigneeId?: string;
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
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset form on close
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("todo");
    setAssigneeId(undefined);
    setFormErrors({});
    setApiError("");
  };

  // Validate the form and return any error messages
  const validateForm = () => {
    const errors: FormErrors = {};

    // Validate title
    if (!title.trim()) {
      errors.title = "Title is required.";
    }

    // Validate description
    if (!description.trim()) {
      errors.description = "Description is required.";
    }

    // Validate status
    if (!status) {
      errors.status = "Status is required.";
    }

    // Validate assignee
    if (assigneeId === undefined) {
      errors.assigneeId = "Assignee is required.";
    }

    return errors;
  };

  // Handle the form submission
  const handleSubmit = async () => {
    // Clear previous errors
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Start loading and reset API errors
    setLoading(true);
    setApiError("");

    try {
      await onCreate({ title, description, status, assigneeId });
      resetForm();
      onClose();
    } catch (err) {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Clear the relevant form error when input changes
  const handleInputChange =
    (
      setter: React.Dispatch<React.SetStateAction<any>>,
      field: keyof FormErrors
    ) =>
    (value: string) => {
      setter(value);
      setFormErrors((prev) => ({
        ...prev,
        [field]: "", // Clear the error for this field when the user starts typing
      }));
    };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
      <section className="flex flex-col gap-6 mt-12 mb-10 px-2 sm:px-4">
        <CognifyInput
          label="Title"
          placeholder="Task title"
          value={title}
          onChange={handleInputChange(setTitle, "title")}
          required
          error={formErrors.title}
        />

        <CognifyInput
          label="Description"
          placeholder="Task description"
          value={description}
          onChange={handleInputChange(setDescription, "description")}
          multiline
          rows={4}
          required
          error={formErrors.description}
        />

        <CognifySelect
          label="Status"
          value={status}
          onChange={(val) => {
            setStatus(val as Status);
            setFormErrors((prev) => ({
              ...prev,
              status: "", // Clear status error when selection changes
            }));
          }}
          options={[
            { label: "To Do", value: "todo" },
            { label: "In Progress", value: "inprogress" },
            { label: "Done", value: "done" },
          ]}
          required
          error={formErrors.status}
        />

        <CognifySelect
          label="Assignee"
          value={assigneeId?.toString() || ""}
          onChange={(val) => {
            setAssigneeId(val ? Number(val) : undefined);
            setFormErrors((prev) => ({
              ...prev,
              assigneeId: "", // Clear assignee error when selection changes
            }));
          }}
          options={users.map((user) => ({
            label: user.name,
            value: user.id.toString(),
          }))}
          required
          error={formErrors.assigneeId}
        />

        {apiError && (
          <p className="text-sm text-red-600 font-medium -mt-2">{apiError}</p>
        )}

        <div className="flex justify-end gap-4 mt-4">
          <CognifyButton
            label="Cancel"
            customColor="primary"
            variant="outlined"
            textColor="black"
            onClick={() => {
              resetForm();
              onClose();
            }}
          />

          <CognifyButton
            label={loading ? "Creating..." : "Create Task"}
            customColor="blue"
            textColor="white"
            onClick={handleSubmit}
            disabled={loading}
          />
        </div>
      </section>
    </Modal>
  );
};

export default CreateTaskModal;
