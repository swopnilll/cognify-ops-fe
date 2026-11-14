import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useState } from "react";
import { UserPlus } from "lucide-react";

import PageHeader from "../../../../components/project/PageHeader";
import Avatar from "../../../../components/ui/Avatar";
import Button from "../../../../components/ui/Button";
import SearchBox from "../../../../components/ui/SearchBox";
import Spinner from "../../../../components/ui/Spinner";
import { useProject } from "../../../../hooks/useProject";
import { projectUsersQueryKey } from "../../../../hooks/useProjectTickets";
import { addUsersToProject, fetchUsersForProect } from "../../../../services/projectService";
import { fetchAllUsers } from "../../../../services/userService";
import { ProjectUser } from "../../../../types/kanban";

export const Route = createFileRoute("/_authenticated/project/$projectId/settings")({
  component: SettingPage,
});

interface AvailableUser {
  user_id: string;
  email: string;
  name: string;
  picture: string;
  last_login: string | null;
}

const formatLastLogin = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })
    : "Never";

function SettingPage() {
  const projectId = Number(Route.useParams().projectId);
  const queryClient = useQueryClient();
  const { project } = useProject(projectId);

  const [search, setSearch] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  const usersQuery = useQuery<AvailableUser[]>({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });

  const membersQuery = useQuery<ProjectUser[]>({
    queryKey: projectUsersQueryKey(projectId),
    queryFn: () => fetchUsersForProect(projectId),
  });

  const memberIds = new Set((membersQuery.data ?? []).map((member) => member.user_id));

  const addUsersMutation = useMutation({
    mutationFn: (userIds: string[]) => addUsersToProject(userIds, projectId),
    onSuccess: (_data, userIds) => {
      toast.success(userIds.length === 1 ? "1 member added" : `${userIds.length} members added`);
      setSelectedUserIds(new Set());
      queryClient.invalidateQueries({ queryKey: projectUsersQueryKey(projectId) });
    },
    onError: () => {
      toast.error("The members could not be added. Please try again.");
    },
  });

  const toggleSelectUser = (userId: string) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const searchTerm = search.trim().toLowerCase();
  const visibleUsers = (usersQuery.data ?? []).filter(
    (user) =>
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
  );

  const renderTable = () => {
    if (usersQuery.isLoading || membersQuery.isLoading) return <Spinner />;

    if (usersQuery.isError || membersQuery.isError) {
      return (
        <p className="p-6 text-sm text-red-700">
          The user list could not be loaded. Refresh the page to try again.
        </p>
      );
    }

    if (visibleUsers.length === 0) {
      return <p className="p-6 text-center text-sm text-slate-500">No users match your search.</p>;
    }

    return (
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
          <tr>
            <th className="w-12 px-5 py-3">
              <span className="sr-only">Select</span>
            </th>
            <th className="px-5 py-3">User</th>
            <th className="px-5 py-3">Last login</th>
            <th className="px-5 py-3">Access</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {visibleUsers.map((user) => {
            const isMember = memberIds.has(user.user_id);
            return (
              <tr key={user.user_id} className="hover:bg-slate-50">
                <td className="px-5 py-3.5">
                  <input
                    type="checkbox"
                    aria-label={`Select ${user.name || user.email}`}
                    disabled={isMember}
                    checked={isMember || selectedUserIds.has(user.user_id)}
                    onChange={() => toggleSelectUser(user.user_id)}
                    className="h-4 w-4 rounded border-slate-300 accent-brand-600 disabled:opacity-40"
                  />
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar name={user.name || user.email} src={user.picture || undefined} size={32} />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">{user.name || "—"}</p>
                      <p className="truncate text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">
                  {formatLastLogin(user.last_login)}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5">
                  {isMember ? (
                    <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      Member
                    </span>
                  ) : (
                    <span className="text-slate-400">Not a member</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="p-6">
      <PageHeader projectName={project?.name} title="Settings" />

      <section className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Team members</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Select users to give them access to this project.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SearchBox value={search} onChange={setSearch} placeholder="Search users" />
            <Button
              icon={<UserPlus className="h-4 w-4" />}
              onClick={() => addUsersMutation.mutate([...selectedUserIds])}
              disabled={selectedUserIds.size === 0}
              loading={addUsersMutation.isPending}
            >
              {selectedUserIds.size > 0 ? `Add ${selectedUserIds.size} to project` : "Add to project"}
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">{renderTable()}</div>
      </section>
    </div>
  );
}
