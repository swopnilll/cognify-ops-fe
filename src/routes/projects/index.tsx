import { createFileRoute } from '@tanstack/react-router'

import ProjectList from '../../pages/Projects/ProjectList'

export const Route = createFileRoute('/projects/')({
  component: ProjectList,
})



// TODO: project list page