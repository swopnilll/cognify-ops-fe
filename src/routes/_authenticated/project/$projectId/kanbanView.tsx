import { createFileRoute } from '@tanstack/react-router'
import KanbanBoard from '../../../../components/kanban/Kanban'

export const Route = createFileRoute(
  '/_authenticated/project/$projectId/kanbanView',
)({
  component: RouteComponent,
})

function RouteComponent() {
   const { projectId } = Route.useParams();

  return <KanbanBoard projectId={Number(projectId)} />
}
