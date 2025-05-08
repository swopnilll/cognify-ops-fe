import { createFileRoute } from '@tanstack/react-router'
import Intellecta from '../../../../components/intellecta/Intellecta'

export const Route = createFileRoute(
  '/_authenticated/project/$projectId/ai-portal',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Intellecta />
  )
}
