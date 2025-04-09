import { createFileRoute } from "@tanstack/react-router";

import KanbanBoard from "../components/kanban/Kanban";
export const Route = createFileRoute("/kanban")({
  component: KanbanBoard,
});

// function RouteComponent() {
//   return <div>Hello "/kanban"!</div>
// }
