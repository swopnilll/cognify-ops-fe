import { createFileRoute } from '@tanstack/react-router'
import Intellecta from '../../../../components/intellecta/Intellecta'

export const Route = createFileRoute(
  '/_authenticated/project/$projectId/ai-portal',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { projectId } = Route.useParams()

  // Keyed by project: switching projects starts with that project's chats.
  return <Intellecta key={projectId} projectId={Number(projectId)} />
}
