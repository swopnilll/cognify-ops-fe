import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/project/$projectId/ai-portal',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/project/$projectId/ai-portal"!</div>
}
