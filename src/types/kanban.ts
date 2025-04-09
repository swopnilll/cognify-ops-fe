// types/kanban.ts
export interface Task {
  id: number;
  title: string;
  description?: string;
  status: Status;
  assignee: String;
}

export type Status = "todo" | "inprogress" | "done";
