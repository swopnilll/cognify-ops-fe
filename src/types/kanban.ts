// types/kanban.ts
export interface Task {
  id: number;
  title: string;
  description?: string;
  status: Status;
}

export type Status = "todo" | "inprogress" | "done";
