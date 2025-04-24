import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { useMutation } from "@tanstack/react-query";

import CognifyInput from "../ui/CognifyInput";
import CognifyButton from "../ui/CognigyButton";
import React, { useState } from "react";

import { createProject } from "../../services/projectService";
import { useAuth } from "../../hooks/useAuthV2";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated: () => void;
}

const CreateProjectModal: React.FC<Props> = ({ open, onOpenChange, onProjectCreated }) => {
  const { user: authUser } = useAuth();

  const [name, setName] = useState("");
  const [key, setKey] = useState("");

  const [errors, setErrors] = useState<{ name?: string; key?: string }>({});

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      console.log("Project created successfully:", data);
      toast.success("Project created successfully!");
      onOpenChange(false);
      onProjectCreated();
    },
    onError: (error: any) => {
      console.error("Error creating project:", error);
    },
  });

  const handleSubmit = () => {
    const validationErrors: { name?: string; key?: string } = {};
    if (!name.trim()) validationErrors.name = "Project name is required";
    if (!key.trim()) validationErrors.key = "Project key is required";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      if (authUser) {
        mutation.mutate({
          userId: authUser.id,
          name,
          project_key: key,
        });
      } else {
        console.error("User is not authenticated");
      }
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed top-[25%] left-[25%] w-[50vw] h-[50vh] bg-white shadow-2xl rounded-lg z-50 flex flex-col p-6 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-2xl font-bold">
              Create Project
            </Dialog.Title>
            <Dialog.Close asChild>
              <button>
                <X className="w-6 h-6" />
              </button>
            </Dialog.Close>
          </div>

          <p className="text-gray-600 mb-6">
            Discover the potential of seamless collaboration with your team.
          </p>

          <div className="flex flex-1 gap-6">
            <div className="flex flex-col gap-4 w-2/3 justify-center items-center">
              <CognifyInput
                label="Name of the project"
                value={name}
                onChange={setName}
                required
                error={errors.name}
              />
              <CognifyInput
                label="Key"
                value={key}
                onChange={setKey}
                required
                error={errors.name}
              />
            </div>

            <div className="flex flex-col items-center justify-center w-1/3">
              <img
                src="images/kanban-template.svg"
                alt="Kanban Template"
                className="max-w-full h-auto"
              />
              <p className="mt-4 font-semibold text-center">Kanban Template</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <CognifyButton
              variant="outlined"
              customColor="#1868DB"
              textColor="white"
              label="Create Project"
              onClick={handleSubmit}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateProjectModal;
