import { createFileRoute } from '@tanstack/react-router'

import ProjectDetailPage from '../../pages/Projects/projectDetails'

export const Route = createFileRoute('/projects/$projectId')({
  component: ProjectDetailPage,
})

