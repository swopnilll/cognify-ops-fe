export interface Task {
  id: number;
  title: string;
  description?: string;
  status: number; // status_id
  assignee: string; // user_id, or "" when unassigned
  assigneeName?: string;
  assigneePicture?: string;
  ticketKey?: string; // e.g. "DEMO-12"
}

export type Status = number;

export interface IStatuses {
  status_id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

// Shape of a user as returned by /api/projects/:projectId/users
export interface ProjectUser {
  user_id: string;
  email: string;
  name: string;
  picture: string;
  user_metadata: { fullName: string };
  role_id: number | null;
}
