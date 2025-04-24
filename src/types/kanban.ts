// types/kanban.ts
export interface Task {
  map(arg0: (t: any) => any): (import("@dnd-kit/core").UniqueIdentifier | { id: import("@dnd-kit/core").UniqueIdentifier; })[];
  id: number;
  title: string;
  description?: string;
  status: Status;
  assignee: String;
}

export type Status = "todo" | "inprogress" | "done";
