import { createFileRoute } from "@tanstack/react-router";
import SearchBox from "../../../../components/ui/SearchBox";
import CognifyButton from "../../../../components/ui/CognigyButton";

import UserTable from "../../../../components/ui/UserTable";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchAllUsers } from "../../../../services/userService";
import { addUsersToProject } from "../../../../services/projectService";
import { toast } from "react-toastify";
import { useState } from "react";
import queryClient from "../../../../queryClient";

export const Route = createFileRoute(
  "/_authenticated/project/$projectId/settings"
)({
  component: SettingPage,
});

function SettingPage() {
  const { projectId } = Route.useParams();

  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    new Set()
  );

  const toggleSelectUser = (userId: string) => {
    setSelectedUserIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });

  const addUsersMutation = useMutation({
    mutationFn: (userList: any) =>
      addUsersToProject(userList, Number(projectId)),
    onSuccess: (data) => {
      console.log("Users added successfully!");
      toast.success(
        `Users added successfully! Number of users added: ${data.addedCount}`
      );

      // Invalidate the query to refetch project users after mutation
      queryClient.invalidateQueries({ queryKey: ["projectUsers", projectId] });
    },
    onError: (error: any) => {
      console.error("Failed to add users:", error);
    },
  });

  const handleAddUsers = () => {
    addUsersMutation.mutate([...selectedUserIds]);
  };

  return (
    <section className="flex flex-col gap-8 p-6">
      <p className="font-bold text-2xl">Settings</p>

      <section className="flex gap-6 items-center">
        <img
          src="/images/user-management.png"
          alt="User management icon"
          className="w-9 h-9"
        />
        <section className="flex flex-col text-[#5B6274]">
          <p className="font-medium text-2xl ">User Management</p>
          <p className="font-normal text-sm">
            Manage your team members and their account permissions here
          </p>
        </section>
      </section>

      <div className="">
        <hr className="text-[#5B6274]" />
      </div>

      <section className="flex justify-between">
        <section className="flex gap-6">
          <SearchBox value={""} onChange={() => {}} />
          <CognifyButton
            label="Search"
            customColor="#1868DB"
            textColor="white"
            onClick={() => {}}
            disabled={false}
          />
        </section>
        <section>
          <CognifyButton
            label="Add User"
            customColor="#1868DB"
            textColor="white"
            onClick={handleAddUsers}
            disabled={selectedUserIds.size === 0 || addUsersMutation.isPending}
          />
        </section>
      </section>

      {isLoading ? (
        <p>Loading users...</p>
      ) : isError ? (
        <p className="text-red-500">Failed to load users: {error.message}</p>
      ) : (
        <UserTable
          data={users}
          selectedUserIds={selectedUserIds}
          toggleSelectUser={toggleSelectUser}
        />
      )}
    </section>
  );
}
