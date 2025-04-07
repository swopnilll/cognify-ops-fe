import { createFileRoute } from '@tanstack/react-router'

import CreateProject from '../../pages/Projects/createProject'

export const Route = createFileRoute('/projects/create')({
  component: CreateProject,
})
