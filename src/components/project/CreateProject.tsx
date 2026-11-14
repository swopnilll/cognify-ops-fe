import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "react-toastify";

import { createProject } from "../../services/projectService";
import { useAuth } from "../../hooks/useAuthV2";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import TextField from "../ui/TextField";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated: () => void;
}

// "Website Redesign" -> "WR", "Billing" -> "BILL"
const suggestKey = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const letters =
    words.length > 1 ? words.map((word) => word[0]).join("") : (words[0] ?? "").slice(0, 4);
  return letters.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 5);
};

const CreateProjectModal: React.FC<Props> = ({ open, onOpenChange, onProjectCreated }) => {
  const { user: authUser } = useAuth();

  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [keyEdited, setKeyEdited] = useState(false);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ name?: string; key?: string }>({});
  const [submitError, setSubmitError] = useState("");

  const close = () => {
    setName("");
    setKey("");
    setKeyEdited(false);
    setDescription("");
    setErrors({});
    setSubmitError("");
    onOpenChange(false);
  };

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      toast.success("Project created");
      close();
      onProjectCreated();
    },
    onError: () => {
      setSubmitError("The project could not be created. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors: { name?: string; key?: string } = {};
    if (!name.trim()) validationErrors.name = "Enter a project name";
    if (!key.trim()) validationErrors.key = "Enter a project key";
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0 && authUser) {
      mutation.mutate({
        userId: authUser.id,
        name: name.trim(),
        project_key: key.trim(),
        description: description.trim(),
      });
    }
  };

  return (
    <Modal
      isOpen={open}
      onClose={close}
      title="New project"
      description="A project holds a board of tasks and its own knowledge base."
    >
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          label="Name"
          placeholder="Website redesign"
          autoFocus
          value={name}
          onChange={(value) => {
            setName(value);
            setErrors((prev) => ({ ...prev, name: undefined }));
            if (!keyEdited) setKey(suggestKey(value));
          }}
          error={errors.name}
          required
        />
        <TextField
          label="Key"
          placeholder="WR"
          value={key}
          onChange={(value) => {
            setKey(value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8));
            setKeyEdited(true);
            setErrors((prev) => ({ ...prev, key: undefined }));
          }}
          error={errors.key}
          hint="A short prefix for task numbers, for example WR-12"
          required
        />
        <TextField
          label="Description"
          placeholder="What is this project for?"
          value={description}
          onChange={setDescription}
          multiline
          rows={3}
        />

        {submitError && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {submitError}
          </p>
        )}

        <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" loading={mutation.isPending}>
            Create project
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
