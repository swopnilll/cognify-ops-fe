import { useQuery } from "@tanstack/react-query";
import { fetchProjectsForUser } from "../services/projectService";
import { useAuth } from "./useAuthV2";

export interface Project {
  project_id: number;
  name: string;
  project_key: string;
  description?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  role_id?: number;
}

// All projects the signed-in user belongs to.
export function useProjects() {
  const { user } = useAuth();

  return useQuery<Project[]>({
    queryKey: ["projects", user?.id],
    queryFn: () => fetchProjectsForUser(user!.id),
    enabled: !!user,
  });
}

// One project, looked up in the user's project list.
export function useProject(projectId: number) {
  const query = useProjects();
  const project = query.data?.find((p) => p.project_id === projectId);

  return { project, isLoading: query.isLoading };
}
