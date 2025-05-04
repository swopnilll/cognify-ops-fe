export interface Task {
  id: number;
  title: string;
  description?: string;
  status: number; // status_id is now number
  assignee: string;
}

export type Status = number;

export interface IStatuses {
  status_id: number;
  name: string;
  created_at: string;
  updated_at: string;
}
